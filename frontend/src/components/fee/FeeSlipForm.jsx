"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Divider,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

export default function FeeReceiptForm() {
  const [form, setForm] = useState({
    receiptNo: "15674",
    date: "",
    studentName: "",
    course: "",
    mobile: "",
    feeFrom: "",
    feeTo: "",
    registrationFee: "",
    courseFee: "",
    other1Name: "",
    other1Amount: "",
    other2Name: "",
    other2Amount: "",
    paidBy: "Cash",
    amountInWords: "",
  });

  const courses = [
    "Web Development",
    "Java Programming",
    "Python",
    "Data Science",
    "Digital Marketing",
    "Graphic Designing",
  ];

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const num = (val) => parseFloat(val || 0);

  const total = useMemo(() => {
    return (
      num(form.registrationFee) +
      num(form.courseFee) +
      num(form.other1Amount) +
      num(form.other2Amount)
    );
  }, [form]);

  return (
    <Box sx={{ bgcolor: "#f0f2f5", py: 5, minHeight: "100vh" }}>
      <Paper
        sx={{
          maxWidth: 900,
          mx: "auto",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e0e0e0",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            bgcolor: "#111",
            color: "#fff",
            textAlign: "center",
            py: 4,
            px: 3,
          }}
        >
          <Stack direction="row" justifyContent="center" spacing={1}>
            <ReceiptLongOutlinedIcon />
            <Typography variant="h4" fontWeight={800}>
              SLEEPWELL SKILL DEVELOPMENT CENTRE
            </Typography>
          </Stack>

          <Typography fontSize={13} sx={{ opacity: 0.8 }}>
            H-92, Vill. Mirpur, Teh. Khudaganj, Dist. Shahjahanpur
          </Typography>

          <Chip
            label="FEE RECEIPT"
            size="small"
            sx={{ mt: 2, bgcolor: "rgba(255,255,255,0.12)", color: "#fff" }}
          />
        </Box>

        <Box sx={{ p: 4 }}>
          {/* TOP */}
          <Stack direction="row" spacing={1} mb={2}>
            <SchoolOutlinedIcon fontSize="small" />
            <Typography fontWeight={700}>Student Details</Typography>
          </Stack>

       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
  
  <Box sx={{ flex: "1 1 200px" }}>
    <TextField fullWidth size="small" label="Receipt No" name="receiptNo" value={form.receiptNo} onChange={handleChange} />
  </Box>

  <Box sx={{ flex: "1 1 200px" }}>
    <TextField fullWidth size="small" type="date" name="date" InputLabelProps={{ shrink: true }} value={form.date} onChange={handleChange} />
  </Box>

  <Box sx={{ flex: "1 1 200px" }}>
    <TextField fullWidth size="small" label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} />
  </Box>

  <Box sx={{ flex: "1 1 400px" }}>
    <TextField fullWidth size="small" label="Student Name" name="studentName" value={form.studentName} onChange={handleChange} />
  </Box>

  <Box sx={{ flex: "1 1 250px" }}>
    <FormControl fullWidth size="small">
      <InputLabel>Course</InputLabel>
      <Select name="course" value={form.course} label="Course" onChange={handleChange}>
        {courses.map((c) => (
          <MenuItem key={c} value={c}>{c}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>

  <Box sx={{ flex: "1 1 200px" }}>
    <TextField fullWidth size="small" label="Fee From" name="feeFrom" value={form.feeFrom} onChange={handleChange} />
  </Box>

  <Box sx={{ flex: "1 1 200px" }}>
    <TextField fullWidth size="small" label="Fee To" name="feeTo" value={form.feeTo} onChange={handleChange} />
  </Box>

</Box>
          <Divider sx={{ my: 4 }} />

          {/* TABLE */}
          <Stack direction="row" spacing={1} mb={2}>
            <PaymentsOutlinedIcon fontSize="small" />
            <Typography fontWeight={700}>Fee Details</Typography>
          </Stack>

          <TableContainer sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#fafafa" }}>
                  <TableCell><b>Particulars</b></TableCell>
                  <TableCell align="right"><b>Amount</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {[
                  ["Registration Fee", "registrationFee"],
                  ["Course Fee", "courseFee"],
                ].map(([label, name]) => (
                  <TableRow key={name}>
                    <TableCell>{label}</TableCell>
                    <TableCell align="right">
                      <TextField size="small" name={name} value={form[name]} onChange={handleChange} />
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell>
                    <TextField size="small" name="other1Name" value={form.other1Name} onChange={handleChange} placeholder="Other Fee" />
                  </TableCell>
                  <TableCell align="right">
                    <TextField size="small" name="other1Amount" value={form.other1Amount} onChange={handleChange} />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <TextField size="small" name="other2Name" value={form.other2Name} onChange={handleChange} placeholder="Other Fee" />
                  </TableCell>
                  <TableCell align="right">
                    <TextField size="small" name="other2Amount" value={form.other2Amount} onChange={handleChange} />
                  </TableCell>
                </TableRow>

                <TableRow sx={{ bgcolor: "#fafafa" }}>
                  <TableCell><b>Total</b></TableCell>
                  <TableCell align="right"><b>₹ {total.toLocaleString()}</b></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* PAYMENT */}
          <Box mt={4}>
            <TextField fullWidth size="small" label="Amount in Words" name="amountInWords" value={form.amountInWords} onChange={handleChange} />

            <Box mt={2}>
              <Typography fontWeight={700} mb={1}>Paid By</Typography>

              <RadioGroup row name="paidBy" value={form.paidBy} onChange={handleChange}>
                {["Cash", "Cheque", "DD", "Other"].map((m) => (
                  <FormControlLabel key={m} value={m} control={<Radio size="small" />} label={m} />
                ))}
              </RadioGroup>
            </Box>
          </Box>

          {/* BUTTON */}
          <Box mt={4} textAlign="right">
            <Button variant="contained" startIcon={<SaveOutlinedIcon />} sx={{ bgcolor: "#111" }}>
              Save Receipt
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}