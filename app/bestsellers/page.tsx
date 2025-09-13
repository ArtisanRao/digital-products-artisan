import { redirect } from "next/navigation";

export default function Page() {
  redirect("/products/best-sellers"); // 308 to canonical
}
