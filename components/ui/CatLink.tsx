"use client";
import Link from "next/link";
import * as React from "react";

type Props = React.ComponentProps<typeof Link>;

/** Link that *never* prefetches (ideal for /categories/* to avoid stale HTML) */
export default function CatLink({ prefetch, ...rest }: Props) {
  return <Link prefetch={false} {...rest} />;
}
