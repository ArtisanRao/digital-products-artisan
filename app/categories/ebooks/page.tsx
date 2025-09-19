import CategoryPage, { generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("ebooks");
export default function Page() {
  return <CategoryPage slug="ebooks" />;
}
