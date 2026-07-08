"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import AdvertisementForm from "@/components/advertisement/AdvertisementForm";

import {
  createAdvertisement,
  updateAdvertisement,
  getAdvertisement,
} from "@/services/advertisement";

export default function CreateAdvertisementPage() {
  const search = useSearchParams();
  const router = useRouter();

  const id = search.get("id");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (id) {
      getAdvertisement(id).then((res) => {
        setData(res.data.data);
      });
    }
  }, [id]);

  const submit = async (form) => {
    setLoading(true);

    if (id) {
      await updateAdvertisement(id, form);
    } else {
      await createAdvertisement(form);
    }

    setLoading(false);
    router.push("/admin/advertisements");
  };

  return (
    <AdvertisementForm
      initialData={data}
      loading={loading}
      onSubmit={submit}
    />
  );
}