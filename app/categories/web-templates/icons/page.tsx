import CategoryPage, { generateCategoryMetadata } from "../../_category";

export const metadata = generateCategoryMetadata("web-templates/icons");
export default function Page() {
  return <CategoryPage slug="web-templates/icons" />;
}
