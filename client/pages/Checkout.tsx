import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
  Phone,
  Mail,
  NotebookPen,
  Wallet,
  SmartphoneNfc,
  Loader2,
  CheckCircle2,
  ShoppingCart,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart, type CartItem } from "@/context/CartContext";
import menuData from "@/data/menu.json";
import { formatCurrency } from "@/lib/format";

const branches = (menuData.branches ?? []) as Branch[];

const phoneRegex = /^(0|\+84)[0-9]{8,10}$/;

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên"),
  phone: z
    .string()
    .trim()
    .min(9, "Vui lòng nhập số điện thoại")
    .max(13, "Số điện thoại không hợp lệ")
    .refine((value) => phoneRegex.test(value.replace(/\s+/g, "")), {
      message: "Số điện thoại không hợp lệ",
    }),
  email: z
    .union([z.string().trim().email("Email không hợp lệ"), z.literal("")])
    .default(""),
  address: z.string().trim().min(6, "Địa chỉ cần chi tiết hơn"),
  branchId: z.string().min(1, "Vui lòng chọn chi nhánh"),
  paymentMethod: z.enum(["cod", "momo"]),
  note: z
    .union([
      z.string().trim().max(300, "Ghi chú tối đa 300 ký tự"),
      z.literal(""),
    ])
    .default(""),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

type Branch = {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
};

type PaymentMethod = "cod" | "momo";

type PaymentOption = {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

type OrderConfirmation = {
  code: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    note: string;
    branchId: string;
    branchName: string;
    paymentMethod: PaymentMethod;
    paymentLabel: string;
  };
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
};

const paymentMethods: PaymentOption[] = [
  {
    id: "cod",
    label: "Thanh toán khi nhận hàng",
    description: "Trả bằng tiền mặt hoặc quẹt thẻ khi nhận món.",
    icon: Wallet,
  },
  {
    id: "momo",
    label: "Ví MoMo",
    description: "Quét mã QR MoMo sau khi xác nhận đơn.",
    icon: SmartphoneNfc,
  },
];

const getPaymentOption = (id: PaymentMethod | string) =>
  paymentMethods.find((method) => method.id === id);

