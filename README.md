# 🛍️ AuraFashions - E-Kart E-Commerce Platform

A modern, full-stack e-commerce platform for premium T-shirts and hoodies, built with React, FastAPI, and PostgreSQL.

![AuraFashions](https://via.placeholder.com/800x400?text=AuraFashions)

## ✨ Features

### Customer Features
- 🔐 **Google OAuth Authentication** - Secure login with Google
- 🛒 **Shopping Cart** - Add, remove, and manage items
- 📦 **Order Management** - Place orders and track order history
- 🔍 **Product Filtering** - Filter by category, color, and size
- 📱 **Responsive Design** - Beautiful UI on all devices

### Admin Features
- 📊 **Product Management** - Add, edit, and delete products
- 📈 **Inventory Control** - Track stock levels
- 🏷️ **Category Management** - T-Shirts & Hoodies

### Tech Highlights
- ⚡ **Fast API** - High-performance backend
- 🎨 **Tailwind CSS** - Modern, customizable styling
- 🔒 **JWT Authentication** - Secure API access
- 🗄️ **PostgreSQL** - Reliable data storage

## 🏗️ Tech Stack

### Frontend
- React 18 (Vite)
- Tailwind CSS
- React Router DOM
- @react-oauth/google
- Axios
- Lucide React Icons

### Backend
- FastAPI
- SQLAlchemy ORM
- Alembic (migrations)
- python-jose (JWT)
- Google OAuth verification

### Database
- PostgreSQL

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL
- Google Cloud Console project (for OAuth)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/aurafashions.git
cd aurafashions
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb ekart

# Update DATABASE_URL in .env
# DATABASE_URL=postgresql://user:password@localhost:5432/ekart

# Run migrations (or let SQLAlchemy create tables)
# Tables are auto-created on first run
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth Client ID
5. Configure consent screen
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - Your production URL
7. Copy Client ID to both frontend and backend `.env` files

### 5. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

### 6. Run the Application

**Backend:**
```bash
cd backend
uvicorn app.main:app --reload
```
Backend runs at: http://localhost:8000

**Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at: http://localhost:5173

## 📁 Project Structure

```
aurafashions/
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom React hooks
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/
│   ├── app/
│   │   ├── auth/          # Authentication logic
│   │   ├── routes/        # API routes
│   │   ├── core/          # Configuration
│   │   ├── main.py        # FastAPI app
│   │   ├── models.py      # Database models
│   │   ├── schemas.py     # Pydantic schemas
│   │   └── database.py    # Database connection
│   ├── alembic/           # Database migrations
│   └── requirements.txt
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/google` - Google OAuth login
- `GET /auth/me` - Get current user

### Products (Public)
- `GET /products` - List all products
- `GET /products/{id}` - Get product details

### Products (Admin)
- `POST /products` - Create product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Orders (Protected)
- `POST /orders` - Create order
- `GET /orders/my` - Get user's orders
- `GET /orders/{id}` - Get order details

## 🎨 Design System

### Colors
- **Black:** `#0a0a0a` - Primary brand color
- **Charcoal:** `#1a1a1a` - Secondary dark
- **Gold:** `#c9a962` - Accent color
- **Cream:** `#f5f5f0` - Light background
- **White:** `#fafafa` - Main background

### Typography
- **Display:** Playfair Display (headings)
- **Body:** DM Sans (content)

## 🚢 Deployment

### Backend (Render)
1. Create new Web Service
2. Connect GitHub repository
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn -k uvicorn.workers.UvicornWorker app.main:app`
5. Add environment variables

### Frontend (Vercel)
1. Import project from GitHub
2. Framework: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables

### Database (Render/Supabase)
- Create PostgreSQL instance
- Update `DATABASE_URL` in backend environment

## 🔐 Making a User Admin

Connect to your PostgreSQL database and run:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@gmail.com';
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google OAuth](https://developers.google.com/identity)

---

Built with ❤️ by AuraFashions Team

