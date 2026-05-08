import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import { getProducts } from '../../api/products.api'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency } from '../../utils/format'
import PageLoader from '../../components/ui/PageLoader'
import toast from 'react-hot-toast'

export default function CatalogPage() {
  const { data: products, loading } = useFetch(getProducts)
  const { addToCart } = useCart()
  const { isCustomer } = useAuth()
  const navigate = useNavigate()

  const handleAdd = (product) => {
    if (!isCustomer) { navigate('/login'); return }
    addToCart(product)
    toast.success(product.name + ' added to cart!')
  }

  if (loading) return <PageLoader />
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-brand-blue mb-8">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map(p => (
          <div key={p.id} className="card hover:shadow-md transition-shadow">
            <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 text-sm">{p.category}</div>
            <h3 className="font-semibold text-brand-blue mb-1">{p.name}</h3>
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-brand-green">{formatCurrency(p.price)}</span>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/catalog/${p.id}`)} className="btn-outline text-sm py-1.5">View</button>
                <button onClick={() => handleAdd(p)} className="btn-primary text-sm py-1.5">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}