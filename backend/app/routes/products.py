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
    grouped: bool = Query(False, description="Whether to group products by name/color"),
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

    if grouped and not size:
        # Group products by name, color, category
        grouped_products = {}
        for p in products:
            key = (p.name, p.color, p.category)
            if key not in grouped_products:
                # Add extra fields for the response
                p.available_sizes = []
                p.available_colors = []
                grouped_products[key] = p
            
            # This logic only works if the limit hasn't cut off some variants
            # For a proper implementation, we should fetch all variants for these products
        
        # To be safe and efficient, we just group what we have for now
        # But we need to find all sizes for these grouped products
        for p in grouped_products.values():
            variants = db.query(Product).filter(
                Product.name == p.name,
                Product.category == p.category,
                Product.color == p.color
            ).all()
            p.available_sizes = sorted(list(set(v.size for v in variants)))
            p.available_colors = sorted(list(set(v.color for v in variants)))
            
        return list(grouped_products.values())

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
    
    # Also fetch available sizes/colors for this product
    variants = db.query(Product).filter(
        Product.name == product.name,
        Product.category == product.category,
        Product.color == product.color
    ).all()
    product.available_sizes = sorted(list(set(v.size for v in variants)))
    product.available_colors = sorted(list(set(v.color for v in variants)))
    
    return product


@router.get("/{product_id}/variants", response_model=List[ProductResponse])
async def get_product_variants(product_id: int, db: Session = Depends(get_db)):
    """Get all variants (sizes/colors) of a product"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    variants = db.query(Product).filter(
        Product.name == product.name,
        Product.category == product.category
    ).all()
    return variants


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

