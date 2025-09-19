import { CategoryPage, generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("keto-and-diet-guides");
export default function Page() {
  return <CategoryPage slug="keto-and-diet-guides" />;
}
