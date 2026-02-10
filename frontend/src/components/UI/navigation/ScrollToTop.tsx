"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll al tope cuando cambia la ruta
    window.scrollTo(0, 0);

    // También asegurar que el body no tenga overflow hidden
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }, [pathname]);

  return null;
}
