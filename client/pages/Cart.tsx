import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ChefHat,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/format";
import menuData from "@/data/menu.json";

const recommendedDishes = menuData.dishes
  .filter((dish) => dish.category === "signature")
  .slice(0, 2);

export default function Cart() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const deliveryFee = subtotal > 0 ? (subtotal >= 250000 ? 0 : 15000) : 0;
  const total = subtotal + deliveryFee;
  const { addItem } = useCart();

  return (
    <div className="container py-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Giỏ hàng của bạn
          </span>
          <h1 className="font-display text-4xl text-foreground md:text-5xl">
            Sẵn sàng cho bữa ăn đậm vị Huế
          </h1>
          <p className="max-w-xl text-sm text-foreground/70">
            Kiểm tra lại các topping hoặc chọn thêm món ăn kèm để bữa ăn thêm
            tròn vị. Miễn phí giao hàng cho đơn trên 250.000đ.
          </p>
        </div>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Tiếp tục chọn món
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-12 rounded-[2.5rem] border border-border/60 bg-background/80 p-10 text-center shadow-md">
          <ShoppingBag className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 font-display text-2xl text-foreground">
            Giỏ hàng đang trống
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            Hãy khám phá thực đơn với những tô bún bò đậm vị và chọn món ngay.
          </p>
          <Link
            to="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Xem thực đơn
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr,1fr]">
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card/80 p-4 shadow-sm sm:flex-row sm:items-center"
              >
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="h-32 w-full rounded-2xl object-cover sm:h-28 sm:w-32"
                  />
                ) : null}
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {item.name}
                      </h3>
                      {item.spicyLevel ? (
                        <p className="text-xs text-primary/80">
                          {item.spicyLevel}
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60 hover:text-primary"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="mr-1 inline h-4 w-4" />
                      Xóa
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-background/80 px-3 py-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-primary transition hover:border-primary"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-primary transition hover:border-primary"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-lg font-semibold text-primary">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60 hover:text-primary"
            >
              Xóa toàn bộ giỏ hàng
            </button>
          </div>
          <aside className="space-y-6">
            <div className="rounded-3xl border border-primary/20 bg-primary/10 p-6 shadow-lg">
              <h2 className="font-display text-xl text-foreground">Tạm tính</h2>
              <div className="mt-4 space-y-3 text-sm text-foreground/70">
                <div className="flex items-center justify-between">
                  <span>Giá món</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Phí giao hàng</span>
                  <span className="font-semibold text-primary">
                    {deliveryFee === 0
                      ? "Miễn phí"
                      : formatCurrency(deliveryFee)}
                  </span>
                </div>
              </div>
              <div className="mt-4 border-t border-border/40 pt-4">
                <div className="flex items-center justify-between text-base font-semibold text-foreground">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Tiến hành thanh toán
              </Link>
              <p className="mt-3 text-xs text-foreground/60">
                Sau khi xác nhận, nhân viên sẽ gọi lại trong 2 phút để xác nhận
                topping và địa chỉ giao hàng của bạn.
              </p>
            </div>
            <div className="rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm">
              <div className="flex items-center gap-3 text-primary">
                <ChefHat className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Gợi ý từ bếp trưởng
                </span>
              </div>
              <div className="mt-4 space-y-4">
                {recommendedDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="flex items-start gap-4 rounded-2xl border border-border/40 bg-card/80 p-4"
                  >
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="h-16 w-16 rounded-2xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {dish.name}
                      </p>
                      <p className="text-xs text-foreground/60">
                        {dish.description}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          addItem(
                            {
                              id: dish.id,
                              name: dish.name,
                              price: dish.price,
                              thumbnail: dish.image,
                              spicyLevel: dish.spicyLevel,
                            },
                            1,
                          )
                        }
                        className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
                      >
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
