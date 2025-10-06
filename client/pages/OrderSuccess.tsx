import type { ComponentType } from "react";
import type { ComponentType } from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format";
import menuData from "@/data/menu.json";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  StickyNote,
  Store,
  Wallet,
} from "lucide-react";

type Branch = {
  id: string;
  name: string;
  address: string;
  distance?: string;
  hours?: string;
};

type PaymentMethod = "cod" | "momo";

const branches = (menuData.branches ?? []) as Branch[];

interface OrderSuccessItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  note?: string;
}

interface OrderSuccessState {
  order: {
    code: string;
    createdAt?: string;
    etaMinutes?: number;
    subtotal: number;
    deliveryFee: number;
    total: number;
    items: OrderSuccessItem[];
    customer: {
      name: string;
      phone?: string;
      email?: string;
      address?: string;
      note?: string;
      branchId?: string;
      branchName?: string;
      paymentMethod?: string;
      paymentLabel?: string;
    };
    branch?: {
      name: string;
      address?: string;
      distance?: string;
      hours?: string;
    } | null;
    payment?: {
      method?: string;
      label?: string;
      description?: string;
    } | null;
  };
}

const isOrderSuccessState = (value: unknown): value is OrderSuccessState => {
  if (!value || typeof value !== "object" || !("order" in value)) {
    return false;
  }

  const typedValue = value as { order?: unknown };
  if (!typedValue.order || typeof typedValue.order !== "object") {
    return false;
  }

  const order = typedValue.order as Record<string, unknown>;
  return (
    typeof order.code === "string" &&
    typeof order.subtotal === "number" &&
    typeof order.deliveryFee === "number" &&
    typeof order.total === "number" &&
    Array.isArray(order.items) &&
    typeof order.customer === "object" &&
    order.customer !== null
  );
};

