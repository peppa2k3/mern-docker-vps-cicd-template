import { useState, useContext, useEffect, useCallback } from "react";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── Axios instance with token ───────────────────────────────────────────────
const api = axios.create({ baseURL: API });
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = {
  Sun: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  ),
  Palette: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Spinner: () => (
    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  ),
  Eye: ({ show }) => show ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
};

// ─── Auth Form Component ──────────────────────────────────────────────────────
function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { username: form.username, email: form.email, password: form.password };
      const { data } = await api.post(endpoint, payload);
      localStorage.setItem("token", data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Đã có lỗi xảy ra, thử lại nhé!");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setForm({ username: "", email: "", password: "" });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur mb-4">
            <Icon.Palette />
          </div>
          <h1 className="text-3xl font-bold text-white">Theme Studio</h1>
          <p className="text-white/70 mt-1">Tuỳ chỉnh giao diện của bạn</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex">
            {["Đăng nhập", "Đăng ký"].map((label, i) => (
              <button
                key={i}
                onClick={() => { setIsLogin(i === 0); setError(""); }}
                className={`flex-1 py-4 text-sm font-semibold transition-all ${
                  isLogin === (i === 0)
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                    : "bg-gray-50 text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Username (register only) */}
            {!isLogin && (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon.User />
                </span>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Tên người dùng"
                  required
                  autoComplete="username"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition text-sm"
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✉️</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email của bạn"
                required
                autoComplete="email"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition text-sm"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
              <input
                name="password"
                type={showPwd ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Mật khẩu (ít nhất 6 ký tự)"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Icon.Eye show={showPwd} />
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 active:scale-[.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <><Icon.Spinner /> Đang xử lý...</> : (isLogin ? "Đăng nhập →" : "Tạo tài khoản →")}
            </button>

            {/* Switch */}
            <p className="text-center text-sm text-gray-500">
              {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
              <button type="button" onClick={switchMode} className="text-violet-600 font-semibold hover:underline">
                {isLogin ? "Đăng ký miễn phí" : "Đăng nhập ngay"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Theme Card ───────────────────────────────────────────────────────────────
function ThemeCard({ preset, isActive, onSelect, saving }) {
  return (
    <div
      onClick={() => !saving && onSelect(preset)}
      className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 ${
        isActive
          ? "ring-4 scale-105 shadow-xl"
          : "hover:scale-102 hover:shadow-lg shadow-md"
      }`}
      style={{ ringColor: isActive ? preset.accentcolor : "transparent" }}
    >
      {/* Active badge */}
      {isActive && (
        <div
          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg"
          style={{ backgroundColor: preset.accentcolor }}
        >
          <Icon.Check />
        </div>
      )}

      {/* Color preview */}
      <div className="h-20 flex" style={{ backgroundColor: preset.backgroundcolor }}>
        <div className="w-1/2 flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: preset.primarycolor, color: preset.backgroundcolor }}>
          Aa
        </div>
        <div className="w-1/2 flex flex-col">
          <div className="flex-1" style={{ backgroundColor: preset.secondarycolor }} />
          <div className="flex-1" style={{ backgroundColor: preset.accentcolor }} />
        </div>
      </div>

      {/* Label */}
      <div
        className="px-3 py-2 text-center"
        style={{ backgroundColor: preset.cardcolor, color: preset.textcolor }}
      >
        <span className="text-base">{preset.emoji}</span>
        <p className="text-xs font-semibold mt-0.5 truncate">{preset.name}</p>
      </div>
    </div>
  );
}

// ─── Custom Color Picker ──────────────────────────────────────────────────────
function CustomThemePicker({ currentTheme, onSave, saving }) {
  const [custom, setCustom] = useState({ ...currentTheme });
  const [open, setOpen] = useState(false);

  useEffect(() => setCustom({ ...currentTheme }), [currentTheme]);

  const fields = [
    { key: "backgroundcolor", label: "Nền trang" },
    { key: "primarycolor", label: "Màu chính" },
    { key: "secondarycolor", label: "Màu phụ" },
    { key: "cardcolor", label: "Nền card" },
    { key: "textcolor", label: "Màu chữ" },
    { key: "accentcolor", label: "Màu nhấn" },
    { key: "bordercolor", label: "Màu viền" },
  ];

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full mt-4 py-3 px-4 rounded-xl border-2 border-dashed text-sm font-medium transition-all hover:opacity-80"
        style={{ borderColor: "var(--border)", color: "var(--primary)" }}
      >
        🎨 Tuỳ chỉnh màu sắc tự do
      </button>
    );
  }

  return (
    <div
      className="mt-4 p-5 rounded-2xl border"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm" style={{ color: "var(--primary)" }}>
          🎨 Tuỳ chỉnh màu tự do
        </h3>
        <button onClick={() => setOpen(false)} className="text-xs opacity-60 hover:opacity-100">
          Thu gọn ✕
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
        {fields.map(({ key, label }) => (
          <label key={key} className="cursor-pointer">
            <div
              className="text-xs mb-1 font-medium opacity-70"
              style={{ color: "var(--text)" }}
            >
              {label}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={custom[key] || "#000000"}
                onChange={(e) => setCustom((p) => ({ ...p, [key]: e.target.value }))}
                className="w-8 h-8 rounded-lg border cursor-pointer"
                style={{ borderColor: "var(--border)" }}
              />
              <span
                className="text-xs font-mono opacity-60"
                style={{ color: "var(--text)" }}
              >
                {custom[key]}
              </span>
            </div>
          </label>
        ))}
      </div>

      <button
        onClick={() => { onSave({ ...custom, name: "Custom" }); setOpen(false); }}
        disabled={saving}
        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition"
        style={{ backgroundColor: "var(--accent)" }}
      >
        {saving ? <><Icon.Spinner /> Đang lưu...</> : "✅ Áp dụng theme này"}
      </button>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ user, onLogout }) {
  const { theme, saveTheme } = useContext(ThemeContext);
  const [presets, setPresets] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [activeTab, setActiveTab] = useState("themes");

  // Fetch preset themes from backend
  useEffect(() => {
    api
      .get("/api/themes")
      .then((r) => setPresets(r.data))
      .catch(console.error);
  }, []);

  const handleSelectTheme = useCallback(
    async (preset) => {
      setSaving(true);
      await saveTheme(preset);
      setSaving(false);
      setSavedMsg(`✅ Đã lưu "${preset.name || "Custom"}"`);
      setTimeout(() => setSavedMsg(""), 2500);
    },
    [saveTheme]
  );

  const isActive = (preset) =>
    theme.backgroundcolor === preset.backgroundcolor &&
    theme.primarycolor === preset.primarycolor;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      {/* Navbar */}
      <nav
        className="sticky top-0 z-40 border-b backdrop-blur-sm"
        style={{
          backgroundColor: `${theme.cardcolor}ee`,
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: "var(--accent)" }}
              >
                <Icon.Palette />
              </div>
              <span className="font-bold text-lg hidden sm:block" style={{ color: "var(--primary)" }}>
                Theme Studio
              </span>
            </div>

            <div className="flex items-center gap-3">
              {savedMsg && (
                <span
                  className="text-sm font-medium px-3 py-1 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}
                >
                  {savedMsg}
                </span>
              )}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium"
                style={{ backgroundColor: "var(--background)", color: "var(--primary)" }}
              >
                <Icon.User />
                <span className="hidden sm:inline">{user.username}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "var(--primary)" }}
              >
                <Icon.Logout />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ color: "var(--primary)" }}>
            Xin chào, {user.username}! 👋
          </h1>
          <p className="mt-1 text-sm opacity-60" style={{ color: "var(--text)" }}>
            Theme của bạn được lưu tự động và hiển thị ngay khi đăng nhập lại.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: "themes", label: "🎨 Chọn Theme" },
            { id: "demo", label: "🖼️ Xem Demo UI" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id ? "text-white shadow-lg" : "opacity-60 hover:opacity-100"
              }`}
              style={
                activeTab === tab.id
                  ? { backgroundColor: "var(--primary)" }
                  : { backgroundColor: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Theme Selector Tab ─────────────────────────────────────── */}
        {activeTab === "themes" && (
          <div>
            <div
              className="p-6 rounded-3xl border mb-6"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon.Palette />
                <h2 className="font-bold text-lg" style={{ color: "var(--primary)" }}>
                  Preset Themes
                </h2>
              </div>
              <p className="text-sm opacity-60 mb-5" style={{ color: "var(--text)" }}>
                {presets.length} giao diện có sẵn — dữ liệu màu từ API backend
              </p>

              {presets.length === 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ backgroundColor: "var(--border)" }} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {presets.map((preset) => (
                    <ThemeCard
                      key={preset.id}
                      preset={preset}
                      isActive={isActive(preset)}
                      onSelect={handleSelectTheme}
                      saving={saving}
                    />
                  ))}
                </div>
              )}

              {/* Active theme info */}
              <div
                className="mt-5 flex flex-wrap items-center gap-3 p-4 rounded-2xl"
                style={{ backgroundColor: "var(--background)" }}
              >
                <span className="text-xs font-bold uppercase tracking-wider opacity-50" style={{ color: "var(--text)" }}>
                  Theme hiện tại:
                </span>
                {[
                  { label: "Nền", key: "backgroundcolor" },
                  { label: "Chính", key: "primarycolor" },
                  { label: "Phụ", key: "secondarycolor" },
                  { label: "Nhấn", key: "accentcolor" },
                ].map(({ label, key }) => (
                  <div key={key} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text)" }}>
                    <div
                      className="w-4 h-4 rounded-full border shadow-sm"
                      style={{ backgroundColor: theme[key], borderColor: "var(--border)" }}
                    />
                    <span className="opacity-70">{label}</span>
                    <span className="font-mono opacity-50">{theme[key]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom picker */}
            <div
              className="p-6 rounded-3xl border"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <h2 className="font-bold text-lg mb-1" style={{ color: "var(--primary)" }}>
                Tuỳ chỉnh tự do
              </h2>
              <p className="text-sm opacity-60 mb-2" style={{ color: "var(--text)" }}>
                Tự chọn màu sắc theo ý muốn và lưu vào tài khoản.
              </p>
              <CustomThemePicker
                currentTheme={theme}
                onSave={handleSelectTheme}
                saving={saving}
              />
            </div>
          </div>
        )}

        {/* ── Demo UI Tab ────────────────────────────────────────────── */}
        {activeTab === "demo" && (
          <div className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Tổng đơn hàng", value: "1,284", icon: "📦", delta: "+12%" },
                { label: "Doanh thu", value: "₫48.2M", icon: "💰", delta: "+8.3%" },
                { label: "Khách hàng", value: "3,942", icon: "👥", delta: "+5.1%" },
                { label: "Đánh giá", value: "4.9 ⭐", icon: "🏆", delta: "+0.2" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs opacity-50 mb-1" style={{ color: "var(--text)" }}>{stat.label}</p>
                      <p className="text-xl font-bold" style={{ color: "var(--primary)" }}>{stat.value}</p>
                    </div>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <span
                    className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}
                  >
                    {stat.delta}
                  </span>
                </div>
              ))}
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { title: "Thiết kế đẹp", desc: "Giao diện hiện đại với màu sắc tùy chỉnh hoàn toàn từ database.", tag: "UI/UX" },
                { title: "Lưu trữ cloud", desc: "Dữ liệu theme của bạn được lưu an toàn trong PostgreSQL.", tag: "Database" },
                { title: "Responsive", desc: "Tương thích hoàn hảo trên mobile, tablet và desktop.", tag: "Mobile" },
                { title: "Bảo mật JWT", desc: "Xác thực an toàn với JSON Web Token, tự động hết hạn sau 7 ngày.", tag: "Security" },
                { title: "Docker Ready", desc: "Triển khai dễ dàng với Docker Compose chỉ một lệnh.", tag: "DevOps" },
                { title: "10+ Themes", desc: "Hơn 10 giao diện preset và tùy chỉnh không giới hạn màu sắc.", tag: "Themes" },
              ].map((card, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border group hover:shadow-lg transition-all"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                >
                  <span
                    className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
                    style={{ backgroundColor: "var(--accent)", color: "#fff" }}
                  >
                    {card.tag}
                  </span>
                  <h3 className="font-bold text-lg mb-2" style={{ color: "var(--primary)" }}>
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed opacity-70" style={{ color: "var(--text)" }}>
                    {card.desc}
                  </p>
                  <div
                    className="mt-4 pt-4 flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all"
                    style={{ borderTop: "1px solid var(--border)", color: "var(--accent)" }}
                  >
                    Tìm hiểu thêm <span>→</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Banner */}
            <div
              className="p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <div>
                <h3 className="text-xl font-bold" style={{ color: "var(--card)" }}>
                  Chưa hài lòng với giao diện?
                </h3>
                <p className="text-sm opacity-70 mt-1" style={{ color: "var(--card)" }}>
                  Hãy quay lại tab "Chọn Theme" và khám phá thêm nhé!
                </p>
              </div>
              <button
                onClick={() => setActiveTab("themes")}
                className="shrink-0 px-6 py-3 rounded-2xl text-sm font-bold transition hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}
              >
                🎨 Đổi Theme ngay
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
function AppInner() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const { applyTheme } = useContext(ThemeContext);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setChecking(false); return; }
    api
      .get("/api/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        if (data.user.theme) applyTheme(data.user.theme);
      })
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setChecking(false));
  }, [applyTheme]);

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.theme) applyTheme(userData.theme);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white animate-bounce"
            style={{ backgroundColor: "var(--accent)" }}>
            <Icon.Palette />
          </div>
          <p className="text-sm opacity-60" style={{ color: "var(--text)" }}>Đang tải...</p>
        </div>
      </div>
    );
  }

  return user
    ? <Dashboard user={user} onLogout={handleLogout} />
    : <AuthForm onLogin={handleLogin} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
