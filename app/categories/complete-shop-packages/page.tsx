import CategoryPage, { generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("complete-shop-packages");
export default function Page() {
  return <CategoryPage slug="complete-shop-packages" />;
}
