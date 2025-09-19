import CategoryPage, { generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("icons");
export default function Page() {
  return <CategoryPage slug="icons" />;
}
