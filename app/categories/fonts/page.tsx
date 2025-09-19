import CategoryPage, { generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("fonts");
export default function Page() {
  return <CategoryPage slug="fonts" />;
}
