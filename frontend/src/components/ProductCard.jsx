import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="product-card bg-aura-white rounded-lg overflow-hidden">
        {/* Image */}
        <div className="aspect-[3/4] overflow-hidden bg-aura-cream">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="product-image w-full h-full object-cover transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-aura-silver">
              <span className="font-display text-4xl">A</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-aura-black group-hover:text-aura-gold transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-aura-silver capitalize">
                {product.category} • {product.color}
              </p>
            </div>
            <span className="font-display text-lg font-semibold text-aura-black">
              ₹{product.price.toLocaleString()}
            </span>
          </div>
          
          {/* Size Badge */}
          <div className="mt-2">
            <span className="inline-block px-2 py-1 text-xs bg-aura-cream text-aura-charcoal rounded">
              {product.size}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

