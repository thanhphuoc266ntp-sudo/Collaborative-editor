require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 1410;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/documents", require("./routes/document"));

app.listen(PORT, () => console.log(`🚀 Server đang chạy tại port ${PORT}`));
