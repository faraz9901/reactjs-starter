import axios, { type AxiosInstance } from "axios";
import { mockAdapter } from "./mock";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export const axiosAPI: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// No VITE_API_URL configured → serve placeholder responses so the starter
// demonstrates every state offline. Delete this block once the app talks
// to a real API (and set VITE_API_URL in .env).
if (!BASE_URL) {
  axiosAPI.defaults.adapter = mockAdapter;
}
