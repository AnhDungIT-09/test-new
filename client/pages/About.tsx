import { Leaf, MapPin, Flame, Sprout, Award } from "lucide-react";
import menuData from "@/data/menu.json";
import { Link } from "react-router-dom";

const values = menuData.story.values;
const timeline = menuData.timeline;

export default function About() {
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=80"
            alt="Không gian quán"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/75" />
        </div>
        <div className="container grid gap-12 py-20 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Câu chuyện 1991
            </span>
            <h1 className="font-display text-4xl text-foreground md:text-5xl">
              Gìn giữ hương vị chuẩn Huế từ 2012
            </h1>
            <p className="text-sm text-foreground/70 md:text-base">
              1991 được sáng lập bởi gia đình chị Hà và anh Trí, những người
              sinh ra tại Huế với mong muốn mang hương vị quê nhà đến mọi người.
              Từ quán nhỏ đầu tiên, chúng tôi đã giữ trọn tinh thần ấm áp và sự
              tỉ mỉ trong từng tô bún.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
                <Leaf className="h-4 w-4" />
                Nguyên liệu hữu cơ
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
                <Flame className="h-4 w-4" />
                Nước dùng gia truyền
              </span>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Thưởng thức ngay hôm nay
            </Link>
          </div>
          <div className="rounded-[2rem] border border-border/60 bg-background/85 p-8 shadow-xl backdrop-blur">
            <h2 className="font-display text-2xl text-foreground">
              Chúng tôi tin vào
            </h2>
            <div className="mt-6 space-y-6">
              {values.map((value) => (
                <div
                  key={value}
                  className="flex items-start gap-4 rounded-2xl border border-border/40 bg-card/90 p-4"
                >
                  <Sprout className="mt-1 h-5 w-5 text-primary" />
                  <p className="text-sm text-foreground/70">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm text-primary">
              Thành lập năm {menuData.story.established} với mục tiêu phục vụ
              món bún bò Huế chuẩn vị cho mọi gia đình Việt.
            </div>
          </div>
        </div>
      </section>

      <section className="container mt-16 space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Dấu mốc
            </span>
            <h2 className="mt-2 font-display text-3xl text-foreground md:text-4xl">
              Hành trình lan tỏa hương vị xứ Huế
            </h2>
          </div>
        </div>
        <div className="relative grid gap-10 lg:grid-cols-[0.4fr,1fr]">
          <div className="rounded-[2rem] border border-border/60 bg-background/90 p-8 shadow-lg">
            <h3 className="text-lg font-semibold text-foreground">
              Từ Huế đến Sài Gòn
            </h3>
            <p className="mt-3 text-sm text-foreground/70">
              Mỗi chi nhánh của 1991 đều giữ thiết kế ấm cúng với ánh đèn vàng,
              bàn gỗ và mùi sả thơm dịu. Đội ngũ hơn 40 nhân viên được đào tạo
              kỹ lưỡng để mang đến trải nghiệm trọn vẹn nhất.
            </p>
            <div className="mt-6 flex flex-col gap-4 text-sm text-foreground/70">
              <span className="inline-flex items-center gap-3">
                <Award className="h-4 w-4 text-primary" />
                Top 10 quán bún bò đáng thử tại TP.HCM (2023)
              </span>
              <span className="inline-flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />3 chi nhánh tại Quận
                1, Phú Nhuận và Thảo Điền
              </span>
            </div>
          </div>
          <ol className="relative space-y-10 border-l border-border/60 pl-10">
            {timeline.map((milestone) => (
              <li key={milestone.year} className="relative">
                <span className="absolute -left-[2.3rem] top-1 flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-semibold text-primary">
                  {milestone.year}
                </span>
                <div className="rounded-2xl border border-border/40 bg-card/90 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground">
                    {milestone.title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/70">
                    {milestone.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container mt-20 overflow-hidden rounded-[2.5rem] border border-primary/20 bg-primary/10 p-10 shadow-lg backdrop-blur">
        <div className="grid gap-10 lg:grid-cols-[1fr,1fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-background/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Không gian ấm cúng
            </span>
            <h2 className="font-display text-3xl text-foreground md:text-4xl">
              Mỗi góc nhỏ đều kể một câu chuyện Huế
            </h2>
            <p className="text-sm text-foreground/70">
              Chúng tôi mang vào quán những chiếc đèn lồng, những bức ảnh về
              sông Hương và tiếng nhạc Trịnh nhẹ nhàng. Hãy ghé đến để cảm nhận
              nhịp sống chậm rãi và thân thuộc.
            </p>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/10"
            >
              Đặt món mang về
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
              alt="Bàn ăn tại quán"
              className="h-full w-full rounded-[1.8rem] object-cover shadow-xl"
            />
            <img
              src="https://images.unsplash.com/photo-1528696892704-5e1122852276?auto=format&fit=crop&w=900&q=80"
              alt="Góc trang trí Huế"
              className="h-full w-full rounded-[1.8rem] object-cover shadow-xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
