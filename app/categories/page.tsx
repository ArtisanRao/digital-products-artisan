import { CategoryPage, generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("categories");
export default function Page() {
  return <CategoryPage slug="categories" />;
}
