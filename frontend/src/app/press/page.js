import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Button,
  Card
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PressForm from "@/components/press/PressForm";

export const metadata = {
  title: "Press | Veloura",
  description: "Official media and press information for Veloura.",
};

const sections = [
  {
    icon: <CampaignOutlinedIcon sx={{ fontSize: 34 }} />,
    title: "Brand Story",
    description:
      "Veloura is a premium Indian clothing brand founded to deliver stylish, high-quality apparel for men and women. Every collection combines modern fashion with exceptional craftsmanship.",
  },
  {
    icon: <NewspaperOutlinedIcon sx={{ fontSize: 34 }} />,
    title: "Media Resources",
    description:
      "Journalists, bloggers and digital creators can request brand information, product images, company details and official statements from our media team.",
  },
  {
    icon: <GroupsOutlinedIcon sx={{ fontSize: 34 }} />,
    title: "Collaborations",
    description:
      "We welcome opportunities to collaborate with magazines, fashion influencers, photographers, creators and media publications.",
  },
];

export default function PressPage() {
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
            Press & Media
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              maxWidth: 760,
              mx: "auto",
              lineHeight: 1.9,
            }}
          >
            Welcome to the official Veloura Press Center.
            Here you'll find company information, media contacts,
            collaboration opportunities and official brand resources.
          </Typography>
        </Box>

        {/* Cards */}
        <Grid container spacing={3}>
          {sections.map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  border: "1px solid #e5e7eb",
                  height: "100%",
                  transition: ".3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 35px rgba(0,0,0,.08)",
                  },
                }}
              >
                <Box mb={2}>{item.icon}</Box>

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

        {/* About Brand */}
        <Paper
          elevation={0}
          sx={{
            mt: 7,
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
            About Veloura
          </Typography>

          <Typography
            color="text.secondary"
            lineHeight={1.9}
          >
            Veloura is a fashion brand based in Khurja,
            Bulandshahr, Uttar Pradesh.
            Founded by Rahul Sharma and Rekha Raghav,
            the brand specializes in premium clothing for men and women.
            Our goal is to deliver stylish, comfortable,
            and high-quality apparel while providing excellent customer service.
          </Typography>
        </Paper>

        {/* Contact */}
        <Paper
          elevation={0}
          sx={{
            mt: 6,
            p: 5,
            borderRadius: 4,
            bgcolor: "#111",
            color: "#fff",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            mb={4}
          >
            Media Contact
          </Typography>

          <Stack spacing={2.5}>
            <Stack direction="row" spacing={2} alignItems="center">
              <EmailOutlinedIcon />
              <Typography>
                velouraclothingclubkrj@gmail.com
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <PhoneOutlinedIcon />
              <Typography>
                +91 9761709422
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <LocationOnOutlinedIcon />
              <Typography>
                Khurja City, Bulandshahr,
                Uttar Pradesh - 203131
              </Typography>
            </Stack>
          </Stack>

        <Card
  sx={{
    mt: 4,
    bgcolor: "#fff",
    borderRadius: 4,
    p: 3,
  }}
>
  <PressForm />
</Card>
        </Paper>

      </Container>
    </Box>
  );
}