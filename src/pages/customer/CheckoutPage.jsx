import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { placeProductOrder } from '../../api/orders.api'
import { formatCurrency } from '../../utils/format'
import toast from 'react-hot-toast'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(null)

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      setPosition([lat, lng])
      // Reverse geocode using OpenStreetMap Nominatim
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        .then(res => res.json())
        .then(data => {
          onLocationSelect(data.display_name, lat, lng)
        })
        .catch(() => {
          onLocationSelect(`${lat.toFixed(6)}, ${lng.toFixed(6)}`, lat, lng)
        })
    },
  })

  return position ? <Marker position={position} /> : null
}

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart()
  const navigate = useNavigate()
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  // Lipa City, Batangas as default center
  const defaultCenter = [13.9411, 121.1631]

  const handleLocationSelect = (address, lat, lng) => {
    setDeliveryAddress(address)
  }

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

      {/* Order Summary */}
      <div className="card mb-6">
        <h2 className="font-semibold mb-3">Order Summary ({items.length} item{items.length !== 1 ? 's' : ''})</h2>
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex justify-between text-sm py-1">
            <span>{product.name} × {quantity}</span>
            <span>{formatCurrency(Number(product.price) * quantity)}</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-brand-green">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        {/* Map */}
        <div>
          <label className="label">Pin your delivery location *</label>
          <p className="text-xs text-gray-400 mb-2">Click anywhere on the map to set your delivery address.</p>
          <div className="rounded-lg overflow-hidden border border-gray-200" style={{ height: '300px' }}>
            <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker onLocationSelect={handleLocationSelect} />
            </MapContainer>
          </div>
        </div>

        {/* Address field - auto-filled by map, editable */}
        <div>
          <label className="label">Delivery Address *</label>
          <textarea
            className="input"
            rows={3}
            required
            value={deliveryAddress}
            onChange={e => setDeliveryAddress(e.target.value)}
            placeholder="Click the map to auto-fill, or type manually"
          />
        </div>

        <div>
          <label className="label">Notes (optional)</label>
          <textarea
            className="input"
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any special instructions"
          />
        </div>

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}