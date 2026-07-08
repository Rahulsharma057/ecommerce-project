import axios from "axios";
import { API_URL } from "@/lib/api";

export const getCategoryHighlights = () =>
  axios.get(`${API_URL}/category-highlights`);

export const getAdminCategoryHighlights = () =>
  axios.get(`${API_URL}/category-highlights/admin`);

export const createCategoryHighlight = (payload) =>
  axios.post(`${API_URL}/category-highlights`, payload);

export const updateCategoryHighlight = (id, payload) =>
  axios.put(`${API_URL}/category-highlights/${id}`, payload);

export const deleteCategoryHighlight = (id) =>
  axios.delete(`${API_URL}/category-highlights/${id}`);

export const toggleCategoryHighlight = (id) =>
  axios.patch(`${API_URL}/category-highlights/toggle/${id}`);