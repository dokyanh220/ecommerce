# 🛒 BizMart — Modern Multi-Tenant E-Commerce Platform

<div align="center">

**A full-stack, multi-tenant e-commerce marketplace built with Next.js 15, PayloadCMS 3, tRPC, and MongoDB.**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![PayloadCMS](https://img.shields.io/badge/Payload-3.58-blue?style=for-the-badge)](https://payloadcms.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📖 Giới Thiệu

**BizMart** là một nền tảng thương mại điện tử hiện đại, được thiết kế theo kiến trúc multi-tenant (đa người bán). Dự án cho phép nhiều cửa hàng hoạt động trên cùng một hệ thống, mỗi tenant có subdomain riêng với sản phẩm, danh mục và giao diện tùy chỉnh.

Dự án được xây dựng trên nền tảng **Next.js App Router**, sử dụng **PayloadCMS** làm headless CMS để quản lý nội dung, **tRPC** cho type-safe API layer, và **MongoDB** làm cơ sở dữ liệu.

---

## ✨ Tính Năng

#### 🔐 Xác Thực & Phân Quyền (Authentication)
- Đăng ký tài khoản với validation đa quốc gia (VN, US, UK, JP, KR, CN)
- Đăng nhập bằng email/password
- Xác thực email qua OTP 6 số
- Hệ thống gửi email qua **Brevo API**
- Rate limiting cho OTP (giới hạn số lần gửi lại & số lần thử)
- Schema validation chặt chẽ với **Zod**

#### 📦 Quản Lý Sản Phẩm (Products)
- CRUD sản phẩm qua PayloadCMS Admin Panel
- Hỗ trợ tên, mô tả, giá, ảnh sản phẩm
- Phân loại sản phẩm theo danh mục (category) và tag
- Chính sách hoàn tiền linh hoạt (30/14/7/3/1 ngày hoặc không hoàn)
- Upload và quản lý hình ảnh sản phẩm qua Media collection

#### 🗂️ Danh Mục & Phân Loại (Categories & Tags)
- Hệ thống danh mục phân cấp (parent → subcategory)
- 12 danh mục chính: Business & Money, Software Development, Writing & Publishing, Education, Self Improvement, Fitness & Health, Design, Drawing & Painting, Music, Photography, v.v.
- Mỗi danh mục có color code và slug riêng
- Hệ thống tag đa dạng để gắn nhãn sản phẩm
- Seed script tự động tạo dữ liệu mẫu

#### 🔍 Tìm Kiếm & Bộ Lọc (Search & Filter)
- Thanh tìm kiếm sản phẩm
- Bộ lọc theo danh mục và danh mục con
- Bộ lọc theo khoảng giá (min/max price)
- Bộ lọc theo tags
- Sắp xếp sản phẩm: Curated, Trending, Hot & New
- URL search params với **nuqs** (type-safe, shareable URL state)

#### 🧭 Điều Hướng & Giao Diện (Navigation & UI)
- Navbar responsive với sidebar cho mobile
- Mega menu dropdown cho danh mục
- Breadcrumb navigation cho điều hướng phân cấp
- Footer đầy đủ thông tin
- Thiết kế hiện đại với **DM Sans** font
- 46+ UI components từ **shadcn/ui** (Radix UI primitives)
- Toast notifications với **Sonner**

#### 🏗️ Kiến Trúc & Hạ Tầng
- **Next.js 15 App Router** với Server Components
- **tRPC** type-safe API với 4 routers: `auth`, `categories`, `products`, `tags`
- **PayloadCMS 3** headless CMS với admin panel tại `/admin`
- **MongoDB** database qua Mongoose adapter
- **TanStack React Query** cho server state management & data prefetching
- **React Hook Form** + **Zod** cho form handling
- Module-based architecture (`modules/auth`, `modules/products`, `modules/categories`, ...)
- Tách biệt `server/` và `ui/` trong mỗi module

---

### 🔲 Đang Phát Triển (Roadmap)

| # | Tính Năng | Mô Tả |
|---|-----------|-------|
| 1 | **Product List UI** | Giao diện danh sách sản phẩm hoàn chỉnh với grid/list view, pagination |
| 2 | **Multi Tenancy** | Hỗ trợ nhiều cửa hàng trên cùng hệ thống, mỗi tenant có dữ liệu riêng |
| 3 | **Tenant Pages** | Trang riêng cho từng cửa hàng/tenant với branding tùy chỉnh |
| 4 | **Product Page** | Trang chi tiết sản phẩm với gallery, mô tả, reviews |
| 5 | **Cart & Checkout** | Giỏ hàng và quy trình thanh toán |
| 6 | **Checkout Page** | Trang thanh toán với form nhập thông tin giao hàng |
| 7 | **Stripe Integration** | Tích hợp thanh toán Stripe cho người mua |
| 8 | **Library** | Thư viện sản phẩm đã mua của người dùng |
| 9 | **Reviews** | Hệ thống đánh giá và nhận xét sản phẩm |
| 10 | **Aggregating Reviews** | Tổng hợp và hiển thị điểm đánh giá trung bình |
| 11 | **Access Control** | Phân quyền chi tiết cho từng role (admin, seller, buyer) |
| 12 | **Stripe Connect** | Tích hợp Stripe Connect cho multi-vendor payouts |
| 13 | **General Improvements** | Cải thiện tổng thể: UX, performance, SEO |
| 14 | **Subdomain Rewrites** | Rewrite URL theo subdomain cho từng tenant |
| 15 | **Deployment** | Triển khai production (Docker, CI/CD, cloud hosting) |
| 16 | **Storage Adapter** | Adapter lưu trữ file (S3, Cloudflare R2, ...) |
| 17 | **Wildcard Subdomain** | Cấu hình wildcard subdomain cho multi-tenancy |
| 18 | **Cookie Bugs** | Sửa lỗi liên quan đến cookie cross-subdomain |
| 19 | **Search Filter** | Nâng cấp bộ lọc tìm kiếm nâng cao |
| 20 | **Private Media** | Quản lý media riêng tư cho từng tenant/user |

---

## 🛠️ Tech Stack

| Layer | Công Nghệ |
|-------|-----------|
| **Framework** | Next.js 15.5 (App Router, Server Components, RSC) |
| **CMS** | PayloadCMS 3.58 (Headless CMS + Admin Panel) |
| **API** | tRPC 11.6 (End-to-end type-safe APIs) |
| **Database** | MongoDB (via Mongoose Adapter) |
| **State Management** | TanStack React Query 5 (Server State) |
| **URL State** | nuqs 2.8 (Type-safe URL search params) |
| **Styling** | Tailwind CSS 4 + shadcn/ui (46+ components) |
| **Form** | React Hook Form 7 + Zod 3 |
| **Auth** | PayloadCMS Auth + Custom OTP Flow |
| **Email** | Brevo API (Transactional Emails) |
| **Icons** | Lucide React |
| **Notifications** | Sonner (Toast) |
| **Carousel** | Embla Carousel |
| **Charts** | Recharts |
| **Font** | DM Sans (Google Fonts) |
| **Language** | TypeScript 5 |
| **Runtime** | Node.js / Bun |

---

## 📁 Cấu Trúc Dự Án

```
ecommerce/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (app)/                    # App group route
│   │   │   ├── (auth)/               # Authentication routes
│   │   │   │   ├── sign-in/          # Trang đăng nhập
│   │   │   │   ├── sign-up/          # Trang đăng ký
│   │   │   │   └── verify/           # Trang xác thực email OTP
│   │   │   ├── (home)/               # Home group route
│   │   │   │   ├── [category]/       # Dynamic category pages
│   │   │   │   │   └── [subcategory]/ # Dynamic subcategory pages
│   │   │   │   ├── about/            # Trang giới thiệu
│   │   │   │   ├── contact/          # Trang liên hệ
│   │   │   │   ├── features/         # Trang tính năng
│   │   │   │   ├── pricing/          # Trang bảng giá
│   │   │   │   ├── layout.tsx        # Home layout (Navbar + SearchFilter + Footer)
│   │   │   │   └── page.tsx          # Trang chủ
│   │   │   ├── api/trpc/             # tRPC HTTP handler
│   │   │   ├── globals.css           # Global styles
│   │   │   └── layout.tsx            # Root app layout (Providers)
│   │   └── (payload)/                # PayloadCMS Admin routes
│   │
│   ├── collections/                  # PayloadCMS Collections (Data Models)
│   │   ├── Categories.ts             # Danh mục sản phẩm (parent/child hierarchy)
│   │   ├── EmailVerifications.ts     # OTP email verification records
│   │   ├── Media.ts                  # Upload media files
│   │   ├── Products.ts              # Sản phẩm
│   │   ├── Tag.ts                    # Tags gắn nhãn sản phẩm
│   │   └── Users.ts                  # Tài khoản người dùng
│   │
│   ├── modules/                      # Feature Modules (Domain-Driven)
│   │   ├── auth/                     # Module xác thực
│   │   │   ├── config/               # Auth configuration
│   │   │   ├── server/procedures.ts  # tRPC auth procedures
│   │   │   ├── ui/view/              # Auth UI views (sign-in, sign-up, verify)
│   │   │   ├── schemas.ts            # Zod validation schemas
│   │   │   ├── email.ts              # Email service (Brevo)
│   │   │   ├── otp.ts                # OTP generation & verification
│   │   │   └── utils.ts              # Auth utilities
│   │   ├── categories/               # Module danh mục
│   │   │   └── server/               # Category queries
│   │   ├── home/                     # Module trang chủ
│   │   │   └── ui/components/        # Navbar, Footer, SearchFilter
│   │   ├── products/                 # Module sản phẩm
│   │   │   ├── hooks/                # Custom hooks (useProductFilter)
│   │   │   ├── server/procedures.ts  # Product queries & mutations
│   │   │   ├── ui/components/        # ProductCard, ProductList, Filters, Sort
│   │   │   ├── search-params.ts      # URL search params schema (nuqs)
│   │   │   └── types.ts              # Product type definitions
│   │   └── tags/                     # Module tags
│   │       └── server/               # Tag queries
│   │
│   ├── components/ui/               # shadcn/ui Components (46+ components)
│   ├── config/environment.ts        # Environment variables config
│   ├── hooks/                       # Global custom hooks
│   ├── lib/utils.ts                 # Utility functions (cn, ...)
│   ├── trpc/                        # tRPC Setup
│   │   ├── client.tsx               # Client-side tRPC provider
│   │   ├── server.ts                # Server-side tRPC caller
│   │   ├── init.ts                  # tRPC initialization
│   │   ├── query-client.ts          # React Query client config
│   │   └── routers/_app.ts          # Main app router (auth, categories, products, tags)
│   │
│   ├── payload.config.ts           # PayloadCMS main configuration
│   ├── payload-types.ts            # Auto-generated TypeScript types
│   └── seed.ts                     # Database seed script
│
├── public/                          # Static assets
├── .env.example                     # Environment variables template
├── components.json                  # shadcn/ui configuration
├── next.config.ts                   # Next.js config (withPayload)
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript configuration
└── postcss.config.mjs              # PostCSS config (Tailwind)
```

---

## 🚀 Bắt Đầu

### Yêu Cầu Hệ Thống

- **Node.js** >= 18.x (hoặc **Bun**)
- **MongoDB** (local hoặc Atlas)
- **Brevo Account** (cho email verification - tùy chọn)

### 1. Clone Repository

```bash
git clone https://github.com/dokyanh220/ecommerce.git
cd ecommerce
```

### 2. Cài Đặt Dependencies

```bash
npm install
# hoặc
bun install
```

### 3. Cấu Hình Environment

Tạo file `.env` từ template:

```bash
cp .env.example .env
```

Cập nhật các biến môi trường:

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/bizmart

# PayloadCMS secret (random string)
PAYLOAD_SECRET=your-super-secret-key-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Brevo Email (tùy chọn - cho email verification)
BREVO_API_KEY=your-brevo-api-key
ADMIN_EMAIL_ADDRESS=admin@bizmart.com
ADMIN_EMAIL_NAME=BizMart
```

### 4. Seed Database (Tùy Chọn)

Tạo dữ liệu mẫu cho categories:

```bash
npm run db:seed
```

### 5. Chạy Development Server

```bash
npm run dev
# hoặc
bun dev
```

Truy cập:
- 🌐 **App**: [http://localhost:3000](http://localhost:3000)
- 🔧 **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 📜 Scripts

| Script | Mô Tả |
|--------|-------|
| `npm run dev` | Chạy development server |
| `npm run build` | Build production |
| `npm run start` | Chạy production server |
| `npm run lint` | Kiểm tra linting |
| `npm run generate:types` | Tạo TypeScript types từ PayloadCMS collections |
| `npm run db:fresh` | Reset database (chạy migration fresh) |
| `npm run db:seed` | Seed dữ liệu mẫu |
| `npm run db:reset` | Reset + Seed database |

---

## 🗄️ Data Models

### Users
| Field | Type | Mô Tả |
|-------|------|-------|
| `email` | Email | Email đăng nhập (unique) |
| `password` | Password | Mật khẩu (hashed bởi PayloadCMS) |
| `username` | Text | Tên người dùng (unique, lowercase) |
| `phone` | Text | Số điện thoại (unique) |
| `active` | Checkbox | Trạng thái xác thực email |

### Products
| Field | Type | Mô Tả |
|-------|------|-------|
| `name` | Text | Tên sản phẩm |
| `description` | Text | Mô tả sản phẩm |
| `price` | Number | Giá (USD) |
| `category` | Relationship | Danh mục sản phẩm |
| `tags` | Relationship[] | Tags gắn nhãn |
| `image` | Upload | Ảnh sản phẩm |
| `refundPolicy` | Select | Chính sách hoàn tiền |

### Categories
| Field | Type | Mô Tả |
|-------|------|-------|
| `name` | Text | Tên danh mục |
| `slug` | Text | URL slug (unique, indexed) |
| `color` | Text | Mã màu hex |
| `parent` | Relationship | Danh mục cha |
| `subcategories` | Join | Danh sách danh mục con |

### Tags
| Field | Type | Mô Tả |
|-------|------|-------|
| `name` | Text | Tên tag (unique) |
| `products` | Relationship[] | Sản phẩm liên kết |

---

## 🏛️ Kiến Trúc

```
┌─────────────────────────────────────────────────────┐
│                    Client (Browser)                  │
│  React 19 + TanStack Query + nuqs URL State         │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              Next.js 15 App Router                   │
│  ┌───────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Server   │  │  Client  │  │  API Routes      │  │
│  │Components │  │Components│  │  /api/trpc/[trpc]│  │
│  └─────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│        │              │                 │            │
│        ▼              ▼                 ▼            │
│  ┌─────────────────────────────────────────────┐     │
│  │           tRPC Router (Type-Safe)           │     │
│  │  auth │ categories │ products │ tags        │     │
│  └────────────────────┬────────────────────────┘     │
│                       │                              │
│                       ▼                              │
│  ┌─────────────────────────────────────────────┐     │
│  │          PayloadCMS 3 (Headless CMS)        │     │
│  │  Collections │ Admin Panel │ Auth │ Media   │     │
│  └────────────────────┬────────────────────────┘     │
│                       │                              │
└───────────────────────┼──────────────────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │     MongoDB      │
              │  (Mongoose ORM)  │
              └──────────────────┘
```

---

<div align="center">

**Built with ❤️ using Next.js, PayloadCMS & tRPC**

</div>
