import { CategoryPage, generateCategoryMetadata } from "..//_category";

export const metadata = generateCategoryMetadata("self-help-and-how-to");
export default function Page() {
  return <CategoryPage slug="self-help-and-how-to" />;
}
