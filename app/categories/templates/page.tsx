import CategoryPage, { generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("templates");
export default function Page() {
  return <CategoryPage slug="templates" />;
}
