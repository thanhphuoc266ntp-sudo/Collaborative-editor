import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_URL || "http://localhost:1410/api";

const API_BASE_URL = rawBaseURL.endsWith("/api")
  ? rawBaseURL
  : `${rawBaseURL.replace(/\/$/, "")}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

const isValidMongoId = (id) => {
  return /^[a-f\d]{24}$/i.test(String(id || ""));
};

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

const extractDocument = (data) => {
  if (data && data.document) return data.document;
  return data;
};

const extractDocuments = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.documents)) return data.documents;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

export const createDocument = async (payload = {}) => {
  const res = await api.post("/documents", {
    title: payload.title || "Tài liệu không tên",
    folderId: payload.folderId || "web-project",
  });

  const document = extractDocument(res.data);
  const documentId = document?._id || document?.id;

  if (!isValidMongoId(documentId)) {
    throw new Error("Backend không trả về _id hợp lệ khi tạo tài liệu.");
  }

  return document;
};

export const getMyDocuments = async () => {
  const res = await api.get("/documents");
  return extractDocuments(res.data);
};

export const getSharedDocuments = async () => {
  const res = await api.get("/documents/shared-with-me");
  return extractDocuments(res.data);
};

export const getDocumentById = async (documentId) => {
  if (!isValidMongoId(documentId)) {
    throw new Error("documentId không hợp lệ.");
  }

  const res = await api.get(`/documents/${documentId}`);
  return extractDocument(res.data);
};

export const updateDocumentTitle = async (documentId, title) => {
  if (!isValidMongoId(documentId)) {
    throw new Error("documentId không hợp lệ.");
  }

  const res = await api.put(`/documents/${documentId}/title`, {
    title: title || "Tài liệu không tên",
  });

  return extractDocument(res.data);
};

export const updateDocumentFolder = async (documentId, folderId) => {
  if (!isValidMongoId(documentId)) {
    throw new Error("documentId không hợp lệ.");
  }

  const res = await api.put(`/documents/${documentId}/folder`, {
    folderId: folderId || "web-project",
  });

  return extractDocument(res.data);
};

export const enableDocumentLinkSharing = async (
  documentId,
  role = "viewer",
) => {
  if (!isValidMongoId(documentId)) {
    throw new Error("documentId không hợp lệ.");
  }

  const res = await api.put(`/documents/${documentId}/link-sharing`, {
    enabled: true,
    role: role === "editor" ? "editor" : "viewer",
  });

  return extractDocument(res.data);
};

export const disableDocumentLinkSharing = async (documentId) => {
  if (!isValidMongoId(documentId)) {
    throw new Error("documentId không hợp lệ.");
  }

  const res = await api.put(`/documents/${documentId}/link-sharing`, {
    enabled: false,
    role: "viewer",
  });

  return extractDocument(res.data);
};

export const shareDocument = async (documentId, email, role = "viewer") => {
  if (!isValidMongoId(documentId)) {
    throw new Error("documentId không hợp lệ.");
  }

  const res = await api.post(`/documents/${documentId}/share`, {
    email,
    role,
  });

  return extractDocument(res.data);
};

export const deleteDocument = async (documentId) => {
  if (!isValidMongoId(documentId)) {
    throw new Error("documentId không hợp lệ.");
  }

  const res = await api.delete(`/documents/${documentId}`);
  return res.data;
};

export default api;
