import { useCart } from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../utils/format'
import EmptyState from '../../components/ui/EmptyState'
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalAmount } = useCart()
  const navigate = useNavigate()

  if (!items.length) return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <EmptyState icon={<FiShoppingCart />} title="Your cart is empty" description="Browse our product catalog to add items."
        action={<button onClick={() => navigate('/catalog')} className="btn-primary">Browse Products</button>} />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-brand-blue mb-6">Your Cart</h1>
      <div className="card mb-6 divide-y divide-gray-100">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center gap-4 py-4">
            <div className="flex-1">
              <p className="font-medium text-brand-blue">{product.name}</p>
              <p className="text-sm text-gray-500">{formatCurrency(product.price)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(product.id, quantity - 1)} className="w-7 h-7 rounded border flex items-center justify-center hover:bg-gray-50"><FiMinus className="w-3 h-3" /></button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button onClick={() => updateQuantity(product.id, quantity + 1)} className="w-7 h-7 rounded border flex items-center justify-center hover:bg-gray-50"><FiPlus className="w-3 h-3" /></button>
            </div>
            <span className="w-24 text-right font-semibold text-brand-green">{formatCurrency(Number(product.price) * quantity)}</span>
            <button onClick={() => removeFromCart(product.id)} className="text-red-400 hover:text-red-600"><FiTrash2 /></button>
          </div>
        ))}
      </div>
      <div className="card flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold text-brand-blue">{formatCurrency(totalAmount)}</p>
        </div>
        <button onClick={() => navigate('/checkout')} className="btn-primary">Proceed to Checkout</button>
      </div>
    </div>
  )
}
