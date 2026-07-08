import axios from "axios";
import { API_URL } from "@/lib/api";

export const getAdvertisements = () =>
  axios.get(`${API_URL}/advertisements/admin`);

export const getAdvertisement = (id) =>
  axios.get(`${API_URL}/advertisements/${id}`);

export const createAdvertisement = (data) =>
  axios.post(`${API_URL}/advertisements`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateAdvertisement = (id, data) =>
  axios.put(`${API_URL}/advertisements/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteAdvertisement = (id) =>
  axios.delete(`${API_URL}/advertisements/${id}`);