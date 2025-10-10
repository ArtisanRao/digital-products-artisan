// components/ui/CatLink.tsx
"use client";

import Link, { type LinkProps } from "next/link";
import React, { forwardRef } from "react";

type Props = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    /** default false to avoid heavy hover prefetch on grids */
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
      className={[
        "block cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2",
        "pe-auto", // from globals hotfix (pointer-events: auto)
        className,
      ].join(" ")}
      style={{ pointerEvents: "auto", position: "relative", zIndex: 20, ...style }}
      {...rest}
    >
      {children}
    </Link>
  );
});

export default CatLink;
