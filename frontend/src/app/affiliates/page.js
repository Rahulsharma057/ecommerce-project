"use client"
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import InquiryForm from "@/components/common/InquiryForm";
import { API_URL } from "@/lib/api";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";


const benefits = [
  {
    icon: <PaidOutlinedIcon sx={{ fontSize: 42 }} />,
    title: "Earn Commission",
    description:
      "Promote Veloura products and earn attractive commissions on every successful sale generated through your referral.",
  },
  {
    icon: <CampaignOutlinedIcon sx={{ fontSize: 42 }} />,
    title: "Marketing Support",
    description:
      "Receive banners, product images, promotional creatives and campaign materials to help increase your conversions.",
  },
  {
    icon: <TrendingUpOutlinedIcon sx={{ fontSize: 42 }} />,
    title: "Grow Together",
    description:
      "Build long-term partnerships with one of India's growing fashion brands and grow your audience alongside us.",
  },
];

const suitableFor = [
  "Fashion Influencers",
  "Instagram Creators",
  "YouTubers",
  "Bloggers",
  "Fashion Stylists",
  "Content Creators",
  "College Ambassadors",
  "Affiliate Marketers",
];

export default function AffiliatesPage() {
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
            Veloura Affiliate Program
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              maxWidth: 760,
              mx: "auto",
              lineHeight: 1.9,
            }}
          >
            Love fashion? Join the Veloura Affiliate Program and start earning by
            recommending premium clothing to your audience. Whether you're a
            creator, influencer or marketer, we'd love to partner with you.
          </Typography>
        </Box>

        {/* Benefits */}
        <Grid container spacing={3}>
          {benefits.map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  border: "1px solid #e5e7eb",
                  transition: ".3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,.08)",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Who Can Join */}
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
            mb={4}
          >
            Who Can Join?
          </Typography>

          <Grid container spacing={2}>
            {suitableFor.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Paper
                  elevation={0}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    textAlign: "center",
                    bgcolor: "#f8f8f8",
                    border: "1px solid #ececec",
                  }}
                >
                  <Typography fontWeight={600}>
                    {item}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Process */}
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
            mb={4}
          >
            How It Works
          </Typography>

          <Stack spacing={3}>
            <Typography>
              ✅ Apply to become a Veloura Affiliate Partner.
            </Typography>

            <Typography>
              ✅ Receive your unique referral link.
            </Typography>

            <Typography>
              ✅ Share Veloura products with your audience.
            </Typography>

            <Typography>
              ✅ Earn commission on every successful order.
            </Typography>
          </Stack>
        </Paper>

        {/* Contact */}
        <Paper
          elevation={0}
          sx={{
            mt: 7,
            p: 5,
            borderRadius: 4,
            bgcolor: "#111",
            color: "#fff",
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            mb={3}
          >
            <GroupsOutlinedIcon sx={{ fontSize: 40 }} />

            <Typography
              variant="h4"
              fontWeight={700}
            >
              Become Our Affiliate Partner
            </Typography>
          </Stack>

          <Typography
            sx={{
              opacity: .85,
              lineHeight: 1.8,
              mb: 4,
            }}
          >
            Interested in working with Veloura? We'd love to hear from you.
            Send us your details and we'll get back to you as soon as possible.
          </Typography>

          <Stack spacing={2}>

            <Stack direction="row" spacing={2}>
              <EmailOutlinedIcon />
              <Typography>
                velouraclothingclubkrj@gmail.com
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
              <PhoneOutlinedIcon />
              <Typography>
                +91 9761709422
              </Typography>
            </Stack>

          </Stack>

     <Card
sx={{
mt:4,
bgcolor:"#fff",
color:"#111",
borderRadius:4,
p:3
}}
>


<InquiryForm

title="Apply For Affiliate Partnership"

buttonText="Submit Application"


initialValues={{

name:"",
email:"",
phone:"",
message:""

}}



onSubmit={async(data)=>{


await axios.post(

`${API_URL}/affiliate`,

data

);


alert(
"Affiliate Application Submitted Successfully"
);


}}


/>


</Card>
        </Paper>

      </Container>
    </Box>
  );
}