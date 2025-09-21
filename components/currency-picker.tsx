"use client";

import { useEffect, useState } from "react";
import {
  getPreferredCurrency,
  setPreferredCurrency,
} from "@/lib/currency";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Props = {
  className?: string;   // <-- allow className from callers
  hidden?: boolean;     // optional: render nothing but keep API flexible
};

export default function CurrencyPicker({ className, hidden }: Props) {
  const [value, setValue] = useState<"usd" | "eur">("usd");

  useEffect(() => {
    setValue(getPreferredCurrency());
  }, []);

  const onChange = (v: string) => {
    const next = v === "eur" ? "eur" : "usd";
    setValue(next);
    setPreferredCurrency(next);
  };

  if (hidden) return null;

  return (
    <div className={className}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[110px]" aria-label="Select currency">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="usd">USD $</SelectItem>
          <SelectItem value="eur">EUR â‚¬</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
