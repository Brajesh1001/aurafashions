import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../hooks/useCart'

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()
  const { product, quantity } = item

  return (
    <div className="flex items-center space-x-4 py-4 border-b border-aura-cream">
      {/* Image */}
      <div className="w-24 h-32 bg-aura-cream rounded overflow-hidden flex-shrink-0">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-aura-silver">
            <span className="font-display text-2xl">A</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-aura-black truncate">{product.name}</h3>
        <p className="text-sm text-aura-silver capitalize">
          {product.color} • Size {product.size}
        </p>
        <p className="font-display font-semibold mt-1">₹{product.price.toLocaleString()}</p>
        
        {/* Quantity Controls */}
        <div className="flex items-center space-x-2 mt-2">
          <button
            onClick={() => updateQuantity(product.id, product.size, product.color, quantity - 1)}
            className="w-8 h-8 flex items-center justify-center border border-aura-silver hover:border-aura-black transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <button
            onClick={() => updateQuantity(product.id, product.size, product.color, quantity + 1)}
            className="w-8 h-8 flex items-center justify-center border border-aura-silver hover:border-aura-black transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Remove & Subtotal */}
      <div className="text-right">
        <button
          onClick={() => removeFromCart(product.id, product.size, product.color)}
          className="text-aura-silver hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <p className="font-display font-semibold text-lg mt-4">
          ₹{(product.price * quantity).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

