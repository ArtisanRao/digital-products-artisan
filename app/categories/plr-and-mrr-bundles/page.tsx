import CategoryPage, { generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("plr-and-mrr-bundles");
export default function Page() {
  return <CategoryPage slug="plr-and-mrr-bundles" />;
}
