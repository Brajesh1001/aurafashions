import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Loader } from 'lucide-react'
import { productAPI } from '../services/api'
import toast from 'react-hot-toast'

const initialFormData = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: 't-shirt',
  color: 'black',
  size: 'M',
  image_url: '',
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState(initialFormData)
  const [submitting, setSubmitting] = useState(false)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getAll()
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setFormData(initialFormData)
    setShowModal(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      color: product.color,
      size: product.size,
      image_url: product.image_url || '',
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setFormData(initialFormData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      }

      if (editingProduct) {
        await productAPI.update(editingProduct.id, productData)
        toast.success('Product updated successfully')
      } else {
        await productAPI.create(productData)
        toast.success('Product created successfully')
      }

      closeModal()
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error(error.response?.data?.detail || 'Failed to save product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return
    }

    try {
      await productAPI.delete(product.id)
      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-semibold">Product Management</h1>
            <p className="text-aura-silver mt-1">Manage your AuraFashions inventory</p>
          </div>
          <button onClick={openAddModal} className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-8 h-8 animate-spin text-aura-gold" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-aura-cream rounded-lg">
            <p className="text-aura-silver mb-4">No products yet</p>
            <button onClick={openAddModal} className="btn-primary">
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="bg-aura-white border border-aura-cream rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-aura-cream">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-aura-charcoal">Image</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-aura-charcoal">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-aura-charcoal">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-aura-charcoal">Color</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-aura-charcoal">Size</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-aura-charcoal">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-aura-charcoal">Stock</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-aura-charcoal">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-aura-cream">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-aura-cream/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-12 h-16 bg-aura-cream rounded overflow-hidden">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-aura-silver">
                              <span className="font-display">A</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">{product.name}</span>
                      </td>
                      <td className="px-6 py-4 capitalize">{product.category}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-4 h-4 rounded-full border ${
                              product.color === 'black' ? 'bg-aura-black' : 'bg-aura-white border-aura-silver'
                            }`}
                          />
                          <span className="capitalize">{product.color}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{product.size}</td>
                      <td className="px-6 py-4 font-medium">₹{product.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 text-aura-charcoal hover:text-aura-gold transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="p-2 text-aura-charcoal hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-aura-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-aura-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-aura-cream">
              <h2 className="font-display text-xl font-semibold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal} className="text-aura-silver hover:text-aura-black">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
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
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="t-shirt">T-Shirt</option>
                    <option value="hoodie">Hoodie</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Color *</label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="black">Black</option>
                    <option value="white">White</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Size *</label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="input-field"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

