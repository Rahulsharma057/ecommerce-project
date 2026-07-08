"use client";

import { useEffect, useState } from "react";

import { Box, Button, Typography } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { getLuxuryStory, updateLuxuryStory,deleteLuxuryStory,toggleLuxuryStoryStatus } from "@/services/luxuryStory";

import LuxuryStoryCard from "@/components/luxury/LuxuryStoryCard";
import LuxuryStoryForm from "@/components/luxury/LuxuryStoryForm";

export default function LuxuryStoryPage() {
  const [data, setData] = useState(null);

  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await getLuxuryStory();

      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (form) => {
    await updateLuxuryStory(form);

    setOpen(false);

    fetchData();
  };
  const handleDelete=async()=>{

if(!confirm("Delete Luxury Story?"))
return;


await deleteLuxuryStory();


setData(null);

}

const handleToggle=async()=>{

await toggleLuxuryStoryStatus();

fetchData();

}

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Luxury Story
      </Typography>

      {!data ? (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Luxury Story
        </Button>
      ) : (
        <LuxuryStoryCard data={data} onEdit={() => setOpen(true)} onDelete={handleDelete}

onToggle={handleToggle} />
      )}

      {open && (
        <LuxuryStoryForm
          initialData={data}
          onClose={() => setOpen(false)}
          onSave={handleSave}
        />
      )}
    </Box>
  );
}
