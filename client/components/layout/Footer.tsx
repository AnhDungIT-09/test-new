import { Facebook, Instagram, MapPin, Phone, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Trang chủ", to: "/" },
  { label: "Thực đơn", to: "/menu" },
  { label: "Giới thiệu", to: "/about" },
  { label: "Giỏ hàng", to: "/cart" },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border/60 bg-foreground/5 backdrop-blur">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.25fr,1fr,1fr]">
        <div className="space-y-4">
          <h3 className="font-display text-2xl text-primary">
            Bún Bò Huế 1991
          </h3>
          <p className="text-sm text-foreground/70">
            Hương vị Huế đậm đà, chuẩn vị truyền thống với nước dùng ninh 18
            giờ, sợi bún mềm mịn và topping tươi mới mỗi ngày.
          </p>
          <div className="flex items-center gap-3 text-sm font-semibold text-primary">
            <Phone className="h-4 w-4" />
            <a href="tel:0988123456" className="hover:underline">
              0988 123 456
            </a>
          </div>
        </div>
        <div className="space-y-4 text-sm">
          <h4 className="font-semibold text-foreground/80">Liên kết nhanh</h4>
          <nav className="flex flex-col gap-2">
            {footerLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-foreground/70 transition hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="space-y-4 text-sm">
          <h4 className="font-semibold text-foreground/80">Liên hệ</h4>
          <div className="flex items-start gap-3 text-foreground/70">
            <MapPin className="mt-0.5 h-4 w-4 text-primary" />
            <p>12 Lê Lợi, Quận 1, TP. Hồ Chí Minh</p>
          </div>
          <div className="flex items-start gap-3 text-foreground/70">
            <Clock className="mt-0.5 h-4 w-4 text-primary" />
            <p>
              Thứ 2 - Chủ nhật
              <br />
              6:30 - 22:00
            </p>
          </div>
          <div className="flex items-center gap-4 pt-2 text-foreground/70">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 transition hover:border-primary hover:bg-primary/10 hover:text-primary"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 transition hover:border-primary hover:bg-primary/10 hover:text-primary"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/40 bg-background/70 py-5 text-center text-xs text-foreground/60">
        © {new Date().getFullYear()} Bún Bò Huế 1991. Giữ trọn tinh hoa ẩm thực
        xứ Huế.
      </div>
    </footer>
  );
};
