// components/ui/CatLink.tsx
"use client";

import Link, { LinkProps } from "next/link";
import * as React from "react";

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & { className?: string };

/**
 * Simple Link wrapper:
 * - no legacyBehavior
 * - forwards className/props
 * - prefetch disabled by default
 */
export default function CatLink({
  href,
  prefetch = false,
  className,
  children,
  ...rest
}: Props) {
  return (
    <Link href={href} prefetch={prefetch} className={className} {...rest}>
      {children}
    </Link>
  );
}
