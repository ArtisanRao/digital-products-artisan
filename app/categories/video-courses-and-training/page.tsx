import CategoryPage, { generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("video-courses-and-training");
export default function Page() {
  return <CategoryPage slug="video-courses-and-training" />;
}
