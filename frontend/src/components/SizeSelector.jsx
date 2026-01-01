export default function SizeSelector({ selectedSize, onSelect, availableSizes = ['S', 'M', 'L', 'XL'] }) {
  return (
    <div className="space-y-3">
      <span className="text-sm font-medium text-aura-charcoal">Size:</span>
      <div className="flex space-x-2">
        {availableSizes.map(size => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={`w-12 h-12 flex items-center justify-center border-2 font-medium transition-all
              ${selectedSize === size 
                ? 'border-aura-black bg-aura-black text-aura-white' 
                : 'border-aura-silver text-aura-charcoal hover:border-aura-black'
              }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}

