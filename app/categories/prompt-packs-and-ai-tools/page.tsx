import CategoryPage, { generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("prompt-packs-and-ai-tools");
export default function Page() {
  return <CategoryPage slug="prompt-packs-and-ai-tools" />;
}