import Link from "next/link";
import { Download, Zap, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const items = [
  {
    icon: Download,
    title: "Instant Downloads",
    desc: "Get your products immediately after purchase with secure, lifetime access.",
    href: "/faq#delivery",
    linkLabel: "How instant downloads work →",
  },
  {
    icon: Zap,
    title: "Expertly Designed",
    desc: "Professional quality resources crafted by industry experts.",
    href: "/support#quality",
    linkLabel: "See our quality standards →",
  },
  {
    icon: Sparkles,
    title: "Always Ready",
    desc: "Available 24/7 when inspiration strikes, wherever you are.",
    href: "/support#access",
    linkLabel: "Access & support details →",
  },
];

export default function Benefits() {
  return (
    <section aria-labelledby="benefits" className="mx-auto max-w-6xl px-4">
      <h2 id="benefits" className="sr-only">Why shop with us</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map(({ icon: Icon, title, desc, href, linkLabel }) => (
          <Card key={title} className="cursor-default select-none transition-shadow hover:shadow-md">
            <CardHeader className="space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10">
                <Icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{desc}</p>
              <Link
                href={href}
                aria-label={linkLabel}
                className="mt-3 inline-block text-sm underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                {linkLabel}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
