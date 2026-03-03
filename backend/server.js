require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const authRoutes = require("./routes/auth");
const themesRoutes = require("./routes/themes");

const prisma = new PrismaClient({ log: ["error", "warn"] });
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes(prisma));
app.use("/api/themes", themesRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend running at: http://localhost:${PORT}`);
  console.log(
    `📡 DB connection: ${process.env.DATABASE_URL ? "OK" : "ERROR - missing DATABASE_URL"}`
  );
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
