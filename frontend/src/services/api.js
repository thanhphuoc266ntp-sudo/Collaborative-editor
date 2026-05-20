import axios from "axios";

const rawApiUrl =
  import.meta.env.VITE_API_URL ||
  "https://collaborative-editor-zegd.onrender.com/api";

const normalizedApiUrl = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/$/, "")}/api`;

const API = axios.create({
  baseURL: normalizedApiUrl,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export const createDocument = async (title = "Tài liệu không tên") => {
  const response = await API.post("/documents", {
    title,
  });

  return response.data;
};

export const getMyDocuments = async () => {
  const response = await API.get("/documents");

  return response.data;
};

export const getSharedDocuments = async () => {
  const response = await API.get("/documents/shared-with-me");

  return response.data;
};

export const getDocumentById = async (documentId) => {
  const response = await API.get(`/documents/${documentId}`);

  return response.data;
};

export const updateDocumentTitle = async (documentId, title) => {
  const response = await API.put(`/documents/${documentId}/title`, {
    title,
  });

  return response.data;
};

export const shareDocument = async (documentId, userId, role = "editor") => {
  const response = await API.post(`/documents/${documentId}/share`, {
    userId,
    role,
  });

  return response.data;
};

export const deleteDocument = async (documentId) => {
  const response = await API.delete(`/documents/${documentId}`);

  return response.data;
};

export default API;
