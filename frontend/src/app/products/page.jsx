import { Suspense } from "react";
import ProductsPageContent from "@/components/product/ProductsPageContent.";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}