// components/ui/CatLink.tsx
"use client";

import React from "react";

/**
 * Hard-nav anchor for card links.
 * We extend full anchor attributes so things like `prefetch`, `target`,
 * `data-*` attrs etc. don’t cause TS errors. `prefetch` is ignored.
 */
type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: React.ReactNode;
  prefetch?: boolean; // accepted for compatibility; no effect
};

export default function CatLink({
  href,
  children,
  prefetch, // eslint-disable-line @typescript-eslint/no-unused-vars
  onClick,
  style,
  ...rest
}: Props) {
  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    // allow user-provided onClick first
    onClick?.(e);
    if (e.defaultPrevented) return;

    e.preventDefault();
    if (typeof window !== "undefined") {
      window.location.assign(href);
    }
  };

  return (
    <a
      href={href}
      data-card-link
      onClick={handleClick}
      // ensure anchors can receive clicks even if a parent had pointer-events:none
      style={{ pointerEvents: "auto", ...(style || {}) }}
      {...rest}
    >
      <div className="catlink-content">{children}</div>
    </a>
  );
}
