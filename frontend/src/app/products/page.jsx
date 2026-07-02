import { Suspense } from "react";
import ProductsPageContent from "./ProductsPageContent.";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}