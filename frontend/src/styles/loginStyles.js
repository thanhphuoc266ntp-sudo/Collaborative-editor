export const loginStyles = {
  pageWrapper: {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at top left, rgba(59, 130, 246, 0.55), transparent 35%), linear-gradient(135deg, #eef2ff 0%, #e0e7ff 35%, #f8fafc 100%)",
    fontFamily: "'Inter', 'Be Vietnam Pro', Arial, sans-serif",
    padding: "24px",
    boxSizing: "border-box",
  },

  card: {
    position: "relative",
    width: "100%",
    maxWidth: "430px",
    padding: "46px 42px",
    borderRadius: "28px",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    boxShadow:
      "0 30px 80px rgba(15, 23, 42, 0.18), 0 8px 24px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.75)",
    boxSizing: "border-box",
    backdropFilter: "blur(18px)",
  },

  header: {
    textAlign: "center",
    marginBottom: "34px",
  },

  title: {
    margin: "0 0 8px 0",
    color: "#2563eb",
    fontSize: "38px",
    fontWeight: "850",
    letterSpacing: "-0.8px",
    lineHeight: "1.1",
  },

  subtitle: {
    margin: "0",
    color: "#64748b",
    fontSize: "15px",
    fontWeight: "500",
    lineHeight: "1.6",
  },

  errorBox: {
    backgroundColor: "#fff1f2",
    color: "#be123c",
    padding: "13px 14px",
    borderRadius: "14px",
    marginBottom: "22px",
    fontSize: "14px",
    fontWeight: "500",
    border: "1px solid #fecdd3",
    boxShadow: "0 8px 20px rgba(225, 29, 72, 0.08)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },

  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: "14px",
    color: "#1e293b",
    fontWeight: "700",
  },

  forgotLink: {
    fontSize: "13px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    height: "50px",
    padding: "0 15px",
    borderRadius: "14px",
    border: "1px solid #dbe3ef",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "15px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },

  submitBtn: {
    width: "100%",
    height: "52px",
    marginTop: "4px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "15px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 14px 28px rgba(37, 99, 235, 0.28)",
    transition: "all 0.2s ease",
  },

  btnDisabled: {
    background: "#94a3b8",
    cursor: "not-allowed",
    boxShadow: "none",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    margin: "26px 0 22px",
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(90deg, transparent, #cbd5e1, transparent)",
  },

  dividerText: {
    padding: "0 14px",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "600",
  },

  googleWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "14px",
  },

  footer: {
    marginTop: "30px",
    textAlign: "center",
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "500",
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "800",
  },
};
