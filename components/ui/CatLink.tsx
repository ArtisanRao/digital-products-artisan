"use client";

import Link, { type LinkProps } from "next/link";
import React, { forwardRef } from "react";

/**
 * Minimal, bullet-proof card/link:
 * - No overlays
 * - Anchor is the only click target
 * - High z-index + pointer-events: auto
 */
type Props = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    prefetch?: boolean | null;
  };

const CatLink = forwardRef<HTMLAnchorElement, Props>(function CatLink(
  { href, prefetch = false, className = "", children, style, ...rest },
  ref
) {
  return (
    <Link
      href={href}
      prefetch={prefetch ?? false}
      ref={ref}
      data-card-link
      className={[
        "block cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2",
        className,
      ].join(" ")}
      style={{ position: "relative", zIndex: 200, pointerEvents: "auto", ...style }}
      {...rest}
    >
      {/* descendants are visuals only; see CSS to disable their pointer events */}
      <div className="catlink-content">{children}</div>
    </Link>
  );
});

export default CatLink;
