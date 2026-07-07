"use client";

import axios from "axios";
import InquiryForm from "@/components/common/InquiryForm";
import { API_URL } from "@/lib/api";

export default function PressForm() {
  return (
    <InquiryForm
      title="Media Inquiry"
      buttonText="Send Inquiry"
      initialValues={{
        name: "",
        email: "",
        phone: "",
        organization: "",
        message: "",
      }}
      fields={[
        "name",
        "email",
        "phone",
        "organization",
        "message",
      ]}
      onSubmit={async (data) => {
        await axios.post(`${API_URL}/press`, data);
        alert("Media inquiry submitted successfully.");
      }}
    />
  );
}