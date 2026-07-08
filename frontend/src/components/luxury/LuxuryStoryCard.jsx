"use client";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


export default function LuxuryStoryCard({ data, onEdit, onDelete,
onToggle }) {
  if (!data) {
    return <Typography>Loading...</Typography>;
  }
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 8px 30px rgba(0,0,0,.08)",
      }}
    >
      <CardContent>
        <Grid container spacing={3}>
          {/* IMAGE */}

          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={data.image}
              sx={{
                width: "100%",
                height: 260,
                objectFit: "cover",
                borderRadius: 3,
              }}
            />
          </Grid>

          {/* CONTENT */}

          <Grid item xs={12} md={8}>
            <Chip
              label={data.tagline}
              color="primary"
              sx={{
                mb: 2,
              }}
            />

            <Typography variant="h4" fontWeight={800}>
              {data.title}
            </Typography>

            <Typography color="text.secondary" mt={2}>
              {data.description}
            </Typography>

            <Typography mt={2} fontWeight={600}>
              {data.established}
            </Typography>

            {/* STATS */}

            <Grid container spacing={2} mt={2}>
              {[data.statOne, data.statTwo, data.statThree].map(
                (item, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "#f5f5f5",
                        borderRadius: 3,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="h5" fontWeight={800}>
                        {item?.number}
                      </Typography>

                      <Typography variant="body2">{item?.title}</Typography>
                    </Box>
                  </Grid>
                ),
              )}
            </Grid>

            {/* BUTTONS */}

            <Stack direction="row" spacing={2} mt={4}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={onEdit}
              >
                Update
              </Button>

              <Button
                color="error"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={onDelete}
              >
                Delete
              </Button>
              <Button
variant="outlined"
startIcon={<VisibilityIcon/>}
onClick={onToggle}
>
{
data.status
?
"Hide"
:
"Show"
}

</Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
