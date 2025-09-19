import CategoryPage, { generateCategoryMetadata } from "../../_category";

export const metadata = generateCategoryMetadata("web-templates/fonts");
export default function Page() {
  return <CategoryPage slug="web-templates/fonts" />;
}
