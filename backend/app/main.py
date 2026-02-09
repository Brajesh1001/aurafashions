from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database import engine, Base
from app.routes import auth, products, orders

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AuraFashions API",
    description="E-Kart E-commerce API for AuraFashions - T-Shirts & Hoodies",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "https://aurafashions-844d1.web.app",
        "https://aurafashions-844d1.firebaseapp.com",
        "https://aurafashions.in",
        "https://www.aurafashions.in"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to AuraFashions API",
        "docs": "/docs",
        "health": "ok"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

