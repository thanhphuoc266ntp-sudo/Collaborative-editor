import React, { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Editor = lazy(() => import("./pages/Editor"));

const getAuthToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken")
  );
};

function PageLoading() {
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #e0e7ff 100%)",
        color: "#2563eb",
        fontSize: 16,
        fontWeight: 700,
        fontFamily: "'Inter', 'Be Vietnam Pro', Arial, sans-serif",
      }}
    >
      Đang tải MyDocs...
    </div>
  );
}

function ProtectedRoute({ children }) {
  const token = getAuthToken();

  if (!token) {
    localStorage.setItem(
      "redirectAfterLogin",
      window.location.pathname + window.location.search,
    );

    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const token = getAuthToken();

  if (token) {
    return <Navigate to="/editor" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Navigate to="/editor" replace />} />

          <Route
            path="/editor"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editor/:documentId"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          <Route path="*" element={<Navigate to="/editor" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
