import { Link } from "react-router-dom";
import {
  ArrowRight,
  Flame,
  Clock,
  Leaf,
  Sparkles,
  Star,
  ChefHat,
  Soup,
  Bike,
} from "lucide-react";
import menuData from "@/data/menu.json";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/format";

const iconMap = {
  Clock,
  Leaf,
  Sparkles,
};

const featuredDishes = menuData.dishes
  .filter((dish) => dish.category === "signature")
  .slice(0, 3);

const combos = menuData.combos;

const testimonials = menuData.testimonials;

export default function Index() {
  const { addItem } = useCart();

  return (
    <div className="relative space-y-20 pb-24">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1600&q=80"
            alt="Bún bò Huế thơm ngon"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
        </div>
        <div className="container grid gap-12 py-24 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Hương vị Huế truyền thống
            </span>
            <h1 className="font-display text-4xl leading-tight text-primary md:text-5xl lg:text-6xl">
              Bún bò Huế An Nhiên
              <span className="block text-foreground/80">
                Đậm đà vị sả, ngọt thanh nước dùng
              </span>
            </h1>
            <p className="max-w-xl text-base text-foreground/70 md:text-lg">
              Tô bún bò chuẩn vị Huế với nước dùng hầm 18 giờ, sợi bún mềm dai,
              rau sống tươi mỗi ngày. Phục vụ nhanh, không gian ấm cúng, giao
              hàng tận nơi trong 30 phút.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Xem thực đơn
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground/80 transition hover:border-primary hover:text-primary"
              >
                Câu chuyện của quán
              </Link>
            </div>
            <dl className="grid grid-cols-2 gap-6 pt-4 sm:grid-cols-3">
              {[
                {
                  label: "Năm thành lập",
                  value: menuData.story.established,
                },
                { label: "Tô phục vụ/ngày", value: "500+" },
                { label: "Đánh giá 5 sao", value: "4.9/5" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm"
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                    {item.label}
                  </dt>
                  <dd className="mt-2 text-2xl font-bold text-foreground">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative grid gap-6 lg:grid-rows-[auto,1fr]">
            <div className="rounded-3xl bg-card/60 p-6 shadow-xl backdrop-blur">
              <div className="flex items-center gap-3 text-primary">
                <Flame className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Đặc sắc nhà bếp
                </span>
              </div>
              <h2 className="mt-4 font-display text-2xl text-foreground">
                Tinh túy từ nước dùng tới topping
              </h2>
              <p className="mt-2 text-sm text-foreground/70">
                Chọn lọc nguyên liệu và gia vị chuẩn Huế, giữ trọn vị ngọt tự
                nhiên.
              </p>
              <div className="mt-6 grid gap-4">
                {menuData.highlights.map((highlight) => {
                  const Icon = iconMap[highlight.icon as keyof typeof iconMap];
                  return (
                    <div
                      key={highlight.id}
                      className="flex items-start gap-4 rounded-2xl border border-border/50 bg-background/60 p-4"
                    >
                      {Icon ? (
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                      ) : null}
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          {highlight.title}
                        </h3>
                        <p className="text-sm text-foreground/70">
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 shadow-xl">
              <div className="flex items-center gap-3 text-primary">
                <Soup className="h-6 w-6" />
                <span className="font-semibold uppercase tracking-[0.2em]">
                  Dịch vụ giao nhanh
                </span>
              </div>
              <p className="mt-4 text-sm text-foreground/70">
                Đặt món trực tuyến, giao nóng hổi trong 30 phút, miễn phí cho
                bán kính 3km.
              </p>
              <div className="mt-6 flex items-center gap-5 rounded-2xl bg-background/80 p-4 shadow-sm">
                <Bike className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Theo dõi lộ trình giao hàng trực tiếp trên ứng dụng.
                  </p>
                  <p className="text-xs text-foreground/60">
                    Ưu đãi giảm 10% cho đơn giao vào khung giờ 14:00 - 17:00.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Món đặc sắc
            </span>
            <h2 className="mt-2 font-display text-3xl text-foreground md:text-4xl">
              Tô bún khiến khách quay lại mỗi tuần
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Xem toàn bộ thực đơn
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredDishes.map((dish) => (
            <article
              key={dish.id}
              className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/80 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent" />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {dish.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-display text-xl text-foreground">
                      {dish.name}
                    </h3>
                    <p className="text-sm text-foreground/70">
                      {dish.description}
                    </p>
                  </div>
                  {dish.spicyLevel ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      <Flame className="h-3 w-3" />
                      {dish.spicyLevel}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-primary">
                    {formatCurrency(dish.price)}
                  </span>
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

      <section className="container grid gap-10 lg:grid-cols-[1fr,1fr]">
        <div className="rounded-[2rem] border border-accent/30 bg-accent/15 p-8 shadow-md backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground">
            Combo tiết kiệm
          </div>
          <h2 className="mt-4 font-display text-3xl text-foreground">
            Các lựa chọn kết hợp yêu thích của khách
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            Đặt nhanh combo cho gia đình hoặc bữa sáng tràn đầy năng lượng.
          </p>
          <div className="mt-6 space-y-4">
            {combos.map((combo) => (
              <div
                key={combo.id}
                className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm sm:flex-row"
              >
                <img
                  src={combo.image}
                  alt={combo.name}
                  className="h-28 w-full rounded-2xl object-cover sm:h-24 sm:w-32"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-foreground">
                      {combo.name}
                    </h3>
                    <span className="text-sm font-bold text-primary">
                      {formatCurrency(combo.price)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70">
                    {combo.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/menu"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-foreground hover:underline"
          >
            Đặt combo ngay
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="rounded-[2rem] border border-primary/20 bg-primary/10 p-8 shadow-md backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Khách hàng nói gì
          </div>
          <h2 className="mt-4 font-display text-3xl text-foreground">
            4.9/5 sao từ hơn 3.000 lượt đánh giá
          </h2>
          <div className="mt-8 space-y-4">
            {testimonials.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-border/40 bg-background/70 p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {review.name}
                    </p>
                    <p className="text-xs text-foreground/60">{review.title}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-primary">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm text-foreground/70">
                  “{review.quote}”
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-to-r from-primary/12 via-primary/5 to-accent/10 p-10">
        <div className="grid gap-8 md:grid-cols-[1.1fr,0.9fr] md:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Đặt bàn & sự kiện
            </div>
            <h2 className="font-display text-3xl text-foreground md:text-4xl">
              Đặt bàn trước để trải nghiệm trọn vẹn hương vị xứ Huế
            </h2>
            <p className="text-sm text-foreground/70">
              Chúng tôi nhận đặt bàn cho nhóm, sinh nhật hoặc tiệc công ty từ 10
              - 40 khách. Chuẩn bị riêng quầy topping và khu vực check-in cho sự
              kiện của bạn.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="tel:0988123456"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Gọi đặt bàn
                <PhoneIcon />
              </a>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground/80 transition hover:border-primary hover:text-primary"
              >
                Xem không gian quán
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
              alt="Không gian quán Bún bò"
              className="h-full w-full rounded-[2rem] object-cover shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 rounded-3xl border border-border/40 bg-background/80 p-6 shadow-xl">
              <div className="flex items-center gap-3 text-primary">
                <ChefHat className="h-6 w-6" />
                <div className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Bếp trưởng 15 năm kinh nghiệm
                </div>
              </div>
              <p className="mt-3 max-w-xs text-xs text-foreground/70">
                Đầu bếp Trí Nguyễn - người mang công th���c gia truyền từ Huế
                vào Sài Gòn, đảm bảo mỗi tô bún đều chuẩn vị.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-4 w-4"
  >
    <path d="M6.62 10.79a15.916 15.916 0 006.59 6.59l2.2-2.2a1 1 0 011.05-.24 12.357 12.357 0 003.86.62 1 1 0 011 1V21a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 12.357 12.357 0 00.62 3.86 1 1 0 01-.24 1.05l-2.26 2.26z" />
  </svg>
);
