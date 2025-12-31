"use client";

import { ReactNode, useEffect } from "react";

export default function CalendarLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const scrollContainer = document.querySelector("[data-scroll-container]") as HTMLElement;
    if (scrollContainer) {
      scrollContainer.style.overflow = "visible";
      return () => {
        scrollContainer.style.overflow = "";
      };
    }
  }, []);

  return <>{children}</>;
}
