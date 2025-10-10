// components/ui/CatLink.tsx
"use client";

import * as React from "react";
import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";

type Props = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    className?: string;
    children: React.ReactNode;
  };

export default function CatLink({
  href,
  className = "",
  children,
  onClick,
  ...rest
}: Props) {
  const router = useRouter();

  const forceNav = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement> | React.TouchEvent<HTMLAnchorElement>) => {
      // If something prevented default, still force navigation as a last resort
      if (e.defaultPrevented) {
        try {
          const url = typeof href === "string" ? href : (href as any)?.pathname ?? "#";
          if (url && url !== "#") router.push(url);
        } catch {}
        return;
      }
    },
    [href, router]
  );

  return (
    <Link
      href={href}
      prefetch={false}
      data-card-link
      role="link"
      onClick={(e) => {
        onClick?.(e as any);
        // If any child tried to stop it, ensure we still navigate
        forceNav(e);
      }}
      className={[
        "relative block cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2",
        // Make sure the anchor always receives the tap/click
        "z-[200]",
        className,
      ].join(" ")}
      // iOS tap quirks
      style={{
        WebkitTapHighlightColor: "transparent",
        WebkitTouchCallout: "none",
        touchAction: "manipulation",
      }}
      {...rest}
    >
      {/*👇 Everything visual is non-interactive so it can't eat taps */}
      <div className="catlink-content pointer-events-none">{children}</div>
    </Link>
  );
}
