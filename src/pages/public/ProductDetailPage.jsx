import { useParams, useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import { getProduct } from '../../api/products.api'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency } from '../../utils/format'
import PageLoader from '../../components/ui/PageLoader'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: product, loading } = useFetch(() => getProduct(id), [id])
  const { addToCart } = useCart()
  const { isCustomer } = useAuth()

  const handleAdd = () => {
    if (!isCustomer) { navigate('/login'); return }
    addToCart(product)
    toast.success(product.name + ' added to cart!')
  }

  if (loading) return <PageLoader />
  if (!product) return <div className="text-center py-20 text-gray-400">Product not found.</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button onClick={() => navigate('/catalog')} className="text-sm text-brand-blue hover:underline mb-6 block">← Back to Catalog</button>
      <div className="card flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 h-56 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" />
            : <span className="text-sm">{product.category}</span>
          }
        </div>
        <div className="flex-1">
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{product.category}</span>
          <h1 className="font-display text-2xl font-bold text-brand-blue mt-2 mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.description || 'No description available.'}</p>
          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between"><span className="text-gray-400">Unit</span><span>{product.unit}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Stock</span><span>{product.stock} available</span></div>
            {product.supplier && <div className="flex justify-between"><span className="text-gray-400">Supplier</span><span>{product.supplier.name}</span></div>}
            <div className="flex justify-between border-t pt-2"><span className="font-semibold">Price</span><span className="text-xl font-bold text-brand-green">{formatCurrency(product.price)}</span></div>
          </div>
          <button onClick={handleAdd} className="btn-primary w-full">Add to Cart</button>
        </div>
      </div>
    </div>
  )
}