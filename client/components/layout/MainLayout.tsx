import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { cn } from "@/lib/utils";

import { Header } from "./Header";
import { Footer } from "./Footer";

export const MainLayout = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
          <p className="text-lg font-semibold text-foreground/80">Loading...</p>
        </div>
      ) : null}

      <div
        className={cn(
          "flex min-h-screen flex-col bg-background/95 transition-opacity duration-500 ease-out",
          isLoading ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};
