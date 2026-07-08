import axios from "axios";
import { API_URL } from "@/lib/api";

// ==============================
// Frontend Models
// ==============================

export const getModels = () => {
  return axios.get(`${API_URL}/model-showcase`);
};

// ==============================
// Admin Models
// ==============================

export const getAdminModels = () => {
  return axios.get(`${API_URL}/model-showcase/admin`);
};

// ==============================
// Create
// ==============================

export const createModel = (formData) => {
  return axios.post(`${API_URL}/model-showcase`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ==============================
// Update
// ==============================

export const updateModel = (id, formData) => {
  return axios.put(`${API_URL}/model-showcase/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ==============================
// Delete
// ==============================

export const deleteModel = (id) => {
  return axios.delete(`${API_URL}/model-showcase/${id}`);
};

// ==============================
// Toggle Visibility
// ==============================

export const toggleVisibility = (id) => {
  return axios.patch(`${API_URL}/model-showcase/toggle/${id}`);
};
