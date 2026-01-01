import { Link } from 'react-router-dom'
import { Instagram, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-aura-black text-aura-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-display text-2xl font-semibold mb-4">
              Aura<span className="text-aura-gold">Fashions</span>
            </h3>
            <p className="text-aura-silver max-w-md">
              Premium quality t-shirts and hoodies designed for those who appreciate 
              minimalist fashion with an edge. Black & white, because simplicity is the 
              ultimate sophistication.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-aura-silver hover:text-aura-gold transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-aura-silver hover:text-aura-gold transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-aura-silver hover:text-aura-gold transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/?category=t-shirt" className="text-aura-silver hover:text-aura-white transition-colors">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/?category=hoodie" className="text-aura-silver hover:text-aura-white transition-colors">
                  Hoodies
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-aura-silver hover:text-aura-white transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-aura-silver hover:text-aura-white transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-aura-silver hover:text-aura-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-aura-gray mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-aura-silver text-sm">
            © 2026 AuraFashions. All rights reserved.
          </p>
          <p className="text-aura-silver text-sm mt-2 md:mt-0">
            Made with ♥ for fashion lovers
          </p>
        </div>
      </div>
    </footer>
  )
}

