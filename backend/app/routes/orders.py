from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Order, OrderItem, Product, User
from app.schemas import OrderCreate, OrderResponse, OrderListResponse
from app.auth.jwt import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create new order (PROTECTED - auth required)
    """
    if not order_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must have at least one item"
        )
    
    total_amount = 0
    order_items = []
    
    # Validate products and calculate total
    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID {item.product_id} not found"
            )
        
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for product '{product.name}'. Available: {product.stock}"
            )
        
        item_total = product.price * item.quantity
        total_amount += item_total
        
        order_items.append({
            "product": product,
            "quantity": item.quantity,
            "price": product.price
        })
    
    # Create order
    db_order = Order(
        user_id=current_user.id,
        total_amount=total_amount,
        status="pending",
        shipping_address=order_data.shipping_address
    )
    db.add(db_order)
    db.flush()  # Get order ID
    
    # Create order items and update stock
    for item_data in order_items:
        order_item = OrderItem(
            order_id=db_order.id,
            product_id=item_data["product"].id,
            quantity=item_data["quantity"],
            price=item_data["price"]
        )
        db.add(order_item)
        
        # Update stock
        item_data["product"].stock -= item_data["quantity"]
    
    db.commit()
    db.refresh(db_order)
    
    return db_order


@router.get("/my", response_model=List[OrderResponse])
async def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get current user's orders (PROTECTED - auth required)
    """
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    return orders


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get specific order by ID (PROTECTED - auth required)
    Users can only view their own orders
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Check if user owns this order (unless admin)
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return order

