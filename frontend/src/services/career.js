import { API_URL } from "@/lib/api";
import axios from "axios";

export const applyJob = async (data) => {
  const res = await axios.post(
    `${API_URL}/career/apply`,
    data
  );

  return res.data;
};