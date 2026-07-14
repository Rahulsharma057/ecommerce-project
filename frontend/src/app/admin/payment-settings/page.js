"use client";

import {
  Box,
  Container,
  Typography,
  Paper,
  Switch,
  Button,
  Divider,
} from "@mui/material";

import { useEffect, useState } from "react";
import {
  getPaymentSettings,
  updatePaymentSettings,
} from "@/services/payment";
import { toast } from "react-toastify";

export default function PaymentSettingsPage() {
  const [data, setData] = useState({
    cod: {
      enabled: true,
    },

    razorpay: {
      enabled: false,
    },
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getPaymentSettings();

      setData({
        cod: {
          enabled: res?.cod?.enabled ?? true,
        },
        razorpay: {
          enabled: res?.razorpay?.enabled ?? false,
        },
      });
    } catch (err) {
      toast.error("Unable to load payment settings");
    }
  };

  const update = (section, key, value) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const save = async () => {
    try {
      await updatePaymentSettings(data);

      toast.success("Payment settings updated");
    } catch (err) {
      toast.error("Unable to save settings");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f6f7fb",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Typography
          variant="h4"
          fontWeight={700}
          mb={3}
        >
          Payment Settings
        </Typography>

        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
          }}
        >
          {/* COD */}

          <Typography
            fontWeight={700}
            mb={1}
          >
            Cash On Delivery
          </Typography>

          <Switch
            checked={data.cod.enabled}
            onChange={(e) =>
              update("cod", "enabled", e.target.checked)
            }
          />

          <Divider sx={{ my: 4 }} />

          {/* Razorpay */}

          <Typography
            fontWeight={700}
            mb={1}
          >
            Online Payment (Razorpay)
          </Typography>

          <Switch
            checked={data.razorpay.enabled}
            onChange={(e) =>
              update("razorpay", "enabled", e.target.checked)
            }
          />

          <Typography
            variant="body2"
            color="text.secondary"
            mt={1}
          >
            Enable this to allow UPI, Cards, Net Banking and Wallet
            payments through Razorpay.
          </Typography>

          <Button
            variant="contained"
            onClick={save}
            sx={{
              mt: 5,
            }}
          >
            Save Settings
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}