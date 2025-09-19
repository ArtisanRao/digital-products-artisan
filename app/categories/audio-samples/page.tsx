import CategoryPage, { generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("audio-samples");
export default function Page() {
  return <CategoryPage slug="audio-samples" />;
}
