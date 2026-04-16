import axios from "axios";

const API = axios.create({
  baseURL: "https://secure-task-api-production.up.railway.app/api/v1"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;