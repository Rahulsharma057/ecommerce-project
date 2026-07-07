import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";

export const metadata = {
  title: "Size Guide | Veloura",
  description: "Find your perfect clothing size with Veloura's size guide.",
};

const mensSizes = [
  { size: "S", chest: "36-38", waist: "30-32", hip: "36-38" },
  { size: "M", chest: "38-40", waist: "32-34", hip: "38-40" },
  { size: "L", chest: "40-42", waist: "34-36", hip: "40-42" },
  { size: "XL", chest: "42-44", waist: "36-38", hip: "42-44" },
  { size: "XXL", chest: "44-46", waist: "38-40", hip: "44-46" },
];

const womensSizes = [
  { size: "XS", bust: "30-32", waist: "24-26", hip: "34-36" },
  { size: "S", bust: "32-34", waist: "26-28", hip: "36-38" },
  { size: "M", bust: "34-36", waist: "28-30", hip: "38-40" },
  { size: "L", bust: "36-38", waist: "30-32", hip: "40-42" },
  { size: "XL", bust: "38-40", waist: "32-34", hip: "42-44" },
];

export default function SizeGuidePage() {
  return (
    <Box sx={{ bgcolor: "#fafafa", py: { xs: 5, md: 8 } }}>
      <Container maxWidth="lg">

        <Typography
          variant="h3"
          fontWeight={700}
          textAlign="center"
          gutterBottom
        >
          Size Guide
        </Typography>

        <Typography
          textAlign="center"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: "auto", mb: 6 }}
        >
          Choosing the correct size ensures the perfect fit.
          All measurements below are in inches.
          If you're between two sizes, we recommend choosing the larger one.
        </Typography>

        <Grid container spacing={4}>

          {/* Men's Size Chart */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography variant="h5" fontWeight={700} mb={2}>
                Men's Size Chart
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Size</b></TableCell>
                      <TableCell><b>Chest</b></TableCell>
                      <TableCell><b>Waist</b></TableCell>
                      <TableCell><b>Hip</b></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {mensSizes.map((row) => (
                      <TableRow key={row.size}>
                        <TableCell>{row.size}</TableCell>
                        <TableCell>{row.chest}</TableCell>
                        <TableCell>{row.waist}</TableCell>
                        <TableCell>{row.hip}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Women's Size Chart */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography variant="h5" fontWeight={700} mb={2}>
                Women's Size Chart
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Size</b></TableCell>
                      <TableCell><b>Bust</b></TableCell>
                      <TableCell><b>Waist</b></TableCell>
                      <TableCell><b>Hip</b></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {womensSizes.map((row) => (
                      <TableRow key={row.size}>
                        <TableCell>{row.size}</TableCell>
                        <TableCell>{row.bust}</TableCell>
                        <TableCell>{row.waist}</TableCell>
                        <TableCell>{row.hip}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} />

        <Typography variant="h4" fontWeight={700} gutterBottom>
          How to Measure
        </Typography>

        <Grid container spacing={3}>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 3,
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography fontWeight={700} mb={1}>
                Chest / Bust
              </Typography>

              <Typography color="text.secondary">
                Measure around the fullest part of your chest while keeping the
                measuring tape level.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 3,
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography fontWeight={700} mb={1}>
                Waist
              </Typography>

              <Typography color="text.secondary">
                Measure around your natural waistline without pulling the tape
                too tightly.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 3,
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography fontWeight={700} mb={1}>
                Hip
              </Typography>

              <Typography color="text.secondary">
                Measure around the fullest part of your hips while standing
                naturally.
              </Typography>
            </Paper>
          </Grid>

        </Grid>

        <Paper
          elevation={0}
          sx={{
            mt: 6,
            p: 4,
            borderRadius: 3,
            bgcolor: "#111",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            Still Unsure About Your Size?
          </Typography>

          <Typography sx={{ mt: 1, opacity: 0.85 }}>
            Contact the Veloura Support Team and we'll help you choose the
            perfect fit before placing your order.
          </Typography>

          <Typography sx={{ mt: 3 }}>
            📞 9761709408
          </Typography>

          <Typography>
            ✉️ velouraclothingsupport@gmail.com
          </Typography>
        </Paper>

      </Container>
    </Box>
  );
}