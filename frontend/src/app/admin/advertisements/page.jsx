"use client";

import { useEffect, useState } from "react";

import AdvertisementTable from "@/components/advertisement/AdvertisementTable";

import {
  getAdvertisements,
  deleteAdvertisement,
} from "@/services/advertisement";

import { useRouter } from "next/navigation";

import { Box, Button } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

export default function Page() {
  const router = useRouter();

  const [rows, setRows] = useState([]);

  const load = async () => {
    const res = await getAdvertisements();

    setRows(res.data.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete?")) return;

    await deleteAdvertisement(id);

    load();
  };

  return (
    <Box>
      {/* HEADER */}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("/admin/advertisements/create")}
          sx={{
            bgcolor: "#111827",
            borderRadius: 2,
            px: 3,
            py: 1.2,
            fontWeight: 700,

            "&:hover": {
              bgcolor: "#000",
            },
          }}
        >
          Add Advertisement
        </Button>
      </Box>

      <AdvertisementTable
        rows={rows}
        onEdit={(item) =>
          router.push(`/admin/advertisements/create?id=${item._id}`)
        }
        onDelete={remove}
      />
    </Box>
  );
}
