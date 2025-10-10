// components/ui/CatLink.tsx
"use client";

import * as React from "react";
import Link, { type LinkProps } from "next/link";

type Props = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    className?: string;
    children: React.ReactNode;
  };

export default function CatLink({ href, className = "", children, ...rest }: Props) {
  return (
    <Link
      href={href}
      data-card-link
      prefetch={false}
      className={[
        "relative block focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2",
        className,
      ].join(" ")}
      {...rest}
    >
      {/* All visuals go inside .catlink-content so they cannot steal clicks */}
      <div className="catlink-content relative z-0">
        {children}
      </div>
    </Link>
  );
}