const formatDeliveryFee = (value: number) =>
  value === 0 ? "Miễn phí" : formatCurrency(value);

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(
    null,
  );

  const deliveryFee = subtotal > 0 ? (subtotal >= 250000 ? 0 : 15000) : 0;
  const total = subtotal + deliveryFee;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      note: "",
      branchId: branches[0]?.id ?? "",
      paymentMethod: "cod",
    },
  });

  const watchedBranchId = form.watch("branchId");
  const watchedPaymentMethod = form.watch("paymentMethod");

  const paymentSelectionChangeRef = useRef(false);

  useEffect(() => {
    if (!watchedPaymentMethod) {
      return;
    }

    if (!paymentSelectionChangeRef.current) {
      paymentSelectionChangeRef.current = true;
      return;
    }

    const selected = getPaymentOption(watchedPaymentMethod);
    if (selected) {
      if (watchedPaymentMethod === "cod") {
        toast.success("Đã chọn thanh toán khi nhận hàng", {
          description:
            "Nhân viên sẽ thu tiền khi giao món tại địa chỉ của bạn.",
        });
      } else {
        // toast.info("Đã chọn thanh toán qua MoMo", {
        //   description:
        //     "Sau khi xác nhận đơn, chúng tôi sẽ gửi mã QR MoMo để bạn thanh toán.",
        // });
      }
    }
  }, [watchedPaymentMethod]);

  const handlePayMomo = async () => {
    const res = await fetch(
      "https://dinhdungit.click/BackEndZaloFnB/api/momo/create_momo_payment.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ amount: String("50000") }),
      },
    );

    const data = await res.json();
    console.log(data);
    if (data?.payUrl) {
      window.location.href = data.payUrl; // chuyển người dùng đến MoMo
    } else {
      alert("Không tạo được thanh toán MoMo");
      console.error(data);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (items.length > 0 && confirmation) {
      setConfirmation(null);
    }
  }, [items.length, confirmation]);

  const branchForDisplay = confirmation
    ? branches.find((branch) => branch.id === confirmation.customer.branchId)
    : branches.find((branch) => branch.id === watchedBranchId);

  const paymentForDisplay = confirmation
    ? getPaymentOption(confirmation.customer.paymentMethod)
    : getPaymentOption(watchedPaymentMethod);

  const summaryItems = confirmation?.items ?? items;
  const summarySubtotal = confirmation?.subtotal ?? subtotal;
  const summaryDeliveryFee = confirmation?.deliveryFee ?? deliveryFee;
  const summaryTotal = confirmation?.total ?? total;

  const handleSubmit = async (values: CheckoutFormValues) => {
    if (items.length === 0) {
      toast.error(
        "Giỏ hàng của bạn đang trống. Vui lòng chọn món trước khi thanh toán.",
      );
      return;
    }

    setIsSubmitting(true);

    const trimmedPhone = values.phone.replace(/\s+/g, "");
    const branch = branches.find((entry) => entry.id === values.branchId);
    const payment = getPaymentOption(values.paymentMethod);
    const orderCode = `BB${Date.now().toString().slice(-6).toUpperCase()}`;
    const orderItems = items.map((item) => ({ ...item }));

    console.log(watchedPaymentMethod);

    if (watchedPaymentMethod === "cod") {
      const order: OrderConfirmation = {
        code: orderCode,
        createdAt: new Date().toISOString(),
        customer: {
          name: values.name.trim(),
          phone: trimmedPhone,
          email: values.email?.trim() ?? "",
          address: values.address.trim(),
          note: values.note?.trim() ?? "",
          branchId: branch?.id ?? values.branchId,
          branchName: branch?.name ?? "",
          paymentMethod: values.paymentMethod,
          paymentLabel: payment?.label ?? "",
        },
        items: orderItems,
        subtotal,
        deliveryFee,
        total,
      };

      await new Promise((resolve) => setTimeout(resolve, 700));

      setConfirmation(order);
      clearCart();
      toast.success(`Đơn hàng ${orderCode} đã được ghi nhận!`);
      form.reset({
        name: "",
        phone: "",
        email: "",
        address: "",
        note: "",
        branchId: values.branchId,
        paymentMethod: values.paymentMethod,
      });
      setIsSubmitting(false);
      navigate("/order-success", { state: { order } });
    } else if (watchedPaymentMethod === "momo") {
      handlePayMomo();
    }
  };

  if (items.length === 0 && !confirmation) {
    return (
      <div className="container py-16">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-[2.5rem] border border-border/60 bg-background/90 p-12 text-center shadow-xl backdrop-blur">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShoppingCart className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl text-foreground md:text-4xl">
            Chưa có món để thanh toán
          </h1>
          <p className="max-w-lg text-sm text-foreground/70 md:text-base">
            Vui lòng quay lại thực đơn để chọn món yêu thích trước khi vào bước
            thanh toán.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Xem thực đơn
            </Link>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground/80 transition hover:border-primary hover:text-primary"
            >
              Về giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Thanh toán
          </span>
          <h1 className="mt-3 font-display text-4xl text-foreground md:text-5xl">
            Hoàn tất đơn hàng của bạn
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-foreground/70 md:text-base">
            Điền thông tin nhận hàng, chọn chi nhánh gần nhất và phương thức
            thanh toán phù hợp. Nhân viên 1991 sẽ liên hệ trong 2 phút để xác
            nhận đơn.
          </p>
        </div>
        <Badge className="w-fit rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
          Bảo đảm bữa ăn nóng hổi
        </Badge>
      </div>

      {confirmation ? (
        <div className="mt-10 rounded-[2rem] border border-primary/20 bg-primary/10 p-6 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4 text-primary">
              <CheckCircle2 className="h-10 w-10" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Đơn hàng đã gửi thành công
                </p>
                <p className="font-display text-2xl text-foreground">
                  Mã đơn: {confirmation.code}
                </p>
              </div>
            </div>
            <div className="text-sm text-foreground/70">
              Đặt lúc{" "}
              {new Date(confirmation.createdAt).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              , ngày{" "}
              {new Date(confirmation.createdAt).toLocaleDateString("vi-VN")}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr,0.9fr]">
        <div className="rounded-[2rem] border border-border/60 bg-background/90 p-8 shadow-xl backdrop-blur">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-10"
            >
              <section className="space-y-6">
                <header className="space-y-2">
                  <h2 className="font-display text-2xl text-foreground">
                    Thông tin khách hàng
                  </h2>
                  <p className="text-sm text-foreground/70">
                    Chúng tôi sẽ liên hệ để xác nhận đơn và thời gian giao.
                  </p>
                </header>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input placeholder="VD: Nguyễn Lan Anh" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input placeholder="VD: 0988 123 456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (không bắt buộc)</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Email để nhận hóa đơn"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Địa chỉ giao hàng</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder="Số nhà, tên đường, phường/xã..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Ghi chú cho bếp/shipper</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={2}
                            placeholder="Ví dụ: Ít cay, giao giờ nghỉ trưa..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <Separator className="bg-border/60" />

              <section className="space-y-6">
                <header className="space-y-2">
                  <h2 className="font-display text-2xl text-foreground">
                    Chi nhánh gần bạn
                  </h2>
                  <p className="text-sm text-foreground/70">
                    Chọn chi nhánh để đảm bảo món ăn nóng hổi và giao nhanh
                    nhất.
                  </p>
                </header>
                <FormField
                  control={form.control}
                  name="branchId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid gap-4"
                        >
                          {branches.map((branch) => (
                            <label
                              key={branch.id}
                              htmlFor={`branch-${branch.id}`}
                              className={`flex cursor-pointer items-start gap-4 rounded-2xl border bg-background/80 p-4 transition hover:border-primary/40 ${
                                field.value === branch.id
                                  ? "border-primary bg-primary/10 shadow-lg"
                                  : "border-border/60"
                              }`}
                            >
                              <RadioGroupItem
                                id={`branch-${branch.id}`}
                                value={branch.id}
                                className="mt-1"
                              />
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-foreground">
                                  {branch.name}
                                </p>
                                <p className="text-sm text-foreground/70 flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-primary" />
                                  {branch.address}
                                </p>
                                <div className="flex flex-wrap gap-3 text-xs text-foreground/60">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary">
                                    <Clock className="h-3.5 w-3.5" />{" "}
                                    {branch.hours}
                                  </span>
                                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-accent-foreground">
                                    {branch.distance} từ bạn
                                  </span>
                                </div>
                              </div>
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <Separator className="bg-border/60" />

              <section className="space-y-6">
                <header className="space-y-2">
                  <h2 className="font-display text-2xl text-foreground">
                    Phương thức thanh toán
                  </h2>
                  <p className="text-sm text-foreground/70">
                    Bạn có thể thay đổi hình thức khi nhân viên liên hệ xác
                    nhận.
                  </p>
                </header>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid gap-4 sm:grid-cols-2"
                        >
                          {paymentMethods.map((method) => {
                            const Icon = method.icon;
                            const selected = field.value === method.id;

                            return (
                              <label
                                key={method.id}
                                htmlFor={`payment-${method.id}`}
                                className={`flex cursor-pointer flex-col gap-3 rounded-2xl border bg-background/80 p-4 transition hover:border-primary/40 ${
                                  selected
                                    ? "border-primary bg-primary/10 shadow-lg"
                                    : "border-border/60"
                                }`}
                              >
                                <RadioGroupItem
                                  id={`payment-${method.id}`}
                                  value={method.id}
                                  className="sr-only"
                                />
                                <div className="flex items-center gap-3">
                                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Icon className="h-5 w-5" />
                                  </span>
                                  <div>
                                    <p className="text-sm font-semibold text-foreground">
                                      {method.label}
                                    </p>
                                    <p className="text-xs text-foreground/60">
                                      {method.description}
                                    </p>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <Button
                type="submit"
                className="w-full rounded-full bg-primary px-6 py-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl"
                disabled={isSubmitting || items.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Đang xử lý đơn hàng...
                  </>
                ) : (
                  "Xác nhận thanh toán"
                )}
              </Button>
            </form>
          </Form>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start lg:h-fit">
          <div className="rounded-[2rem] border border-border/60 bg-background/85 p-6 shadow-lg backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Tóm tắt đơn hàng
                </p>
                <h2 className="font-display text-xl text-foreground">
                  {summaryItems.length} món đã chọn
                </h2>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {summaryItems.length === 0 ? (
                <p className="text-sm text-foreground/60">
                  Chưa có món nào trong giỏ hàng.
                </p>
              ) : (
                summaryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card/90 p-4"
                  >
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="h-16 w-16 rounded-2xl object-cover"
                      />
                    ) : null}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {item.name}
                        </p>
                        <span className="text-sm font-semibold text-primary">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/60">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Separator className="mt-6 bg-border/60" />
            <div className="mt-6 space-y-3 text-sm text-foreground/70">
              <div className="flex items-center justify-between">
                <span>Tạm tính</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(summarySubtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Phí giao</span>
                <span className="font-semibold text-primary">
                  {formatDeliveryFee(summaryDeliveryFee)}
                </span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-foreground">
                <span>Tổng cộng</span>
                <span className="text-primary">
                  {formatCurrency(summaryTotal)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/60 bg-background/85 p-6 shadow-lg backdrop-blur">
            <div className="flex items-center gap-3 text-primary">
              <MapPin className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                Chi nhánh phục vụ
              </p>
            </div>
            {branchForDisplay ? (
              <div className="mt-4 space-y-2 text-sm text-foreground/70">
                <p className="text-base font-semibold text-foreground">
                  {branchForDisplay.name}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {branchForDisplay.address}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Giờ mở cửa: {branchForDisplay.hours}
                </p>
                <p className="text-xs text-foreground/60">
                  Khoảng cách ước tính: {branchForDisplay.distance}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-foreground/60">
                Hãy chọn chi nhánh phù hợp để chúng tôi chuẩn bị món nhanh nhất.
              </p>
            )}
            <Separator className="my-6 bg-border/60" />
            <div className="space-y-3 text-sm text-foreground/70">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>0988 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@bunboannhien.vn</span>
              </div>
              {paymentForDisplay ? (
                <div className="flex items-center gap-2">
                  <NotebookPen className="h-4 w-4 text-primary" />
                  <span>{paymentForDisplay.label}</span>
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

if (branches.length === 0) {
  console.warn("Không tìm thấy dữ liệu chi nhánh trong menu.json");
}
