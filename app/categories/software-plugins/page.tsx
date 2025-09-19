import { CategoryPage, generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("software-plugins");
export default function Page() {
  return <CategoryPage slug="software-plugins" />;
}
