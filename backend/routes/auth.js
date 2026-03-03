const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const DEFAULT_THEME = {
  name: "Light Default",
  backgroundcolor: "#f8fafc",
  primarycolor: "#1e3a8a",
  secondarycolor: "#fbbf24",
  cardcolor: "#ffffff",
  textcolor: "#1e293b",
  bordercolor: "#e2e8f0",
  accentcolor: "#3b82f6",
};

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token không tồn tại" });
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

const router = (prisma) => {
  const r = express.Router();
  const SECRET = process.env.JWT_SECRET;

  // ── Register ────────────────────────────────────────────
  r.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ error: "Mật khẩu phải có ít nhất 6 ký tự" });

    try {
      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { username, email, password: hashed, theme: DEFAULT_THEME },
        select: { id: true, username: true, email: true, theme: true },
      });
      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "7d" });
      res.status(201).json({ token, user });
    } catch (err) {
      if (err.code === "P2002") {
        const field = err.meta?.target?.includes("email")
          ? "Email"
          : "Username";
        return res.status(400).json({ error: `${field} đã được sử dụng` });
      }
      res.status(500).json({ error: "Lỗi server" });
    }
  });

  // ── Login ───────────────────────────────────────────────
  r.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Vui lòng nhập email và mật khẩu" });

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });

      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "7d" });
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          theme: user.theme || DEFAULT_THEME,
        },
      });
    } catch {
      res.status(500).json({ error: "Lỗi server" });
    }
  });

  // ── Get current user ────────────────────────────────────
  r.get("/me", verifyToken, async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, username: true, email: true, theme: true },
      });
      if (!user) return res.status(404).json({ error: "Không tìm thấy user" });
      res.json({ user: { ...user, theme: user.theme || DEFAULT_THEME } });
    } catch {
      res.status(500).json({ error: "Lỗi server" });
    }
  });

  // ── Update theme ────────────────────────────────────────
  r.put("/theme", verifyToken, async (req, res) => {
    const { theme } = req.body;
    if (!theme || typeof theme !== "object")
      return res.status(400).json({ error: "Dữ liệu theme không hợp lệ" });

    try {
      const updated = await prisma.user.update({
        where: { id: req.user.id },
        data: { theme },
        select: { theme: true },
      });
      res.json({ success: true, theme: updated.theme });
    } catch {
      res.status(500).json({ error: "Lỗi server" });
    }
  });

  return r;
};

module.exports = router;
