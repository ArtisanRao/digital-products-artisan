// components/ui/CatLink.tsx
"use client";

import * as React from "react";
import Link, { type LinkProps } from "next/link";

type Props = LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  className?: string;
  children: React.ReactNode;
};

export default function CatLink({ href, className = "", children, ...rest }: Props) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={[
        "relative block focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2",
        className,
      ].join(" ")}
      {...rest}
    >
      {/* Click/Tab overlay that ensures the card is always tappable */}
      <span className="absolute inset-0 z-10" aria-hidden="true" />
      {/* All the visuals are below and don't intercept clicks */}
      <div className="relative z-0 pointer-events-none">
        {children}
      </div>
    </Link>
  );
}
