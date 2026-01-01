export default function ColorSelector({ selectedColor, onSelect, availableColors = ['black', 'white'] }) {
  const colorStyles = {
    black: 'bg-aura-black',
    white: 'bg-aura-white border-2 border-aura-silver',
  }

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-aura-charcoal">Color:</span>
      <div className="flex space-x-2">
        {availableColors.map(color => (
          <button
            key={color}
            onClick={() => onSelect(color)}
            className={`w-8 h-8 rounded-full ${colorStyles[color]} 
              ${selectedColor === color 
                ? 'ring-2 ring-offset-2 ring-aura-gold' 
                : 'hover:ring-2 hover:ring-offset-2 hover:ring-aura-silver'
              } transition-all`}
            title={color.charAt(0).toUpperCase() + color.slice(1)}
          />
        ))}
      </div>
    </div>
  )
}

