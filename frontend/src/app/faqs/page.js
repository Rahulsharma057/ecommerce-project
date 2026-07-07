"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Grid,
  Paper,
  Chip,
  Stack,
  Button,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Link from "next/link";

const faqs = [
  {
    category: "Orders",
    question: "How can I place an order?",
    answer:
      "Browse products, add your favourite items to cart and proceed to checkout. Complete payment and your order will be confirmed instantly.",
  },
  {
    category: "Orders",
    question: "Can I cancel my order?",
    answer:
      "Yes. Orders can be cancelled before they are shipped. Once shipped, cancellation may not be possible.",
  },
  {
    category: "Shipping",
    question: "How long does delivery take?",
    answer:
      "Most orders are delivered within 3-7 business days depending on your location.",
  },
  {
    category: "Shipping",
    question: "Do you offer free shipping?",
    answer:
      "Yes. Free shipping is available on eligible orders during promotional periods and selected products.",
  },
  {
    category: "Returns",
    question: "Can I return a product?",
    answer:
      "Yes. Products can be returned within 7 days if unused and in original condition.",
  },
  {
    category: "Returns",
    question: "When will I receive my refund?",
    answer:
      "Refunds are generally processed within 5-7 working days after the returned item passes quality inspection.",
  },
  {
    category: "Payments",
    question: "Which payment methods are accepted?",
    answer:
      "We accept UPI, Debit Cards, Credit Cards, Net Banking and Cash on Delivery (where available).",
  },
  {
    category: "Payments",
    question: "Is Cash on Delivery available?",
    answer:
      "Yes, Cash on Delivery is available for selected pin codes.",
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");

  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) =>
      (
        item.question +
        item.answer +
        item.category
      )
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <Box sx={{ bgcolor: "#f8fafc", py: { xs: 5, md: 8 } }}>
      <Container maxWidth="lg">

        {/* Hero */}

        <Box textAlign="center" mb={6}>
          <Typography
            variant="h3"
            fontWeight={800}
            gutterBottom
          >
            Frequently Asked Questions
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              maxWidth: 650,
              mx: "auto",
              mb: 4,
            }}
          >
            Find quick answers about orders, shipping, returns,
            payments and shopping with Veloura.
          </Typography>

          <TextField
            fullWidth
            placeholder="Search your question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              maxWidth: 650,
              mx: "auto",
              bgcolor: "#fff",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Categories */}

        <Grid container spacing={2} mb={5}>
          {[
            {
              icon: <ShoppingBagOutlinedIcon />,
              title: "Orders",
            },
            {
              icon: <LocalShippingOutlinedIcon />,
              title: "Shipping",
            },
            {
              icon: <ReplayOutlinedIcon />,
              title: "Returns",
            },
            {
              icon: <PaymentsOutlinedIcon />,
              title: "Payments",
            },
          ].map((item) => (
            <Grid item xs={6} md={3} key={item.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: "center",
                  border: "1px solid #e5e7eb",
                  borderRadius: 3,
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    mx: "auto",
                    mb: 2,
                    borderRadius: "50%",
                    bgcolor: "#111",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {item.icon}
                </Box>

                <Typography fontWeight={700}>
                  {item.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* FAQs */}

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid #e5e7eb",
          }}
        >
          {filteredFaqs.length === 0 ? (
            <Box textAlign="center" py={6}>
              <HelpOutlineIcon
                sx={{ fontSize: 60, color: "#999" }}
              />

              <Typography
                variant="h6"
                mt={2}
              >
                No questions found
              </Typography>
            </Box>
          ) : (
            filteredFaqs.map((faq, index) => (
              <Accordion
                key={index}
                disableGutters
                elevation={0}
                sx={{
                  borderBottom: "1px solid #eee",
                  "&:before": {
                    display: "none",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Chip
                      label={faq.category}
                      size="small"
                    />

                    <Typography fontWeight={600}>
                      {faq.question}
                    </Typography>
                  </Stack>
                </AccordionSummary>

                <AccordionDetails>
                  <Typography
                    color="text.secondary"
                    lineHeight={1.8}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))
          )}
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
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
          >
            Still need help?
          </Typography>

          <Typography
            sx={{
              color: "#ccc",
              maxWidth: 550,
              mx: "auto",
              mb: 3,
            }}
          >
            Our customer support team is always happy to help
            you with your orders and shopping experience.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              component={Link}
              href="/contact"
              variant="contained"
              sx={{
                bgcolor: "#C9A96E",
                color: "#111",
                fontWeight: 700,
              }}
            >
              Contact Support
            </Button>

            <Button
              component={Link}
              href="/profile/orders"
              variant="outlined"
              sx={{
                color: "#fff",
                borderColor: "#555",
              }}
            >
              Track Order
            </Button>
          </Stack>
        </Paper>

      </Container>
    </Box>
  );
}