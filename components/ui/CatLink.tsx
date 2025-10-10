"use client";

import Link, { type LinkProps } from "next/link";
import React, { forwardRef } from "react";

/**
 * Anchor that always navigates:
 * - no overlay spans
 * - pointer-events on
 * - sits above decorative layers
 * - inner content can't steal clicks
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
      data-card-link // used by CSS hotfix below
      className={[
        "block cursor-pointer focus:outline-none",
        "focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2",
        className,
      ].join(" ")}
      // ensure the anchor itself wins the stacking and accepts clicks
      style={{ position: "relative", zIndex: 200, pointerEvents: "auto", ...style }}
      {...rest}
    >
      {/* Make all descendants ignore pointer events by default */}
      <div className="catlink-content">{children}</div>
    </Link>
  );
});

export default CatLink;
