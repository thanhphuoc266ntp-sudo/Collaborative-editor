export const loginStyles = {
  pageWrapper: {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `
      radial-gradient(circle at 18% 20%, rgba(56, 189, 248, 0.28), transparent 26%),
      radial-gradient(circle at 82% 14%, rgba(168, 85, 247, 0.26), transparent 24%),
      radial-gradient(circle at 50% 100%, rgba(37, 99, 235, 0.14), transparent 30%),
      linear-gradient(135deg, #eef4ff 0%, #f7f9ff 45%, #f3f0ff 100%)
    `,
    fontFamily:
      "'Be Vietnam Pro', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "24px",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  card: {
    position: "relative",
    width: "100%",
    maxWidth: "440px",
    padding: "44px 40px 36px",
    borderRadius: "30px",
    background: "rgba(255, 255, 255, 0.78)",
    border: "1px solid rgba(255, 255, 255, 0.95)",
    boxShadow:
      "0 30px 80px rgba(37, 99, 235, 0.10), 0 16px 38px rgba(15, 23, 42, 0.10), 0 0 0 1px rgba(255,255,255,0.35) inset",
    backdropFilter: "blur(20px)",
    boxSizing: "border-box",
  },

  header: {
    textAlign: "center",
    marginBottom: "30px",
  },

  title: {
    margin: "0 0 10px 0",
    fontSize: "44px",
    fontWeight: "900",
    lineHeight: "1.02",
    letterSpacing: "-1.8px",
    background:
      "linear-gradient(135deg, #2563eb 0%, #3b82f6 45%, #8b5cf6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 0 24px rgba(59, 130, 246, 0.18)",
  },

  subtitle: {
    margin: "0",
    color: "#64748b",
    fontSize: "15.5px",
    fontWeight: "600",
    lineHeight: "1.6",
    letterSpacing: "-0.2px",
  },

  errorBox: {
    background: "linear-gradient(135deg, #fff1f2 0%, #fff7f7 100%)",
    color: "#be123c",
    padding: "13px 14px",
    borderRadius: "16px",
    marginBottom: "22px",
    fontSize: "14px",
    fontWeight: "600",
    border: "1px solid #fecdd3",
    boxShadow: "0 8px 18px rgba(244, 63, 94, 0.08)",
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
    fontSize: "14.5px",
    color: "#1e293b",
    fontWeight: "800",
    letterSpacing: "-0.2px",
  },

  forgotLink: {
    fontSize: "13.5px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "700",
    letterSpacing: "-0.15px",
  },

  input: {
    width: "100%",
    height: "54px",
    padding: "0 17px",
    borderRadius: "17px",
    border: "1px solid rgba(148, 163, 184, 0.24)",
    background: "rgba(248, 250, 252, 0.88)",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "15.5px",
    fontWeight: "500",
    letterSpacing: "-0.15px",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
    transition:
      "border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
  },

  submitBtn: {
    width: "100%",
    height: "56px",
    marginTop: "6px",
    border: "none",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #2563eb 0%, #3b82f6 48%, #7c3aed 100%)",
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "850",
    letterSpacing: "-0.3px",
    cursor: "pointer",
    boxShadow:
      "0 18px 34px rgba(37, 99, 235, 0.24), 0 0 22px rgba(124, 58, 237, 0.20)",
    transition:
      "transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease",
  },

  btnDisabled: {
    background: "#94a3b8",
    cursor: "not-allowed",
    boxShadow: "none",
    opacity: 0.82,
  },

  divider: {
    display: "flex",
    alignItems: "center",
    margin: "24px 0 20px",
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    background:
      "linear-gradient(90deg, transparent 0%, rgba(148,163,184,0.45) 50%, transparent 100%)",
  },

  dividerText: {
    padding: "0 14px",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "-0.1px",
  },

  googleWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "14px",
  },

  footer: {
    marginTop: "28px",
    textAlign: "center",
    fontSize: "15px",
    color: "#64748b",
    fontWeight: "600",
    letterSpacing: "-0.15px",
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "850",
    letterSpacing: "-0.2px",
  },
};
