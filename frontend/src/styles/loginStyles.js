export const loginStyles = {
  pageWrapper: {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `
      radial-gradient(circle at 18% 18%, rgba(59, 130, 246, 0.18), transparent 28%),
      radial-gradient(circle at 82% 14%, rgba(14, 165, 233, 0.14), transparent 30%),
      radial-gradient(circle at 50% 100%, rgba(99, 102, 241, 0.10), transparent 36%),
      linear-gradient(135deg, #f8fbff 0%, #eef6ff 45%, #f7faff 100%)
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
    padding: "46px 42px 38px",
    borderRadius: "34px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 100%)",
    border: "1px solid rgba(255, 255, 255, 0.95)",
    boxShadow:
      "0 34px 90px rgba(15, 23, 42, 0.12), 0 18px 42px rgba(37, 99, 235, 0.08), 0 0 0 1px rgba(255,255,255,0.7) inset",
    backdropFilter: "blur(22px)",
    boxSizing: "border-box",
  },

  header: {
    textAlign: "center",
    marginBottom: "32px",
  },

  title: {
    margin: "0 0 10px 0",
    fontSize: "48px",
    fontWeight: "900",
    lineHeight: "1",
    letterSpacing: "-2px",
    background:
      "linear-gradient(135deg, #1d4ed8 0%, #2563eb 45%, #0284c7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    margin: "0",
    color: "#64748b",
    fontSize: "15.5px",
    fontWeight: "650",
    lineHeight: "1.65",
    letterSpacing: "-0.22px",
  },

  errorBox: {
    background: "linear-gradient(135deg, #fff1f2 0%, #fff7f7 100%)",
    color: "#be123c",
    padding: "13px 15px",
    borderRadius: "17px",
    marginBottom: "22px",
    fontSize: "14px",
    fontWeight: "650",
    border: "1px solid #fecdd3",
    boxShadow: "0 10px 22px rgba(244, 63, 94, 0.08)",
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
    color: "#172033",
    fontWeight: "850",
    letterSpacing: "-0.25px",
  },

  forgotLink: {
    fontSize: "13.5px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "800",
    letterSpacing: "-0.18px",
  },

  input: {
    width: "100%",
    height: "56px",
    padding: "0 18px",
    borderRadius: "19px",
    border: "1px solid rgba(148, 163, 184, 0.26)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.94) 100%)",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "15.5px",
    fontWeight: "550",
    letterSpacing: "-0.15px",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 20px rgba(15,23,42,0.035)",
    transition:
      "border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
  },

  submitBtn: {
    width: "100%",
    height: "58px",
    marginTop: "8px",
    border: "none",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, #1d4ed8 0%, #2563eb 48%, #0284c7 100%)",
    color: "#ffffff",
    fontSize: "17.5px",
    fontWeight: "900",
    letterSpacing: "-0.35px",
    cursor: "pointer",
    boxShadow:
      "0 18px 36px rgba(37, 99, 235, 0.28), 0 8px 18px rgba(2, 132, 199, 0.16)",
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
    margin: "26px 0 21px",
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    background:
      "linear-gradient(90deg, transparent 0%, rgba(100, 116, 139, 0.36) 50%, transparent 100%)",
  },

  dividerText: {
    padding: "0 14px",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "750",
    letterSpacing: "-0.1px",
  },

  googleWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "15px",
  },

  footer: {
    marginTop: "30px",
    textAlign: "center",
    fontSize: "15px",
    color: "#64748b",
    fontWeight: "650",
    letterSpacing: "-0.18px",
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "900",
    letterSpacing: "-0.25px",
  },
};
