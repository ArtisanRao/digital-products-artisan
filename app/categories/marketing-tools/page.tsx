import CategoryPage, { generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("marketing-tools");
export default function Page() {
  return <CategoryPage slug="marketing-tools" />;
}
