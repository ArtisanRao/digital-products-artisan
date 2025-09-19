import CategoryPage, { generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("planners-and-productivity");
export default function Page() {
  return <CategoryPage slug="planners-and-productivity" />;
}
