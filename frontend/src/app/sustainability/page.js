import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
} from "@mui/material";

export const metadata = {
  title: "Sustainability | Veloura",
  description: "Veloura's commitment towards sustainable and responsible fashion.",
};

const values = [
  {
    title: "Premium Quality Fabrics",
    description:
      "We carefully select fabrics that provide comfort, durability, and long-lasting wear while maintaining premium quality.",
  },
  {
    title: "Responsible Manufacturing",
    description:
      "Our garments are stitched by skilled professionals with attention to quality, ethical practices, and fair working conditions.",
  },
  {
    title: "Waste Reduction",
    description:
      "We continuously improve our production process to reduce unnecessary fabric waste and maximize material efficiency.",
  },
  {
    title: "Eco-Friendly Packaging",
    description:
      "We aim to reduce plastic usage by using recyclable and environmentally responsible packaging materials wherever possible.",
  },
  {
    title: "Quality Over Quantity",
    description:
      "Instead of fast fashion, we focus on producing timeless and durable clothing that customers can enjoy for years.",
  },
  {
    title: "Customer First",
    description:
      "Sustainability also means creating products that customers trust and love without compromising on quality or comfort.",
  },
];

export default function SustainabilityPage() {
  return (
    <Box sx={{ bgcolor: "#fafafa", py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">

        {/* Hero */}
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h3"
            fontWeight={700}
            gutterBottom
          >
            Sustainability at Veloura
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              maxWidth: 760,
              mx: "auto",
              lineHeight: 1.9,
            }}
          >
            At Veloura, sustainability isn't just a trend—it's a responsibility.
            We believe fashion should look good, feel good, and do good for
            people and the planet.
          </Typography>
        </Box>

        {/* Cards */}
        <Grid container spacing={3}>
          {values.map((item) => (
            <Grid item xs={12} md={6} key={item.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  borderRadius: 4,
                  border: "1px solid #e5e7eb",
                  transition: ".3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 30px rgba(0,0,0,.08)",
                  },
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={700}
                  mb={2}
                >
                  {item.title}
                </Typography>

                <Typography
                  color="text.secondary"
                  lineHeight={1.8}
                >
                  {item.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Mission */}
        <Paper
          elevation={0}
          sx={{
            mt: 8,
            p: 5,
            borderRadius: 4,
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            mb={3}
          >
            Our Promise
          </Typography>

          <Typography
            color="text.secondary"
            lineHeight={1.9}
          >
            Every collection we create is designed with quality, durability,
            and responsibility in mind. Our goal is to become one of India's
            most trusted fashion brands while continuously improving our
            manufacturing processes and reducing environmental impact.
          </Typography>
        </Paper>

        {/* Future Goals */}
        <Paper
          elevation={0}
          sx={{
            mt: 5,
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
            Our Future Goals
          </Typography>

          <Stack spacing={2}>
            <Typography>
              ✔ Expand the use of recyclable packaging materials.
            </Typography>

            <Typography>
              ✔ Minimize production waste through smarter manufacturing.
            </Typography>

            <Typography>
              ✔ Introduce more sustainable fabric options.
            </Typography>

            <Typography>
              ✔ Continue delivering premium-quality clothing with ethical production.
            </Typography>

            <Typography>
              ✔ Build a fashion brand that customers can trust for years.
            </Typography>
          </Stack>
        </Paper>

      </Container>
    </Box>
  );
}