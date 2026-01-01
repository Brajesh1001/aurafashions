"""
Seed script to populate the database with sample products.
Run this after setting up the database:
    python seed_data.py
"""
import sys
sys.path.insert(0, '.')

from app.database import SessionLocal, engine, Base
from app.models import Product, User

# Create tables
Base.metadata.create_all(bind=engine)

# Sample products data
products_data = [
    # Black T-Shirts
    {
        "name": "Classic Black Tee",
        "description": "Essential black t-shirt crafted from 100% premium cotton. Perfect for everyday wear.",
        "price": 799,
        "stock": 50,
        "category": "t-shirt",
        "color": "black",
        "size": "S",
        "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
    },
    {
        "name": "Classic Black Tee",
        "description": "Essential black t-shirt crafted from 100% premium cotton. Perfect for everyday wear.",
        "price": 799,
        "stock": 45,
        "category": "t-shirt",
        "color": "black",
        "size": "M",
        "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
    },
    {
        "name": "Classic Black Tee",
        "description": "Essential black t-shirt crafted from 100% premium cotton. Perfect for everyday wear.",
        "price": 799,
        "stock": 40,
        "category": "t-shirt",
        "color": "black",
        "size": "L",
        "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
    },
    {
        "name": "Classic Black Tee",
        "description": "Essential black t-shirt crafted from 100% premium cotton. Perfect for everyday wear.",
        "price": 799,
        "stock": 35,
        "category": "t-shirt",
        "color": "black",
        "size": "XL",
        "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
    },
    # White T-Shirts
    {
        "name": "Pure White Essential",
        "description": "Crisp white t-shirt made from breathable cotton. A wardrobe staple.",
        "price": 799,
        "stock": 55,
        "category": "t-shirt",
        "color": "white",
        "size": "S",
        "image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500"
    },
    {
        "name": "Pure White Essential",
        "description": "Crisp white t-shirt made from breathable cotton. A wardrobe staple.",
        "price": 799,
        "stock": 50,
        "category": "t-shirt",
        "color": "white",
        "size": "M",
        "image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500"
    },
    {
        "name": "Pure White Essential",
        "description": "Crisp white t-shirt made from breathable cotton. A wardrobe staple.",
        "price": 799,
        "stock": 45,
        "category": "t-shirt",
        "color": "white",
        "size": "L",
        "image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500"
    },
    {
        "name": "Pure White Essential",
        "description": "Crisp white t-shirt made from breathable cotton. A wardrobe staple.",
        "price": 799,
        "stock": 40,
        "category": "t-shirt",
        "color": "white",
        "size": "XL",
        "image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500"
    },
    # Premium T-Shirts
    {
        "name": "Midnight Premium Tee",
        "description": "Luxurious heavyweight cotton t-shirt with a relaxed fit. Premium quality for the discerning.",
        "price": 1299,
        "stock": 30,
        "category": "t-shirt",
        "color": "black",
        "size": "M",
        "image_url": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500"
    },
    {
        "name": "Ivory Premium Tee",
        "description": "Luxurious heavyweight cotton t-shirt with a relaxed fit. Premium quality for the discerning.",
        "price": 1299,
        "stock": 30,
        "category": "t-shirt",
        "color": "white",
        "size": "M",
        "image_url": "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500"
    },
    # Black Hoodies
    {
        "name": "Noir Comfort Hoodie",
        "description": "Ultra-soft fleece hoodie in deep black. Features a kangaroo pocket and adjustable drawstring hood.",
        "price": 1999,
        "stock": 25,
        "category": "hoodie",
        "color": "black",
        "size": "S",
        "image_url": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500"
    },
    {
        "name": "Noir Comfort Hoodie",
        "description": "Ultra-soft fleece hoodie in deep black. Features a kangaroo pocket and adjustable drawstring hood.",
        "price": 1999,
        "stock": 30,
        "category": "hoodie",
        "color": "black",
        "size": "M",
        "image_url": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500"
    },
    {
        "name": "Noir Comfort Hoodie",
        "description": "Ultra-soft fleece hoodie in deep black. Features a kangaroo pocket and adjustable drawstring hood.",
        "price": 1999,
        "stock": 28,
        "category": "hoodie",
        "color": "black",
        "size": "L",
        "image_url": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500"
    },
    {
        "name": "Noir Comfort Hoodie",
        "description": "Ultra-soft fleece hoodie in deep black. Features a kangaroo pocket and adjustable drawstring hood.",
        "price": 1999,
        "stock": 22,
        "category": "hoodie",
        "color": "black",
        "size": "XL",
        "image_url": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500"
    },
    # White Hoodies
    {
        "name": "Cloud White Hoodie",
        "description": "Premium white fleece hoodie. Soft interior, perfect for layering or standalone wear.",
        "price": 1999,
        "stock": 20,
        "category": "hoodie",
        "color": "white",
        "size": "S",
        "image_url": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500"
    },
    {
        "name": "Cloud White Hoodie",
        "description": "Premium white fleece hoodie. Soft interior, perfect for layering or standalone wear.",
        "price": 1999,
        "stock": 25,
        "category": "hoodie",
        "color": "white",
        "size": "M",
        "image_url": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500"
    },
    {
        "name": "Cloud White Hoodie",
        "description": "Premium white fleece hoodie. Soft interior, perfect for layering or standalone wear.",
        "price": 1999,
        "stock": 23,
        "category": "hoodie",
        "color": "white",
        "size": "L",
        "image_url": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500"
    },
    {
        "name": "Cloud White Hoodie",
        "description": "Premium white fleece hoodie. Soft interior, perfect for layering or standalone wear.",
        "price": 1999,
        "stock": 18,
        "category": "hoodie",
        "color": "white",
        "size": "XL",
        "image_url": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500"
    },
    # Premium Hoodies
    {
        "name": "Shadow Elite Hoodie",
        "description": "Our most luxurious hoodie. Heavy-weight organic cotton with ribbed cuffs and premium finishes.",
        "price": 2999,
        "stock": 15,
        "category": "hoodie",
        "color": "black",
        "size": "L",
        "image_url": "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=500"
    },
    {
        "name": "Arctic Elite Hoodie",
        "description": "Our most luxurious hoodie. Heavy-weight organic cotton with ribbed cuffs and premium finishes.",
        "price": 2999,
        "stock": 15,
        "category": "hoodie",
        "color": "white",
        "size": "L",
        "image_url": "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=500"
    },
]


def seed_database():
    db = SessionLocal()
    try:
        # Check if products already exist
        existing_count = db.query(Product).count()
        if existing_count > 0:
            print(f"Database already has {existing_count} products. Skipping seed.")
            return
        
        # Add products
        for product_data in products_data:
            product = Product(**product_data)
            db.add(product)
        
        db.commit()
        print(f"Successfully added {len(products_data)} products to the database!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

