import { API_URL } from "@/lib/api";
import axios from "axios";

;

// ==========================
// FRONTEND
// ==========================

export const getFashionSections = async () => {
  return await axios.get(`${API_URL}/fashion-section`);
};

// ==========================
// ADMIN LIST
// ==========================

export const getAdminFashionSections = async () => {
  return await axios.get(`${API_URL}/fashion-section/admin`);
};

// ==========================
// GET SINGLE
// ==========================

export const getFashionSection = async (id) => {
  return await axios.get(`${API_URL}/fashion-section/${id}`);
};

// ==========================
// CREATE
// ==========================

export const createFashionSection = async (formData) => {
  return await axios.post(
    `${API_URL}/fashion-section`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// ==========================
// UPDATE
// ==========================

export const updateFashionSection = async (id, formData) => {
  return await axios.put(
    `${API_URL}/fashion-section/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// ==========================
// DELETE
// ==========================

export const deleteFashionSection = async (id) => {
  return await axios.delete(`${API_URL}/fashion-section/${id}`);
};

// ==========================
// TOGGLE VISIBILITY
// ==========================

export const toggleFashionVisibility = async (id) => {
  return await axios.patch(
    `${API_URL}/fashion-section/toggle/${id}`
  );
};