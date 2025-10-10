// components/ui/CatLink.tsx
"use client";

import React from "react";

type Props = {
  href: string;
  className?: string;
  "aria-label"?: string;
  children: React.ReactNode;
};

/**
 * Hard-nav anchor for card links.
 * Bypasses Next.js client router + RSC fetch so clicks never stall.
 */
export default function CatLink({ href, className, children, ...rest }: Props) {
  const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined") window.location.assign(href);
  };

  return (
    <a
      href={href}
      data-card-link
      onClick={onClick}
      className={className}
      style={{ pointerEvents: "auto" }}
      {...rest}
    >
      <div className="catlink-content">{children}</div>
    </a>
  );
}
