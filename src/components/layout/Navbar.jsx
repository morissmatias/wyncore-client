import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { FiShoppingCart, FiUser, FiLogOut, FiMenu } from 'react-icons/fi'
import { useState } from 'react'

export default function Navbar() {
  const { user, isCustomer, isAdmin, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-brand-blue shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">W</span>
            </div>
            <span className="text-white font-display font-bold text-lg">WynCore</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/catalog" className="text-blue-200 hover:text-white text-sm transition-colors">Products</Link>
            <Link to="/services" className="text-blue-200 hover:text-white text-sm transition-colors">Services</Link>
            <Link to="/about"    className="text-blue-200 hover:text-white text-sm transition-colors">About</Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isCustomer && (
              <Link to="/cart" className="relative text-blue-200 hover:text-white">
                <FiShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-green text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="flex items-center gap-1.5 text-blue-200 hover:text-white text-sm"
                >
                  <FiUser className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="text-blue-200 hover:text-red-300 transition-colors">
                  <FiLogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"    className="text-blue-200 hover:text-white text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
