import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background/95">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
