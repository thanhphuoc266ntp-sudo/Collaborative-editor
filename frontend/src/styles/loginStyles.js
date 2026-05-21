export const loginStyles = {
  pageWrapper: {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.18), transparent 30%), radial-gradient(circle at 80% 10%, rgba(124, 58, 237, 0.14), transparent 28%), linear-gradient(135deg, #f8fbff 0%, #eef4ff 45%, #f7f9ff 100%)",
    fontFamily:
      "'Be Vietnam Pro', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "24px",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "44px 42px 38px",
    borderRadius: "28px",
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    boxShadow:
      "0 28px 70px rgba(15, 23, 42, 0.14), 0 8px 24px rgba(37, 99, 235, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.9)",
    boxSizing: "border-box",
    backdropFilter: "blur(20px)",
  },

  header: {
    textAlign: "center",
    marginBottom: "32px",
  },

  title: {
    margin: "0 0 10px 0",
    color: "#2563eb",
    fontSize: "42px",
    fontWeight: "800",
    letterSpacing: "-1.4px",
    lineHeight: "1",
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
    fontSize: "13.5px",
    fontWeight: "500",
    border: "1px solid #fecdd3",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "19px",
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
    fontWeight: "650",
    letterSpacing: "-0.15px",
  },

  forgotLink: {
    fontSize: "13.5px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "650",
    letterSpacing: "-0.1px",
  },

  input: {
    width: "100%",
    height: "52px",
    padding: "0 16px",
    borderRadius: "16px",
    border: "1px solid #dbe5f1",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "15px",
    fontWeight: "500",
    letterSpacing: "-0.1px",
    transition:
      "border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
  },

  submitBtn: {
    width: "100%",
    height: "54px",
    marginTop: "6px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "17px",
    fontSize: "16px",
    fontWeight: "750",
    letterSpacing: "-0.2px",
    cursor: "pointer",
    boxShadow: "0 16px 30px rgba(37, 99, 235, 0.26)",
    transition:
      "transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease",
  },

  btnDisabled: {
    background: "#94a3b8",
    cursor: "not-allowed",
    boxShadow: "none",
    opacity: 0.8,
  },

  divider: {
    display: "flex",
    alignItems: "center",
    margin: "26px 0 22px",
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    background:
      "linear-gradient(90deg, transparent 0%, #cbd5e1 50%, transparent 100%)",
  },

  dividerText: {
    padding: "0 14px",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "550",
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
    fontSize: "14.5px",
    color: "#64748b",
    fontWeight: "500",
    letterSpacing: "-0.1px",
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "750",
    letterSpacing: "-0.15px",
  },
};
