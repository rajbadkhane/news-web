"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function shouldHandleAnchor(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  if (anchor.target && anchor.target !== "_self") {
    return false;
  }

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) {
    return false;
  }

  return `${url.pathname}${url.search}` !== `${window.location.pathname}${window.location.search}`;
}

export function RouteProgress() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    window.clearTimeout(timeoutRef.current ?? undefined);
    timeoutRef.current = window.setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      window.clearTimeout(timeoutRef.current ?? undefined);
    };
  }, [pathname, isLoading]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;

      if (!anchor || !shouldHandleAnchor(anchor)) {
        return;
      }

      setIsLoading(true);
    }

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className={`route-progress-glow ${isLoading ? "route-progress-glow--active" : ""}`}
      />
      <div
        aria-hidden="true"
        className={`route-progress-shell ${isLoading ? "route-progress-shell--active" : ""}`}
      >
        <span className="loader" />
      </div>
    </>
  );
}
