import { useMemo, useState } from "react";
import { ArrowRight, Filter, Flame } from "lucide-react";
import menuData from "@/data/menu.json";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";

const categoryLabels: Record<string, string> = {
  all: "Tất cả",
  signature: "Đặc sắc",
  special: "Biến tấu",
  vegetarian: "Món chay",
  sides: "Ăn kèm",
  beverages: "Đồ uống",
};

const getCategoryLabel = (category: string) =>
  categoryLabels[category as keyof typeof categoryLabels] ?? category;

const uniqueCategories = Array.from(
  new Set(menuData.dishes.map((dish) => dish.category)),
);

const filterOptions = ["all", ...uniqueCategories];

export default function Menu() {
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [spicyOnly, setSpicyOnly] = useState(false);

  const filteredDishes = useMemo(() => {
    return menuData.dishes.filter((dish) => {
      const matchesCategory =
        activeCategory === "all" || dish.category === activeCategory;
      const matchesSpicy =
        !spicyOnly || (dish.spicyLevel ?? "").includes("Cay");
      return matchesCategory && matchesSpicy;
    });
  }, [activeCategory, spicyOnly]);

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1542449049-9c4d4c814265?auto=format&fit=crop&w=1600&q=80"
            alt="Thực đơn Bún bò"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/90 to-background/70" />
        </div>
        <div className="container grid gap-10 py-20 lg:grid-cols-[1fr,0.8fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Thực đơn hôm nay
            </span>
            <h1 className="font-display text-4xl text-foreground md:text-5xl">
              Chọn ngay tô bún yêu thích của bạn
            </h1>
            <p className="text-sm text-foreground/70 md:text-base">
              Các món được cập nhật và thử nghiệm liên tục bởi bếp trưởng. Bạn
              có thể tuỳ chọn mức cay, loại topping hoặc nâng cấp combo chỉ với
              vài cú nhấn chuột.
            </p>
            <div className="flex items-center gap-6 text-sm text-foreground/80">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">18</span>
                <span className="max-w-[8rem] text-xs uppercase tracking-[0.2em] text-foreground/60">
                  Giờ hầm xương mỗi ngày
                </span>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">12+</span>
                <span className="max-w-[9rem] text-xs uppercase tracking-[0.2em] text-foreground/60">
                  Món mới theo mùa trong năm
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-primary/20 bg-primary/10 p-8 shadow-lg backdrop-blur">
            <h2 className="font-display text-xl text-foreground">
              Ưu đãi giờ vàng
            </h2>
            <p className="mt-2 text-sm text-foreground/70">
              Giảm 10% cho đơn online từ 14:00 - 17:00, miễn phí topping chả cua
              cho combo gia đình.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-primary">
              <span className="rounded-full bg-background/80 px-4 py-2">
                Giao nhanh trong 30 phút
              </span>
              <span className="rounded-full bg-background/80 px-4 py-2">
                Tặng kèm rau thơm hữu cơ
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="container space-y-10 pt-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3">
            {filterOptions.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition ${
                  activeCategory === category
                    ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "border-border bg-background/80 text-foreground/70 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {getCategoryLabel(category)}
                {category !== "all" && (
                  <span
                    className={`text-xs ${
                      activeCategory === category
                        ? "text-primary-foreground" // Khi active → trắng
                        : "text-primary/80" // Khi không active → như cũ
                    }`}
                  >
                    {
                      menuData.dishes.filter(
                        (dish) => dish.category === category,
                      ).length
                    }
                  </span>
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSpicyOnly((prev) => !prev)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              spicyOnly
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background/80 text-foreground/70 hover:border-primary/40 hover:text-primary"
            }`}
          >
            <Filter className="h-4 w-4" />
            Chỉ hiện món cay
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredDishes.map((dish) => (
            <article
              key={dish.id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/50 bg-card/90 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent" />
                <div className="absolute bottom-3 left-4 flex gap-2">
                  <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-primary/80">
                    {getCategoryLabel(dish.category)}
                  </span>
                  {dish.spicyLevel ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      <Flame className="h-3 w-3" />
                      {dish.spicyLevel}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="space-y-2">
                  <h3 className="font-display text-xl text-foreground">
                    {dish.name}
                  </h3>
                  <p className="text-sm text-foreground/70">
                    {dish.description}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex flex-col text-sm text-foreground/60">
                    <span className="text-lg font-semibold text-primary">
                      {formatCurrency(dish.price)}
                    </span>
                    {dish.calories ? <span>{dish.calories} kcal</span> : null}
                  </div>
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
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Thêm vào giỏ
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container mt-20 grid gap-8 rounded-[2.5rem] border border-accent/30 bg-accent/15 p-10 shadow-lg backdrop-blur lg:grid-cols-[1fr,0.9fr]">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/25 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground">
            Combo gợi ý
          </span>
          <h2 className="font-display text-3xl text-foreground">
            Tiết kiệm hơn với combo dành riêng cho bạn
          </h2>
          <p className="text-sm text-foreground/70">
            Kết hợp món chính cùng món ăn kèm và thức uống yêu thích, nhận ưu
            đãi vào các khung giờ khác nhau.
          </p>
          <ul className="space-y-3 text-sm text-foreground/70">
            <li>• Ưu đãi 5% khi đặt combo trước 10:30 mỗi ngày.</li>
            <li>• Miễn phí giao hàng trong bán kính 5km cho combo gia đình.</li>
            <li>• Nâng cấp topping chả cua chỉ với 15.000đ.</li>
          </ul>
        </div>
        <div className="grid gap-4">
          {menuData.combos.map((combo) => (
            <div
              key={combo.id}
              className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm sm:flex-row"
            >
              <img
                src={combo.image}
                alt={combo.name}
                className="h-28 w-full rounded-2xl object-cover sm:h-28 sm:w-32"
              />
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {combo.name}
                    </h3>
                    <p className="text-sm text-foreground/70">
                      {combo.description}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {formatCurrency(combo.price)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    addItem(
                      {
                        id: combo.id,
                        name: combo.name,
                        price: combo.price,
                        thumbnail: combo.image,
                      },
                      1,
                    )
                  }
                  className="w-fit mt-auto inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-xs font-semibold text-primary transition hover:border-primary hover:bg-primary/10"
                >
                  Thêm vào giỏ ngay
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
