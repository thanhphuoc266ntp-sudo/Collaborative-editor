export const registerStyles = {
  pageWrapper: {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at 15% 20%, rgba(59, 130, 246, 0.18), transparent 28%), radial-gradient(circle at 85% 15%, rgba(124, 58, 237, 0.16), transparent 26%), linear-gradient(135deg, #f8fbff 0%, #eef4ff 45%, #f8faff 100%)",
    fontFamily:
      "'Be Vietnam Pro', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "28px 18px",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "460px",
    padding: "34px 34px 30px",
    borderRadius: "30px",
    background: "rgba(255, 255, 255, 0.9)",
    border: "1px solid rgba(255, 255, 255, 0.9)",
    boxShadow:
      "0 24px 60px rgba(15, 23, 42, 0.12), 0 10px 25px rgba(37, 99, 235, 0.08)",
    backdropFilter: "blur(18px)",
    boxSizing: "border-box",
  },

  header: {
    textAlign: "center",
    marginBottom: "26px",
  },

  logoCircle: {
    width: "72px",
    height: "72px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    background:
      "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(124, 58, 237, 0.1) 100%)",
    color: "#2563eb",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
  },

  title: {
    margin: "0 0 10px 0",
    color: "#2563eb",
    fontSize: "38px",
    fontWeight: "800",
    letterSpacing: "-1.1px",
    lineHeight: "1.05",
  },

  subtitle: {
    margin: "0",
    color: "#64748b",
    fontSize: "15px",
    fontWeight: "500",
    lineHeight: "1.6",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#fff1f2",
    color: "#be123c",
    padding: "13px 14px",
    borderRadius: "16px",
    marginBottom: "18px",
    fontSize: "13.5px",
    fontWeight: "500",
    border: "1px solid #fecdd3",
  },

  successBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#ecfdf5",
    color: "#047857",
    padding: "13px 14px",
    borderRadius: "16px",
    marginBottom: "18px",
    fontSize: "13.5px",
    fontWeight: "500",
    border: "1px solid #a7f3d0",
  },

  boxIcon: {
    fontSize: "16px",
    lineHeight: 1,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "14px",
    color: "#1e293b",
    fontWeight: "700",
    letterSpacing: "-0.15px",
  },

  input: {
    width: "100%",
    height: "54px",
    padding: "0 16px",
    borderRadius: "18px",
    border: "1px solid #dbe5f1",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "15px",
    fontWeight: "500",
    letterSpacing: "-0.1px",
    transition: "all 0.2s ease",
  },

  otpInput: {
    width: "100%",
    height: "58px",
    padding: "0 16px",
    borderRadius: "18px",
    border: "1px solid #dbe5f1",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "6px",
    textAlign: "center",
    transition: "all 0.2s ease",
  },

  submitBtn: {
    width: "100%",
    height: "56px",
    marginTop: "6px",
    border: "none",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "800",
    letterSpacing: "-0.25px",
    cursor: "pointer",
    boxShadow: "0 14px 28px rgba(37, 99, 235, 0.24)",
    transition: "all 0.2s ease",
  },

  submitBtnDisabled: {
    background: "#94a3b8",
    boxShadow: "none",
    cursor: "not-allowed",
    opacity: 0.82,
  },

  divider: {
    display: "flex",
    alignItems: "center",
    margin: "22px 0 18px",
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
    marginTop: "24px",
    textAlign: "center",
    fontSize: "14.5px",
    color: "#64748b",
    fontWeight: "500",
    letterSpacing: "-0.1px",
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "800",
    letterSpacing: "-0.15px",
  },

  backBtn: {
    width: "100%",
    height: "48px",
    marginTop: "6px",
    border: "1px solid #dbe5f1",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    color: "#334155",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};
