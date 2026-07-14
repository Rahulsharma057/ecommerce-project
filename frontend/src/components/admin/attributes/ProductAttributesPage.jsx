"use client";

import { useEffect, useState } from "react";
import { Box, Container, Typography, Paper, TextField, Button, Chip, Stack, Tabs, Tab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toast } from "react-toastify";
import { API_URL } from "@/lib/api";

const TABS = [
  { type: "category", label: "Categories" },
  { type: "subCategory", label: "Sub-Categories" },
  { type: "collection", label: "Collections" },
  { type: "brand", label: "Brands" },
  { type: "fabric", label: "Fabrics" },
  { type: "fit", label: "Fit" },
  { type: "pattern", label: "Pattern" },
  { type: "occasion", label: "Occasion" },
  { type: "neckType", label: "Neck Type" },
  { type: "sleeveType", label: "Sleeve Type" },
  { type: "tags", label: "Tags" },
  { type: "countryOfOrigin", label: "Country" },
];

export default function ProductAttributesPage() {
  const [attributes, setAttributes] = useState({});
  const [tab, setTab] = useState(0);
  const [newValue, setNewValue] = useState("");
  const [saving, setSaving] = useState(false);

  const currentType = TABS[tab].type;
  const currentList = attributes[currentType] || [];

  const fetchAttributes = async () => {
    const res = await fetch(`${API_URL}/attributes`);
    setAttributes(await res.json());
  };

  useEffect(() => { fetchAttributes(); }, []);

  const handleAdd = async () => {
    if (!newValue.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/attributes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ type: currentType, value: newValue.trim() }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Failed to add");
      toast.success("Added");
      setNewValue("");
      fetchAttributes();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${API_URL}/attributes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) { toast.success("Removed"); fetchAttributes(); }
    else toast.error("Failed to remove");
  };

  return (
    <Box sx={{ bgcolor: "#f4f6f9", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h5" fontWeight={800} mb={0.5}>Product Form Settings</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Manage the dropdown options used in the Add/Edit Product form.
        </Typography>

        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Tabs
            value={tab} onChange={(e, v) => setTab(v)} variant="scrollable" scrollButtons="auto"
            TabIndicatorProps={{ sx: { bgcolor: "#18181b" } }}
            sx={{ borderBottom: "1px solid #e2e8f0", "& .MuiTab-root": { textTransform: "none", fontWeight: 600 }, "& .Mui-selected": { color: "#18181b !important" } }}
          >
            {TABS.map((t) => <Tab key={t.type} label={t.label} />)}
          </Tabs>

          <Box sx={{ p: 3 }}>
            <Stack direction="row" spacing={1.5} mb={3}>
              <TextField
                fullWidth size="small" placeholder={`Add a new ${TABS[tab].label.toLowerCase()}...`}
                value={newValue} onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <Button
                variant="contained" startIcon={<AddIcon />} disabled={saving || !newValue.trim()} onClick={handleAdd}
                sx={{ bgcolor: "#18181b", textTransform: "none", fontWeight: 600, whiteSpace: "nowrap" }}
              >
                Add
              </Button>
            </Stack>

            {currentList.length === 0 ? (
              <Typography fontSize={13.5} color="text.secondary">No options added yet.</Typography>
            ) : (
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {currentList.map((item) => (
                  <Chip key={item._id} label={item.value} onDelete={() => handleDelete(item._id)} deleteIcon={<DeleteOutlineIcon />} sx={{ bgcolor: "#f4f4f5" }} />
                ))}
              </Stack>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}