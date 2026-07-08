import axios from "axios";
import { API_URL } from "@/lib/api";

// Home
export const getHomeCollections = () =>
  axios.get(`${API_URL}/home-collections`);

// Admin
export const getAdminHomeCollections = () =>
  axios.get(`${API_URL}/home-collections/admin`);

export const createHomeCollection = (payload) =>
  axios.post(
    `${API_URL}/home-collections`,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const updateHomeCollection = (id,payload)=>
 axios.put(
 `${API_URL}/home-collections/${id}`,
 payload,
 {
 headers:{
  "Content-Type":"multipart/form-data",
 }
 }
);

export const deleteHomeCollection = (id) =>
  axios.delete(`${API_URL}/home-collections/${id}`);

export const toggleHomeCollection = (id) =>
  axios.patch(`${API_URL}/home-collections/toggle/${id}`);