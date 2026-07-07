import { API_URL } from "@/lib/api";
import axios from "axios";

const API = `${API_URL}/career`;



export const applyJob = (data) =>
  axios.post(`${API}/apply`, data);

export const getApplications = () =>
  axios.get(`${API}/applications`);

export const getApplication = (id) =>
  axios.get(`${API}/application/${id}`);

export const updateApplication = (id, data) =>
  axios.put(`${API}/application/${id}`, data);

export const deleteApplication = (id) =>
  axios.delete(`${API}/application/${id}`);