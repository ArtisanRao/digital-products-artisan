import { CategoryPage, generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("ai-and-chatgpt-guides");
export default function Page() {
  return <CategoryPage slug="ai-and-chatgpt-guides" />;
}
