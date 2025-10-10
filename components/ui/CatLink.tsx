"use client";

import * as React from "react";
import Link, { type LinkProps } from "next/link";

type Props = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    className?: string;
    children: React.ReactNode;
  };

/**
 * Minimal, bullet-proof clickable card link:
 *  - No overlay span
 *  - No inner element with pointer events
 *  - Prefetch disabled to avoid RSC fetch noise while debugging
 */
export default function CatLink({
  href,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <Link
      href={href}
      prefetch={false}
      data-card-link
      role="link"
      tabIndex={0}
      className={[
        "block focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2",
        className,
      ].join(" ")}
      style={{ pointerEvents: "auto" }}
      {...rest}
    >
      {/* visuals; keep them simple so the <a> receives the click */}
      <div className="catlink-content">{children}</div>
    </Link>
  );
}
