// components/nav/CartBadge.tsx
"use client";
import { useEffect, useState } from "react";
import { count, onChange } from "@/lib/cart";

export default function CartBadge({ className = "" }: { className?: string }) {
  const [c, setC] = useState<number>(0);
  useEffect(() => {
    setC(count());
    return onChange(setC);
  }, []);
  if (!c) return null;
  return (
    <span
      className={`ml-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white ${className}`}
    >
      {c}
    </span>
  );
}
