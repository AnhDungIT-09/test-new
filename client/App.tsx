import "./global.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainLayout } from "@/components/layout/MainLayout";
import { CartProvider } from "@/context/CartContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CartProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="menu" element={<Menu />} />
              <Route path="about" element={<About />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-success" element={<OrderSuccess />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
