"use client";

import { Suspense } from "react";
import CreateAdvertisementPage from "@/components/admin/create-advertiment/CreateAdvertisementPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateAdvertisementPage />
    </Suspense>
  );
}