const parseDate = (value?: string) => {
  if (!value) {
    return new Date();
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const formatTime = (date: Date) =>
  date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function OrderSuccess() {
  const location = useLocation();
  const state = location.state;
  const order = isOrderSuccessState(state) ? state.order : null;

  if (!order) {
    return (
      <div className="container py-16">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-[2.5rem] border border-border/60 bg-background/90 p-12 text-center shadow-xl backdrop-blur">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl text-foreground md:text-4xl">
            Không tìm thấy thông tin đơn hàng
          </h1>
          <p className="max-w-lg text-sm text-foreground/70 md:text-base">
            Vui lòng kiểm tra lại bước thanh toán hoặc đặt món mới. Nếu bạn cần
            hỗ trợ, An Nhiên luôn sẵn sàng giúp đỡ.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              className="rounded-full px-6 py-3 text-sm font-semibold"
            >
              <Link to="/menu">Quay lại thực đơn</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-full px-6 py-3 text-sm font-semibold"
            >
              <Link to="/checkout">Về trang thanh toán</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const orderDate = parseDate(order.createdAt);
  const itemsTotal = order.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const branchFromMenu = order.customer.branchId
    ? (branches.find((entry) => entry.id === order.customer.branchId) ?? null)
    : null;
  const branchInfo =
    order.branch ??
    branchFromMenu ??
    (order.customer.branchName
      ? {
          name: order.customer.branchName,
          address: "Đang cập nhật",
          distance: undefined,
          hours: undefined,
        }
      : null);

  const paymentMethodRaw =
    order.payment?.method ?? order.customer.paymentMethod ?? "cod";
  const paymentMethod: PaymentMethod =
    paymentMethodRaw === "momo" ? "momo" : "cod";
  const paymentLabel =
    order.payment?.label ??
    order.customer.paymentLabel ??
    (paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Ví MoMo");
  const paymentDescription =
    order.payment?.description ??
    (paymentMethod === "cod"
      ? "Vui lòng chuẩn bị ti���n mặt để giao dịch nhanh chóng."
      : "Bạn sẽ nhận được mã QR MoMo ngay sau cuộc gọi xác nhận.");

  const customerItems = [
    order.customer.phone
      ? { icon: Phone, label: "Số điện thoại", value: order.customer.phone }
      : null,
    {
      icon: Mail,
      label: "Email",
      value: order.customer.email?.trim() || "Chưa cung cấp",
    },
    order.customer.address
      ? { icon: MapPin, label: "Địa chỉ", value: order.customer.address }
      : null,
    order.customer.note
      ? { icon: StickyNote, label: "Ghi chú", value: order.customer.note }
      : null,
  ].filter((item): item is InfoItem => Boolean(item));

  const branchItems = branchInfo
    ? [
        {
          icon: Store,
          label: branchInfo.name,
          value: branchInfo.address ?? "Đang cập nhật",
        },
        branchInfo.distance
          ? {
              icon: MapPin,
              label: "Khoảng cách",
              value: branchInfo.distance,
            }
          : null,
        branchInfo.hours
          ? {
              icon: Clock,
              label: "Giờ hoạt động",
              value: branchInfo.hours,
            }
          : null,
      ].filter((item): item is InfoItem => Boolean(item))
    : null;

  const paymentItems: InfoItem[] = [
    {
      icon: Wallet,
      label: paymentLabel,
      value: paymentDescription,
    },
  ];

  return (
    <div className="container py-16">
      <section className="rounded-[2.5rem] border border-primary/30 bg-primary/10 p-8 shadow-lg backdrop-blur md:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-3">
              <Badge className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Đơn hàng đã ghi nhận
              </Badge>
              <h1 className="font-display text-4xl text-foreground md:text-5xl">
                Đặt hàng thành công!
              </h1>
              <p className="max-w-2xl text-sm text-foreground/80 md:text-base">
                Cảm ơn bạn đã tin tưởng An Nhiên. Chúng tôi đang chuẩn bị món và
                sẽ liên hệ trong ít phút để xác nhận thời gian giao hàng.
              </p>
            </div>
          </div>
          <div className="space-y-2 rounded-2xl border border-primary/30 bg-background/80 px-6 py-4 text-sm text-foreground/80 shadow">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Mã đơn
            </p>
            <p className="font-display text-2xl text-foreground md:text-3xl">
              {order.code}
            </p>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/60">
              <Clock className="h-4 w-4" />
              Đặt lúc {formatTime(orderDate)} ngày {formatDate(orderDate)}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.25fr,0.75fr]">
        <div className="space-y-10">
          <section className="rounded-[2rem] border border-border/60 bg-background/95 p-8 shadow-xl backdrop-blur">
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-foreground">
                  Tổng quan đơn hàng
                </h2>
                <p className="text-sm text-foreground/70">
                  {itemsTotal} món · Thành tiền {formatCurrency(order.total)}
                </p>
              </div>
              {typeof order.etaMinutes === "number" ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Clock className="h-4 w-4" />
                  Dự kiến {order.etaMinutes} phút
                </div>
              ) : null}
            </header>

            <div className="mt-8 space-y-6">
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-border/60 bg-background/80 p-4"
                  >
                    <div>
                      <p className="font-semibold text-foreground">
                        {item.quantity} × {item.name}
                      </p>
                      {item.note ? (
                        <p className="mt-1 text-xs text-foreground/60">
                          Ghi chú: {item.note}
                        </p>
                      ) : null}
                    </div>
                    <p className="text-sm font-semibold text-foreground/80">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="bg-border/60" />

              <div className="space-y-2 text-sm text-foreground/80">
                <div className="flex items-center justify-between">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Phí vận chuyển</span>
                  <span>
                    {order.deliveryFee === 0
                      ? "Miễn phí"
                      : formatCurrency(order.deliveryFee)}
                  </span>
                </div>
                <Separator className="bg-border/60" />
                <div className="flex items-center justify-between text-base font-semibold text-foreground">
                  <span>Tổng thanh toán</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border/60 bg-background/95 p-8 shadow-xl backdrop-blur">
            <header className="space-y-2">
              <h2 className="font-display text-2xl text-foreground">
                Các bước tiếp theo
              </h2>
              <p className="text-sm text-foreground/70">
                Để đảm bảo món đến tay bạn đúng giờ và đúng ý, hãy lưu ý những
                điều dưới đây.
              </p>
            </header>
            <div className="mt-6 space-y-5">
              <StepItem
                index={1}
                title="Sẵn sàng nghe điện thoại"
                description="Nhân viên xác nhận đơn sẽ gọi từ số tổng đài An Nhiên trong vòng 2 phút."
              />
              <StepItem
                index={2}
                title="Chuẩn bị thanh toán"
                description={
                  paymentMethod === "cod"
                    ? "Vui lòng chuẩn bị tiền mặt để giao dịch nhanh chóng."
                    : "Bạn sẽ nhận được mã QR MoMo ngay sau cuộc gọi xác nhận."
                }
              />
              <StepItem
                index={3}
                title="Kiểm tra thông tin nhận hàng"
                description="Nếu cần thay đổi địa chỉ hoặc ghi chú, hãy thông báo ngay khi được liên hệ."
              />
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <InfoCard
            title="Thông tin khách hàng"
            description="Chúng tôi sẽ liên hệ dựa trên thông tin dưới đây."
            items={customerItems}
          />

          {branchItems ? (
            <InfoCard
              title="Chi nhánh phục vụ"
              description="Món sẽ được chuẩn bị từ chi nhánh gần bạn nhất."
              items={branchItems}
            />
          ) : null}

          <InfoCard
            title="Phương thức thanh toán"
            description="Bạn có thể thay đổi khi nhân viên liên hệ nếu cần."
            items={paymentItems}
          />

          <div className="rounded-[2rem] border border-primary/30 bg-primary/10 p-6 text-center shadow-lg">
            <p className="font-display text-xl text-foreground">
              Cần hỗ trợ thêm?
            </p>
            <p className="mt-2 text-sm text-foreground/70">
              Gọi ngay hotline <span className="font-semibold">1900 6686</span>
              hoặc nhắn qua Zalo Official của An Nhiên để được hỗ trợ ngay.
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <Button
          asChild
          className="rounded-full px-6 py-3 text-sm font-semibold shadow-lg shadow-primary/30"
        >
          <Link to="/menu">Tiếp tục đặt món</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-full px-6 py-3 text-sm font-semibold"
        >
          <Link to="/">Về trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}

type InfoItem = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
};

interface InfoCardProps {
  title: string;
  description: string;
  items: InfoItem[];
}

const InfoCard = ({ title, description, items }: InfoCardProps) => (
  <section className="rounded-[2rem] border border-border/60 bg-background/95 p-6 shadow-xl backdrop-blur">
    <header className="space-y-2">
      <h3 className="font-display text-xl text-foreground">{title}</h3>
      <p className="text-sm text-foreground/70">{description}</p>
    </header>
    <div className="mt-5 space-y-4">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <item.icon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
              {item.label}
            </p>
            <p className="text-sm text-foreground">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

interface StepItemProps {
  index: number;
  title: string;
  description: string;
}

const StepItem = ({ index, title, description }: StepItemProps) => (
  <div className="flex gap-4 rounded-2xl border border-border/60 bg-background/80 p-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
      {index}
    </div>
    <div className="space-y-1">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-sm text-foreground/70">{description}</p>
    </div>
  </div>
);
