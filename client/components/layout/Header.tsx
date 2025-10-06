import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X, Leaf, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const NAV_ITEMS = [
  { to: "/", label: "Trang chủ" },
  { to: "/menu", label: "Thực đơn" },
  { to: "/about", label: "Giới thiệu" },
  { to: "/cart", label: "Giỏ hàng" },
  { to: "/checkout", label: "Thanh toán" },
];

export const Header = () => {
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="container flex items-center justify-between py-4">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 text-primary font-display text-xl tracking-tight"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Leaf className="h-5 w-5" />
          </span>
          Bún Bò Huế 1991
        </Link>
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "relative text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-foreground/70 hover:text-primary",
                )
              }
            >
              {({ isActive }) => (
                <span className="inline-flex flex-col items-center">
                  {item.label}
                  <span
                    className={cn(
                      "mt-1 h-0.5 w-6 rounded-full bg-primary transition-all",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/cart"
            className="group relative flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/10"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Giỏ hàng</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold px-1">
                {itemCount}
              </span>
            )}
          </Link>
          <Link
            to="/menu"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 transition hover:shadow-lg hover:-translate-y-0.5"
          >
            Đặt món ngay
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-primary"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <div
        className={cn(
          "lg:hidden border-t border-border/60 bg-background shadow-xl transition-all",
          isOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="container flex flex-col gap-4 py-6">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMenu}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between text-base font-semibold",
                  isActive
                    ? "text-primary"
                    : "text-foreground/70 hover:text-primary",
                )
              }
            >
              <span>{item.label}</span>
              {location.pathname === item.to && (
                <span className="h-2 w-2 rounded-full bg-primary" />
              )}
            </NavLink>
          ))}
          <Link
            to="/menu"
            onClick={closeMenu}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Đặt món ngay
          </Link>
        </nav>
      </div>
    </header>
  );
};
