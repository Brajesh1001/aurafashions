# 🧠 E-Kart End-to-End Execution Plan (Agent-Ready)

This document is a **complete, step-by-step, end-to-end plan** to build, deploy, and scale an **E-Kart (E‑commerce) website** using **React + FastAPI + Google Authentication**.

It is written so that:
- ✅ A **coding agent / AI agent** can follow it sequentially
- ✅ Each phase is **atomic and actionable**
- ✅ It covers **architecture → development → deployment → production hardening**

---

## 🎯 Project Goal

Build a **production-grade e-commerce platform** with:
- Google OAuth authentication
- Secure backend APIs
- Scalable architecture
- Cloud deployment
- Resume / interview ready quality

---

## 🧱 Phase 0 – Final Tech Stack (Lock This)

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- @react-oauth/google

### Backend
- FastAPI
- Python 3.10+
- SQLAlchemy ORM
- Alembic (migrations)
- JWT (python-jose)
- Google OAuth token verification

### Database
- PostgreSQL

### Infrastructure
- Frontend Hosting: Vercel
- Backend Hosting: Render
- Database: Render PostgreSQL / Supabase
- Image Storage (optional): Cloudinary

---

## 🏗️ Phase 1 – System Architecture

```
Browser (React)
   |
   | HTTPS + JWT
   |
FastAPI Backend
   |
   | SQLAlchemy ORM
   |
PostgreSQL Database
```

Key principles:
- Backend is **stateless**
- Auth handled via **JWT issued by backend**
- Google only used as **Identity Provider**

---

## 📁 Phase 2 – Repository & Folder Structure

```
ekart/
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.jsx
│   └── package.json
│
│── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth/
│   │   ├── routes/
│   │   └── core/
│   └── requirements.txt
│
│── README.md
```

---

## 🔐 Phase 3 – Authentication Design (Critical)

### Public vs Protected Access Model

The application follows a **hybrid access control model**:

- 🟢 **Public Access (No Login Required)**
  - View product list
  - View product details
  - Browse categories

- 🔒 **Protected Access (Login Required)**
  - Add to cart
  - Checkout / place order
  - View order history

This improves **UX, SEO, and conversion**, while keeping sensitive actions secure.

---

### Authentication Strategy
- Google OAuth 2.0 (Frontend)
- ID Token verification (Backend)
- Backend issues **JWT access token**

### Auth Flow
```
Public User → Browse Products
                  |
      (Add to Cart / Buy)
                  ↓
           Login Required
                  ↓
          Google OAuth Login
                  ↓
             FastAPI Backend
                  ↓
       Verify Token with Google
                  ↓
        Create / Fetch User
                  ↓
        Issue JWT (App Token)
```

Rules:
- ❌ Never require login for browsing products
- ❌ Never trust frontend-only auth
- ✅ Always enforce auth on cart & order APIs

---

## 🧩 Phase 4 – Database Design

### User Table
- id
- email (unique)
- name
- role (user/admin)
- created_at

### Product Table
- id
- name
- description
- price
- stock
- category
- image_url

### Order Table
- id
- user_id (FK)
- total_amount
- status
- created_at

### OrderItem Table
- id
- order_id (FK)
- product_id (FK)
- quantity

---

## 🧠 Phase 5 – Backend API Design (FastAPI)

### Auth Routes
- POST /auth/google
- GET /auth/me

### Product Routes
- GET /products
- GET /products/{id}
- POST /products (admin)
- PUT /products/{id} (admin)
- DELETE /products/{id} (admin)

### Order Routes
- POST /orders
- GET /orders/my

Principles:
- RESTful
- JWT protected
- Role-based access

---

## 🎨 Phase 6 – Frontend Design (React)

### Brand & Scope
- **Brand Name:** AuraFashions
- **Products:** T-Shirts & Hoodies
- **Colors Available:** Black & White only
- **Images:** Stored locally / Cloudinary (already available)

---

### Pages (Frontend)

#### 🟢 Public Pages (No Login)
- Home (Product listing – AuraFashions)
- Product Details (T-shirt / Hoodie)
- Category Filter (T-Shirts | Hoodies)

#### 🔒 Protected Pages (Login Required)
- Cart
- Checkout
- Orders

#### 🔐 Admin Pages (Admin Only)
- Admin Login (Google OAuth)
- Product List (View all products)
- Add Product
- Update Product
- Delete Product

---

### Product UI Constraints (Hard Rules)
- Only **Black** and **White** color variants
- Size options: S, M, L, XL
- Clean, minimal fashion UI
- Image-first layout (fashion focused)

---

### Frontend Components

```
components/
│── Navbar.jsx
│── ProductCard.jsx
│── ColorSelector.jsx
│── SizeSelector.jsx
│── CartItem.jsx
│── AdminProductTable.jsx
```

---

### Admin Product Listing Page

**Purpose:** Allow admin to manage AuraFashions inventory

**Features:**
- List all products in table view
- Show: Image | Name | Category | Price | Stock | Color
- Edit product
- Delete product

**Access Control:**
- JWT required
- Admin role only

---

## 🧪 Phase 7 – Local Development Workflow

### Backend
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
npm install
npm run dev
```

---

## 🚀 Phase 8 – Deployment (Production)

### Backend (Render)
- Build: pip install -r requirements.txt
- Start:
```bash
gunicorn -k uvicorn.workers.UvicornWorker app.main:app
```

### Frontend (Vercel)
- Build: npm run build
- Output: dist/

---

## 🔒 Phase 9 – Security Hardening

- JWT expiration + refresh tokens
- Role-based route guards
- HTTPS only
- SQL injection prevention (ORM)
- CORS controlled

---

## 📊 Phase 10 – Monitoring & Logging

- Render logs
- FastAPI error handling
- Optional: Sentry

---

## 💳 Phase 11 – Payments (Optional Extension)

- Razorpay / Stripe
- Webhook-based confirmation
- Order status updates

---

## 📦 Phase 12 – Production Enhancements

- Redis caching
- Pagination & search
- Docker + Docker Compose
- CI/CD pipelines

---

## 🧠 Phase 13 – Agent Execution Rules

For each phase, the agent must:
1. Generate code
2. Validate locally
3. Write tests (if applicable)
4. Commit changes
5. Move to next phase

---

## 📌 Final Deliverables

- Fully deployed E-Kart website
- Clean GitHub repository
- Production-ready README
- Interview-ready explanation

---

## 🏁 Success Criteria

✔ Users can login via Google
✔ Products load correctly
✔ Orders can be placed
✔ App is deployed & secure
✔ Codebase is scalable

---

**This document is the single source of truth for the E-Kart project.**

