import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import CartItem from '../components/CartItem'

export default function Cart() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-aura-silver mb-4" />
          <h2 className="font-display text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-aura-silver mb-6">Looks like you haven't added anything yet</p>
          <Link to="/" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-semibold">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {items.map((item, index) => (
              <CartItem key={`${item.product.id}-${item.product.size}-${item.product.color}`} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-aura-cream p-6 rounded-lg sticky top-24">
              <h3 className="font-display text-xl font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-aura-charcoal">Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-aura-charcoal">Shipping</span>
                  <span>{total >= 999 ? 'Free' : '₹99'}</span>
                </div>
                <div className="border-t border-aura-silver/30 pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="font-display text-lg">
                    ₹{(total + (total >= 999 ? 0 : 99)).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/"
                className="block text-center mt-4 text-sm text-aura-charcoal hover:text-aura-black transition-colors"
              >
                Continue Shopping
              </Link>

              {total < 999 && (
                <p className="mt-4 text-xs text-center text-aura-silver">
                  Add ₹{999 - total} more for free shipping
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

