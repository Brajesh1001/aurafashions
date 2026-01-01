import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.product.id === product.id && 
                item.product.size === product.size &&
                item.product.color === product.color
      )

      if (existingItem) {
        toast.success('Updated quantity in cart')
        return prevItems.map(item =>
          item.product.id === product.id && 
          item.product.size === product.size &&
          item.product.color === product.color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      toast.success('Added to cart')
      return [...prevItems, { product, quantity }]
    })
  }

  const removeFromCart = (productId, size, color) => {
    setItems(prevItems => 
      prevItems.filter(item => 
        !(item.product.id === productId && 
          item.product.size === size &&
          item.product.color === color)
      )
    )
    toast.success('Removed from cart')
  }

  const updateQuantity = (productId, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color)
      return
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId && 
        item.product.size === size &&
        item.product.color === color
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem('cart')
  }

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      itemCount,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

