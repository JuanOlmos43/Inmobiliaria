"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const scrollToTop = () => {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }
};

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  return null;
}
