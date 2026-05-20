import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_URL || "http://localhost:1410/api";

const API_BASE_URL = rawBaseURL.endsWith("/api")
  ? rawBaseURL
  : `${rawBaseURL.replace(/\/$/, "")}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const getDataArray = (data, key) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data[key])) return data[key];
  return [];
};

export const createDocument = async (payload = {}) => {
  const res = await api.post("/documents", payload);
  return res.data.document || res.data;
};

export const getMyDocuments = async () => {
  const res = await api.get("/documents");
  return getDataArray(res.data, "documents");
};

export const getSharedDocuments = async () => {
  const res = await api.get("/documents/shared-with-me");
  return getDataArray(res.data, "documents");
};

export const getDocumentById = async (documentId) => {
  const res = await api.get(`/documents/${documentId}`);
  return res.data.document || res.data;
};

export const updateDocumentTitle = async (documentId, title) => {
  const res = await api.put(`/documents/${documentId}/title`, { title });
  return res.data.document || res.data;
};

export const updateDocumentFolder = async (documentId, folderId) => {
  const res = await api.put(`/documents/${documentId}/folder`, { folderId });
  return res.data.document || res.data;
};

export const shareDocument = async (documentId, email, role = "viewer") => {
  const res = await api.post(`/documents/${documentId}/share`, {
    email,
    role,
  });

  return res.data.document || res.data;
};

export const deleteDocument = async (documentId) => {
  const res = await api.delete(`/documents/${documentId}`);
  return res.data;
};

export default api;
