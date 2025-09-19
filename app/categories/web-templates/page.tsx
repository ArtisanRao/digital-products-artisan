import CategoryPage, { generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("web-templates");
export default function Page() {
  return <CategoryPage slug="web-templates" />;
}
