export const forgotPasswordStyles = {
  pageWrapper: {
    width: "100vw",
    minHeight: "100vh",
    margin: 0,
    padding: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at 18% 18%, rgba(37, 99, 235, 0.28), transparent 32%), radial-gradient(circle at 82% 12%, rgba(124, 58, 237, 0.22), transparent 30%), linear-gradient(135deg, #eef4ff 0%, #f8fbff 48%, #f5f7ff 100%)",
    fontFamily:
      "'Be Vietnam Pro', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "430px",
    padding: "42px 38px 36px",
    borderRadius: "30px",
    background: "rgba(255, 255, 255, 0.92)",
    border: "1px solid rgba(255, 255, 255, 0.9)",
    boxShadow:
      "0 30px 80px rgba(15, 23, 42, 0.16), 0 10px 26px rgba(37, 99, 235, 0.08)",
    backdropFilter: "blur(20px)",
    boxSizing: "border-box",
  },

  header: {
    textAlign: "center",
    marginBottom: "30px",
  },

  logoCircle: {
    width: "72px",
    height: "72px",
    margin: "0 auto 20px",
    borderRadius: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(124, 58, 237, 0.13))",
    fontSize: "30px",
    boxShadow:
      "inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 10px 24px rgba(37, 99, 235, 0.08)",
  },

  title: {
    margin: "0 0 11px 0",
    color: "#2563eb",
    fontSize: "34px",
    fontWeight: "900",
    letterSpacing: "-1.3px",
    lineHeight: "1.1",
  },

  subtitle: {
    margin: "0",
    color: "#64748b",
    fontSize: "15px",
    fontWeight: "550",
    lineHeight: "1.6",
    letterSpacing: "-0.2px",
  },

  emailText: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "14px auto 0",
    padding: "8px 13px",
    borderRadius: "999px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    fontSize: "13.5px",
    fontWeight: "700",
    letterSpacing: "-0.1px",
    maxWidth: "100%",
    wordBreak: "break-all",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#fff1f2",
    color: "#be123c",
    padding: "13px 14px",
    borderRadius: "16px",
    marginBottom: "22px",
    fontSize: "14px",
    fontWeight: "600",
    border: "1px solid #fecdd3",
    lineHeight: "1.45",
  },

  successBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#ecfdf5",
    color: "#047857",
    padding: "13px 14px",
    borderRadius: "16px",
    marginBottom: "22px",
    fontSize: "14px",
    fontWeight: "600",
    border: "1px solid #bbf7d0",
    lineHeight: "1.45",
  },

  boxIcon: {
    fontSize: "16px",
    lineHeight: 1,
    flexShrink: 0,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },

  label: {
    fontSize: "14.5px",
    color: "#1e293b",
    fontWeight: "800",
    letterSpacing: "-0.25px",
  },

  input: {
    width: "100%",
    height: "54px",
    padding: "0 16px",
    borderRadius: "17px",
    border: "1px solid #dbe5f1",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "15.5px",
    fontWeight: "500",
    letterSpacing: "-0.2px",
    transition:
      "border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
  },

  otpInput: {
    width: "100%",
    height: "64px",
    padding: "0 18px",
    borderRadius: "20px",
    border: "1px solid #c7d2fe",
    backgroundColor: "#ffffff",
    color: "#1e293b",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "28px",
    fontWeight: "850",
    letterSpacing: "10px",
    textAlign: "center",
    boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.1)",
    transition:
      "border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
  },

  submitBtn: {
    width: "100%",
    height: "56px",
    marginTop: "8px",
    border: "none",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    fontSize: "16.5px",
    fontWeight: "850",
    letterSpacing: "-0.3px",
    cursor: "pointer",
    boxShadow: "0 16px 30px rgba(37, 99, 235, 0.26)",
    transition:
      "transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease",
  },

  submitBtnSuccess: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    boxShadow: "0 16px 30px rgba(16, 185, 129, 0.22)",
  },

  btnDisabled: {
    background: "#94a3b8",
    boxShadow: "none",
    cursor: "wait",
    opacity: 0.82,
  },

  backBtn: {
    width: "100%",
    height: "52px",
    border: "1px solid #dbe5f1",
    borderRadius: "17px",
    backgroundColor: "#ffffff",
    color: "#475569",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
    transition: "all 0.2s ease",
  },

  footer: {
    marginTop: "28px",
    textAlign: "center",
    fontSize: "14.5px",
    color: "#64748b",
    fontWeight: "550",
    letterSpacing: "-0.1px",
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "850",
    letterSpacing: "-0.2px",
  },
};
