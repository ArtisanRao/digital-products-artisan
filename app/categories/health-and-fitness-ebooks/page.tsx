import { CategoryPage, generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("health-and-fitness-ebooks");
export default function Page() {
  return <CategoryPage slug="health-and-fitness-ebooks" />;
}
