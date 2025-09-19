import CategoryPage, { generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("printable-planners");
export default function Page() {
  return <CategoryPage slug="printable-planners" />;
}
