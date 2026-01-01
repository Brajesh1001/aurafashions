import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Heart } from 'lucide-react'
import { productAPI } from '../services/api'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import ColorSelector from '../components/ColorSelector'
import SizeSelector from '../components/SizeSelector'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { isAuthenticated, login } = useAuth()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await productAPI.getById(id)
        setProduct(response.data)
        setSelectedSize(response.data.size)
        setSelectedColor(response.data.color)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      login()
      return
    }

    if (!selectedSize) {
      return
    }

    addToCart({
      ...product,
      size: selectedSize,
      color: selectedColor,
    }, quantity)
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      login()
      return
    }

    handleAddToCart()
    navigate('/cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            <div className="aspect-[3/4] bg-aura-cream animate-shimmer rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-aura-cream rounded w-3/4 animate-shimmer" />
              <div className="h-6 bg-aura-cream rounded w-1/4 animate-shimmer" />
              <div className="h-24 bg-aura-cream rounded animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl mb-2">Product not found</h2>
          <button onClick={() => navigate('/')} className="btn-primary mt-4">
            Back to Shop
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-aura-charcoal hover:text-aura-black mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <div className="aspect-[3/4] bg-aura-cream rounded-lg overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-aura-silver">
                <span className="font-display text-8xl">A</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-aura-silver uppercase tracking-wide mb-2">
                AuraFashions
              </p>
              <h1 className="font-display text-3xl lg:text-4xl font-semibold text-aura-black">
                {product.name}
              </h1>
              <p className="font-display text-2xl lg:text-3xl font-semibold text-aura-gold mt-2">
                ₹{product.price.toLocaleString()}
              </p>
            </div>

            <p className="text-aura-charcoal leading-relaxed">
              {product.description || 'Premium quality fashion piece from AuraFashions. Made with 100% cotton for maximum comfort and style.'}
            </p>

            {/* Color Selector */}
            <ColorSelector
              selectedColor={selectedColor}
              onSelect={setSelectedColor}
              availableColors={['black', 'white']}
            />

            {/* Size Selector */}
            <SizeSelector
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
              availableSizes={['S', 'M', 'L', 'XL']}
            />

            {/* Quantity */}
            <div className="space-y-3">
              <span className="text-sm font-medium text-aura-charcoal">Quantity:</span>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center border border-aura-silver hover:border-aura-black text-lg transition-colors"
                >
                  -
                </button>
                <span className="font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center border border-aura-silver hover:border-aura-black text-lg transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-secondary flex-1 flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="btn-primary flex-1"
              >
                Buy Now
              </button>
            </div>

            {/* Wishlist */}
            <button className="flex items-center space-x-2 text-aura-silver hover:text-aura-black transition-colors">
              <Heart className="w-5 h-5" />
              <span>Add to Wishlist</span>
            </button>

            {/* Product Info */}
            <div className="border-t border-aura-cream pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-aura-silver">Category</span>
                <span className="capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-aura-silver">Material</span>
                <span>100% Cotton</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-aura-silver">Care</span>
                <span>Machine wash cold</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

