import axios from "axios";
import { API_URL } from "@/lib/api";

export const uploadImage = (formData) =>
  axios.post(
    `${API_URL}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );