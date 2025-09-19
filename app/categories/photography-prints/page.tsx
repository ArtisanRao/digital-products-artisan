import CategoryPage, { generateCategoryMetadata } from "../_category";

export const metadata = generateCategoryMetadata("photography-prints");
export default function Page() {
  return <CategoryPage slug="photography-prints" />;
}
