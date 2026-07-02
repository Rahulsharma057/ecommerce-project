"use client";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  IconButton,
  Box,
  Radio,
  Divider,
} from "@mui/material";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
export default function AddressList({
  addresses = [],
  selectedAddress,
  onSelect,
  onEdit,
  onDelete,
}) {
  return (
    <Grid container spacing={1}>
      {addresses.map((address) => {
        const selected = selectedAddress?._id === address._id;

        return (
          <Grid key={address._id} size={{ xs: 12, md: 6 }}>
            <Card
              onClick={() => onSelect?.(address)}
              sx={{
                height: "100%",
                borderRadius: 3,
                border: selected ? "2px solid #2563eb" : "1px solid #e5e7eb",
                bgcolor: selected ? "#f8fbff" : "#fff",
                cursor: "pointer",
                transition: ".25s",
                boxShadow: selected ? "0 8px 24px rgba(37,99,235,.12)" : "none",
                 my:1,
                 ml:1,
                 mx:1,

                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 10px 28px rgba(0,0,0,.08)",
                },
              }}
            >
              <CardContent>
                {/* Top */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  sx={{
                    mb: 0, // ya 0
                  }}
                >
                  {/* Left */}
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    {/*   <Radio
                      checked={selected}
                      color="primary"
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => onSelect?.(address)}
                    /> */}

                    <Stack direction="row" spacing={1}>
                      <Chip
                        size="small"
                        color="primary"
                        icon={
                          address.type === "Office" ? (
                            <BusinessOutlinedIcon />
                          ) : (
                            <HomeOutlinedIcon />
                          )
                        }
                        label={address.type}
                      />

                      {address.isDefault && (
                        <Chip size="small" color="success" label="Default" />
                      )}
                    </Stack>
                  </Stack>

                  {/* Right */}
                  <Stack direction="row" spacing={1}>
                    {selected && (
                      <CheckCircleIcon color="primary" sx={{ mr: 0.5 }} />
                    )}

                    {onEdit && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(address);
                        }}
                        sx={{
                          width: 30,
                          height: 30,
                          p: 0.5,
                          bgcolor: "#eef4ff",
                          color: "#2563eb",

                          "&:hover": {
                            bgcolor: "#2563eb",
                            color: "#fff",
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}

                    {onDelete && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(address._id);
                        }}
                        sx={{
                          width: 30,
                          height: 30,
                          p: 0.5,
                          bgcolor: "#fff1f2",
                          color: "#dc2626",

                          "&:hover": {
                            bgcolor: "#dc2626",
                            color: "#fff",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>
                <Divider
                  sx={{
                    my: 1,
                    borderColor: "#e5e7eb",
                  }}
                />
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <PersonRoundedIcon
                      sx={{
                        fontSize: 20,
                        color: "primary.main",
                      }}
                    />

                    <Typography variant="h6" fontWeight={700}>
                      {address.fullName}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <PhoneRoundedIcon
                      sx={{
                        fontSize: 18,
                        color: "text.secondary",
                      }}
                    />

                    <Typography variant="body2" color="text.secondary">
                      {address.phone}
                    </Typography>
                  </Stack>
                  {/* Address */}
                  <Stack
                    direction="row"
                    spacing={1}
                    mt={2}
                    alignItems="flex-start"
                  >
                    <LocationOnOutlinedIcon
                      fontSize="small"
                      color="action"
                      sx={{ mt: "2px" }}
                    />

                    <Box>
                      <Typography variant="body2">
                        {address.house}, {address.area}
                      </Typography>

                      <Typography variant="body2">
                        {address.city}, {address.state} - {address.pincode}
                      </Typography>

                      {address.landmark && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          mt={0.5}
                        >
                          Landmark : {address.landmark}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
