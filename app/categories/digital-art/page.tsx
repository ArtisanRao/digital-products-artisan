import CategoryPage, { generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("digital-art");
export default function Page() {
  return <CategoryPage slug="digital-art" />;
}
