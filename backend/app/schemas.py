from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ============ User Schemas ============
class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    picture: Optional[str] = None


class UserResponse(UserBase):
    id: int
    picture: Optional[str] = None
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ Auth Schemas ============
class GoogleAuthRequest(BaseModel):
    token: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ============ Product Schemas ============
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    category: str
    color: str
    size: str
    image_url: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category: Optional[str] = None
    color: Optional[str] = None
    size: Optional[str] = None
    image_url: Optional[str] = None


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    available_sizes: Optional[List[str]] = None
    available_colors: Optional[List[str]] = None
    
    class Config:
        from_attributes = True


# ============ Order Schemas ============
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    product: ProductResponse
    
    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: Optional[str] = None


class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    shipping_address: Optional[str] = None
    created_at: datetime
    items: List[OrderItemResponse]
    
    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    id: int
    total_amount: float
    status: str
    created_at: datetime
    items_count: int
    
    class Config:
        from_attributes = True

