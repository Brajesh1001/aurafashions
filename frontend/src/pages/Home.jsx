import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { productAPI } from '../services/api'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const category = searchParams.get('category')
  const color = searchParams.get('color')
  const size = searchParams.get('size')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const params = {}
        if (category) params.category = category
        if (color) params.color = color
        if (size) params.size = size

        const response = await productAPI.getAll(params)
        setProducts(response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, color, size])

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  const hasFilters = category || color || size

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-aura-black text-aura-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-aura-gold/20 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl lg:text-6xl font-semibold mb-4 animate-fade-in">
              Minimalist Fashion,{' '}
              <span className="text-aura-gold">Maximum Impact</span>
            </h1>
            <p className="text-lg text-aura-silver mb-8 animate-slide-up">
              Premium T-shirts and hoodies in classic black & white.
              Because true style doesn't need complications.
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <button
                onClick={() => updateFilter('category', 't-shirt')}
                className="btn-gold"
              >
                Shop T-Shirts
              </button>
              <button
                onClick={() => updateFilter('category', 'hoodie')}
                className="btn-secondary"
              >
                Shop Hoodies
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-semibold">
                {category ? category.charAt(0).toUpperCase() + category.slice(1) + 's' : 'All Products'}
              </h2>
              <p className="text-aura-silver mt-1">
                {products.length} {products.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-aura-silver hover:border-aura-black transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {hasFilters && (
                <span className="w-5 h-5 bg-aura-gold text-aura-black text-xs rounded-full flex items-center justify-center">
                  {[category, color, size].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-aura-cream p-6 rounded-lg mb-8 animate-slide-down">
              <div className="flex flex-wrap gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateFilter('category', '')}
                      className={`px-4 py-2 text-sm ${!category ? 'bg-aura-black text-aura-white' : 'bg-aura-white border border-aura-silver'}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => updateFilter('category', 't-shirt')}
                      className={`px-4 py-2 text-sm ${category === 't-shirt' ? 'bg-aura-black text-aura-white' : 'bg-aura-white border border-aura-silver'}`}
                    >
                      T-Shirts
                    </button>
                    <button
                      onClick={() => updateFilter('category', 'hoodie')}
                      className={`px-4 py-2 text-sm ${category === 'hoodie' ? 'bg-aura-black text-aura-white' : 'bg-aura-white border border-aura-silver'}`}
                    >
                      Hoodies
                    </button>
                  </div>
                </div>

                {/* Color Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateFilter('color', '')}
                      className={`px-4 py-2 text-sm ${!color ? 'bg-aura-black text-aura-white' : 'bg-aura-white border border-aura-silver'}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => updateFilter('color', 'black')}
                      className={`px-4 py-2 text-sm ${color === 'black' ? 'bg-aura-black text-aura-white' : 'bg-aura-white border border-aura-silver'}`}
                    >
                      Black
                    </button>
                    <button
                      onClick={() => updateFilter('color', 'white')}
                      className={`px-4 py-2 text-sm ${color === 'white' ? 'bg-aura-black text-aura-white' : 'bg-aura-white border border-aura-silver'}`}
                    >
                      White
                    </button>
                  </div>
                </div>

                {/* Size Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Size</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateFilter('size', '')}
                      className={`px-4 py-2 text-sm ${!size ? 'bg-aura-black text-aura-white' : 'bg-aura-white border border-aura-silver'}`}
                    >
                      All
                    </button>
                    {['S', 'M', 'L', 'XL'].map(s => (
                      <button
                        key={s}
                        onClick={() => updateFilter('size', s)}
                        className={`px-4 py-2 text-sm ${size === s ? 'bg-aura-black text-aura-white' : 'bg-aura-white border border-aura-silver'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 flex items-center space-x-1 text-sm text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                  <span>Clear all filters</span>
                </button>
              )}
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-shimmer">
                  <div className="aspect-[3/4] bg-aura-cream rounded-lg" />
                  <div className="mt-4 h-4 bg-aura-cream rounded w-3/4" />
                  <div className="mt-2 h-4 bg-aura-cream rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-display text-2xl text-aura-charcoal mb-2">No products found</p>
              <p className="text-aura-silver">Try adjusting your filters</p>
              {hasFilters && (
                <button onClick={clearFilters} className="btn-primary mt-4">
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-16 bg-aura-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-aura-black text-aura-gold rounded-full flex items-center justify-center">
                <span className="font-display text-xl">✦</span>
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Premium Quality</h3>
              <p className="text-aura-silver">100% cotton, ethically sourced and carefully crafted</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-aura-black text-aura-gold rounded-full flex items-center justify-center">
                <span className="font-display text-xl">↻</span>
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Easy Returns</h3>
              <p className="text-aura-silver">30-day return policy, no questions asked</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-aura-black text-aura-gold rounded-full flex items-center justify-center">
                <span className="font-display text-xl">✈</span>
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Fast Shipping</h3>
              <p className="text-aura-silver">Free shipping on orders over ₹999</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

