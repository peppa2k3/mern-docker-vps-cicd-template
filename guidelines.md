# 🎨 Theme Studio — Full-Stack App

Ứng dụng đăng ký/đăng nhập với tính năng tuỳ chỉnh theme giao diện, lưu vào PostgreSQL và tự động khôi phục khi đăng nhập lại.

## Tech Stack

- **Frontend**: React 18 + Vite + TailwindCSS v3
- **Backend**: Node.js + Express + Prisma ORM
- **Database**: PostgreSQL 17 (Docker)
- **Auth**: JWT (7 ngày)
- **Deploy**: Docker Compose

---

## 🚀 Chạy bằng Docker (Khuyến nghị)

```bash
# Clone / copy project vào máy, rồi:
docker compose up --build
```

Sau khi build xong:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **PostgreSQL**: localhost:5432

> Migration Prisma chạy tự động khi backend khởi động.

---

## 💻 Chạy Local (Development)

### 1. Start PostgreSQL (Docker)
```bash
docker compose up db -d
```

### 2. Backend
```bash
cd backend
cp .env.example .env          # Tạo file .env
npm install
npx prisma migrate dev        # Chạy migration
npm run dev                   # Start server tại :5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev                   # Start tại :5173
```

---

## 📁 Cấu trúc dự án

```
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── .env.example
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js        # register, login, /me, PUT /theme
│   │   └── themes.js      # GET /api/themes → 10 preset themes
│   └── prisma/
│       └── schema.prisma
└── frontend/
    ├── Dockerfile
    ├── src/
    │   ├── App.jsx            # Main app (auth + dashboard)
    │   ├── context/
    │   │   └── ThemeContext.jsx  # CSS variables management
    │   └── index.css
    └── vite.config.js
```

---

## 🎨 API Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại |
| PUT | `/api/auth/theme` | Cập nhật theme |
| GET | `/api/themes` | Lấy danh sách 10 preset themes |
| GET | `/api/health` | Health check |

### Theme Object (lưu vào DB dạng JSONB)
```json
{
  "name": "Dark Modern",
  "backgroundcolor": "#0f172a",
  "primarycolor": "#e0f2fe",
  "secondarycolor": "#22d3ee",
  "cardcolor": "#1e293b",
  "textcolor": "#f1f5f9",
  "bordercolor": "#334155",
  "accentcolor": "#06b6d4"
}
```

---

## 🔐 Biến môi trường Backend

| Biến | Giá trị mặc định | Mô tả |
|------|-----------------|-------|
| `DATABASE_URL` | `postgresql://admin1:pass1@localhost:5432/theme_app` | Prisma DB URL |
| `JWT_SECRET` | `super_secret_...` | Khoá bí mật JWT |
| `PORT` | `5000` | Port backend |

> ⚠️ Đổi `JWT_SECRET` trước khi deploy production!
