import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
} from "@mui/material";

export const metadata = {
  title: "About Us | Veloura",
};

export default function AboutPage() {
  return (
    <Box sx={{ bgcolor: "#fafafa", py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">

        {/* Hero */}
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            fontWeight={700}
            gutterBottom
          >
            About Veloura
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              maxWidth: 760,
              mx: "auto",
              lineHeight: 1.8,
              fontSize: 17,
            }}
          >
            Veloura is a modern fashion brand committed to creating
            premium-quality clothing for men and women. We believe fashion
            should be stylish, comfortable, and accessible for everyone.
          </Typography>
        </Box>

        {/* Story */}
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                border: "1px solid #e5e7eb",
                height: "100%",
              }}
            >
              <Typography
                variant="h4"
                fontWeight={700}
                mb={2}
              >
                Our Story
              </Typography>

              <Typography
                color="text.secondary"
                lineHeight={1.9}
              >
                Veloura was founded by Rahul Sharma and Rekha Raghav with a
                vision of building a trusted Indian clothing brand offering
                premium fashion for every generation.

                <br /><br />

                From casual wear to premium collections, every piece is
                carefully designed and stitched by experienced professionals to
                deliver comfort, elegance, and long-lasting quality.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                border: "1px solid #e5e7eb",
                height: "100%",
              }}
            >
              <Typography
                variant="h4"
                fontWeight={700}
                mb={2}
              >
                Our Mission
              </Typography>

              <Typography
                color="text.secondary"
                lineHeight={1.9}
              >
                Our mission is to provide fashionable clothing with premium
                quality, affordable pricing, and exceptional customer service.

                <br /><br />

                We strive to ensure every customer experiences confidence,
                comfort, and satisfaction whenever they wear Veloura.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Vision */}
        <Paper
          elevation={0}
          sx={{
            mt: 6,
            p: 5,
            borderRadius: 4,
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            mb={2}
          >
            Our Vision
          </Typography>

          <Typography
            color="text.secondary"
            lineHeight={1.9}
          >
            Our vision is to become one of India's most trusted clothing
            brands by delivering high-quality fashion with modern designs,
            ethical production, and excellent customer support.
          </Typography>
        </Paper>

        {/* Why Choose */}
        <Box mt={8}>
          <Typography
            variant="h3"
            fontWeight={700}
            textAlign="center"
            mb={5}
          >
            Why Choose Veloura?
          </Typography>

          <Grid container spacing={3}>
            {[
              "Premium Quality Fabrics",
              "Latest Fashion Trends",
              "Affordable Prices",
              "Fast Delivery",
              "Easy Returns",
              "Friendly Customer Support",
            ].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    height: "100%",
                  }}
                >
                  <Typography
                    fontWeight={700}
                    fontSize={18}
                  >
                    {item}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact */}
        <Paper
          elevation={0}
          sx={{
            mt: 8,
            p: 5,
            borderRadius: 4,
            bgcolor: "#111",
            color: "#fff",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            mb={3}
          >
            Contact Information
          </Typography>

          <Stack spacing={2}>
            <Typography>
              📍 Khurja City, Bulandshahr, Uttar Pradesh - 203131
            </Typography>

            <Typography>
              👤 Founder: Rahul Sharma
            </Typography>

            <Typography>
              👤 Co-Founder: Rekha Raghav
            </Typography>

            <Typography>
              📞 Customer Support: 9761709408
            </Typography>

            <Typography>
              📱 Business: 9761709422
            </Typography>

            <Typography>
              ✉️ velouraclothingclubkrj@gmail.com
            </Typography>

            <Typography>
              ✉️ velouraclothingsupport@gmail.com
            </Typography>
          </Stack>
        </Paper>

      </Container>
    </Box>
  );
}