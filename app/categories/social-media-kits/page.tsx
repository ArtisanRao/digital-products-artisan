import { CategoryPage, generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("social-media-kits");
export default function Page() {
  return <CategoryPage slug="social-media-kits" />;
}
