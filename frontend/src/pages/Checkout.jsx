import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Loader } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { orderAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode']
    const emptyFields = requiredFields.filter(field => !formData[field])
    
    if (emptyFields.length > 0) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      
      const orderData = {
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        shipping_address: `${formData.name}\n${formData.phone}\n${formData.address}\n${formData.city}, ${formData.state} - ${formData.pincode}`,
      }

      const response = await orderAPI.create(orderData)
      setOrderId(response.data.id)
      setOrderPlaced(true)
      clearCart()
      toast.success('Order placed successfully!')
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error(error.response?.data?.detail || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-6" />
          <h2 className="font-display text-3xl font-semibold mb-2">Order Confirmed!</h2>
          <p className="text-aura-silver mb-2">Thank you for shopping with AuraFashions</p>
          <p className="text-aura-charcoal mb-6">Order ID: #{orderId}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/orders')}
              className="btn-primary"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-semibold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div>
            <h2 className="font-display text-xl font-semibold mb-4">Shipping Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">PIN Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Place Order • ₹{(total + (total >= 999 ? 0 : 99)).toLocaleString()}</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
            <div className="bg-aura-cream p-6 rounded-lg">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.product.size}-${item.product.color}`}
                  className="flex items-center space-x-4 py-3 border-b border-aura-silver/30 last:border-0"
                >
                  <div className="w-16 h-20 bg-aura-white rounded overflow-hidden flex-shrink-0">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-aura-silver">
                        <span className="font-display">A</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                    <p className="text-xs text-aura-silver capitalize">
                      {item.product.color} • {item.product.size} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t border-aura-silver/30 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{total >= 999 ? 'Free' : '₹99'}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-aura-silver/30">
                  <span>Total</span>
                  <span className="font-display">
                    ₹{(total + (total >= 999 ? 0 : 99)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

