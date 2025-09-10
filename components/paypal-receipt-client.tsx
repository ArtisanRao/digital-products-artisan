"use client";
import { useEffect, useState } from "react";
type LinkRow = { id: number; title: string; qty: number; unit: number; url: string };

export default function PayPalReceiptClient({ orderId }: { orderId: string }) {
  const [rows, setRows] = useState<LinkRow[] | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("paypal_links_" + orderId);
      if (raw) setRows(JSON.parse(raw));
    } catch {}
  }, [orderId]);

  if (!rows?.length) return null;

  const total = rows.reduce((s, r) => s + r.unit * r.qty, 0);

  return (
    <div className="space-y-4 mt-6">
      <div className="rounded border p-4">
        <h2 className="text-lg font-semibold mb-3">Receipt</h2>
        <table className="w-full text-sm">
          <thead className="text-left">
            <tr>
              <th className="py-2">Item</th>
              <th className="py-2">Qty</th>
              <th className="py-2">Unit</th>
              <th className="py-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="py-2 pr-4">{r.title}</td>
                <td className="py-2">{r.qty}</td>
                <td className="py-2">${r.unit.toFixed(2)}</td>
                <td className="py-2 text-right">${(r.unit * r.qty).toFixed(2)}</td>
              </tr>
            ))}
            <tr className="border-t font-semibold">
              <td className="py-2" colSpan={3}>Total</td>
              <td className="py-2 text-right">${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rounded border p-4">
        <h2 className="text-lg font-semibold mb-3">Your Downloads</h2>
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.id}>
              <a className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" href={r.url}>
                Download: {r.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
