import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { placeProductOrder } from '../../api/orders.api'
import { formatCurrency } from '../../utils/format'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart()
  const navigate = useNavigate()
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await placeProductOrder({
        deliveryAddress,
        notes,
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      })
      clearCart()
      toast.success('Order placed! Invoice has been generated.')
      navigate('/my-orders')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order.')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-brand-blue mb-6">Checkout</h1>
      <div className="card mb-6">
        <h2 className="font-semibold mb-3">Order Summary ({items.length} item{items.length !== 1 ? 's' : ''})</h2>
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex justify-between text-sm py-1">
            <span>{product.name} × {quantity}</span>
            <span>{formatCurrency(Number(product.price) * quantity)}</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 flex justify-between font-bold">
          <span>Total</span><span className="text-brand-green">{formatCurrency(totalAmount)}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label">Delivery Address *</label>
          <textarea className="input" rows={3} required value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} placeholder="Complete delivery address" />
        </div>
        <div>
          <label className="label">Notes (optional)</label>
          <textarea className="input" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special instructions" />
        </div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Submitting...' : 'Place Order'}</button>
      </form>
    </div>
  )
}
