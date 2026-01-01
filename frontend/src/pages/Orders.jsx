import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight, ShoppingBag } from 'lucide-react'
import { orderAPI } from '../services/api'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await orderAPI.getMyOrders()
        setOrders(response.data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-semibold mb-8">My Orders</h1>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-aura-cream p-6 rounded-lg animate-shimmer">
                <div className="h-6 bg-aura-white rounded w-1/4 mb-2" />
                <div className="h-4 bg-aura-white rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-aura-silver mb-4" />
          <h2 className="font-display text-2xl font-semibold mb-2">No orders yet</h2>
          <p className="text-aura-silver mb-6">Start shopping to see your orders here</p>
          <Link to="/" className="btn-primary inline-block">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-semibold mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-aura-white border border-aura-cream rounded-lg overflow-hidden"
            >
              {/* Order Header */}
              <div
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="p-6 cursor-pointer hover:bg-aura-cream/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-aura-cream rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-aura-charcoal" />
                    </div>
                    <div>
                      <h3 className="font-medium">Order #{order.id}</h3>
                      <p className="text-sm text-aura-silver">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="font-display font-semibold">
                      ₹{order.total_amount.toLocaleString()}
                    </span>
                    <ChevronRight
                      className={`w-5 h-5 text-aura-silver transition-transform ${
                        expandedOrder === order.id ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Order Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-aura-cream p-6 bg-aura-cream/30 animate-slide-down">
                  <h4 className="font-medium mb-4">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 bg-aura-white p-3 rounded"
                      >
                        <div className="w-16 h-20 bg-aura-cream rounded overflow-hidden flex-shrink-0">
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
                          <h5 className="font-medium truncate">{item.product.name}</h5>
                          <p className="text-sm text-aura-silver capitalize">
                            {item.product.color} • Size {item.product.size}
                          </p>
                          <p className="text-sm text-aura-silver">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.shipping_address && (
                    <div className="mt-6 pt-4 border-t border-aura-cream">
                      <h4 className="font-medium mb-2">Shipping Address</h4>
                      <p className="text-sm text-aura-charcoal whitespace-pre-line">
                        {order.shipping_address}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

