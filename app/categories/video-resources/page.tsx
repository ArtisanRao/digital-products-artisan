import CategoryPage, { generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("video-resources");
export default function Page() {
  return <CategoryPage slug="video-resources" />;
}
