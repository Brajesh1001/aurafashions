from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Product, User
from app.schemas import ProductCreate, ProductUpdate, ProductResponse
from app.auth.jwt import get_current_admin

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=List[ProductResponse])
async def get_products(
    category: Optional[str] = Query(None, description="Filter by category (t-shirt, hoodie)"),
    color: Optional[str] = Query(None, description="Filter by color (black, white)"),
    size: Optional[str] = Query(None, description="Filter by size (S, M, L, XL)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Get all products (PUBLIC - no auth required)
    Supports filtering by category, color, and size
    """
    query = db.query(Product)
    
    if category:
        query = query.filter(Product.category == category.lower())
    if color:
        query = query.filter(Product.color == color.lower())
    if size:
        query = query.filter(Product.size == size.upper())
    
    products = query.offset(skip).limit(limit).all()
    return products


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get single product by ID (PUBLIC - no auth required)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product


# ============ Admin Only Routes ============

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Create new product (ADMIN only)"""
    # Validate category
    if product.category.lower() not in ["t-shirt", "hoodie"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category must be 't-shirt' or 'hoodie'"
        )
    
    # Validate color
    if product.color.lower() not in ["black", "white"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Color must be 'black' or 'white'"
        )
    
    # Validate size
    if product.size.upper() not in ["S", "M", "L", "XL"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Size must be 'S', 'M', 'L', or 'XL'"
        )
    
    db_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        stock=product.stock,
        category=product.category.lower(),
        color=product.color.lower(),
        size=product.size.upper(),
        image_url=product.image_url
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Update product (ADMIN only)"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    update_data = product_update.model_dump(exclude_unset=True)
    
    # Validate category if provided
    if "category" in update_data and update_data["category"].lower() not in ["t-shirt", "hoodie"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category must be 't-shirt' or 'hoodie'"
        )
    
    # Validate color if provided
    if "color" in update_data and update_data["color"].lower() not in ["black", "white"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Color must be 'black' or 'white'"
        )
    
    # Validate size if provided
    if "size" in update_data and update_data["size"].upper() not in ["S", "M", "L", "XL"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Size must be 'S', 'M', 'L', or 'XL'"
        )
    
    for key, value in update_data.items():
        if key == "category" and value:
            value = value.lower()
        elif key == "color" and value:
            value = value.lower()
        elif key == "size" and value:
            value = value.upper()
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Delete product (ADMIN only)"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    db.delete(db_product)
    db.commit()
    return None

