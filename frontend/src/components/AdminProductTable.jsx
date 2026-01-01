import { Pencil, Trash2 } from 'lucide-react'

export default function AdminProductTable({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-aura-cream rounded-lg">
        <p className="text-aura-silver">No products found</p>
      </div>
    )
  }

  return (
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
                      onClick={() => onEdit(product)}
                      className="p-2 text-aura-charcoal hover:text-aura-gold transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
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
  )
}

