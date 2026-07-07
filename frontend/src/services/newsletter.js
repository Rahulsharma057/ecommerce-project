import { API_URL } from "@/lib/api";
import axios from "axios";

export const subscribeNewsletter = (payload) =>
  axios.post(
    `${API_URL}/newsletter/subscribe`,
    payload
  );

  export const getSubscribers = () =>
  axios.get(`${API_URL}/newsletter`);

// Delete subscriber
export const deleteSubscriber = (id) =>
  axios.delete(`${API_URL}/newsletter/${id}`);