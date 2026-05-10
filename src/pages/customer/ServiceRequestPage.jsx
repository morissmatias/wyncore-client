import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { requestService } from '../../api/orders.api'
import { useFetch } from '../../hooks/useFetch'
import { getServices } from '../../api/services.api'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import toast from 'react-hot-toast'

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
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        .then(res => res.json())
        .then(data => onLocationSelect(data.display_name, lat, lng))
        .catch(() => onLocationSelect(`${lat.toFixed(6)}, ${lng.toFixed(6)}`, lat, lng))
    },
  })

  return position ? <Marker position={position} /> : null
}

export default function ServiceRequestPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: services } = useFetch(getServices)
  const [form, setForm] = useState({
    serviceId: location.state?.service?.id || '',
    details: '', deliveryAddress: '', preferredDate: '',
  })
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const defaultCenter = [13.9411, 121.1631]

  const handleLocationSelect = (address) => {
    setForm(p => ({ ...p, deliveryAddress: address }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await requestService(form)
      toast.success('Service request submitted!')
      navigate('/my-orders')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request.')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-brand-blue mb-6">Request a Service</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label">Service *</label>
          <select className="input" required value={form.serviceId} onChange={set('serviceId')}>
            <option value="">Select a service</option>
            {services?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Project Details *</label>
          <textarea className="input" rows={4} required value={form.details} onChange={set('details')} placeholder="Describe your project requirements in detail" />
        </div>
        <div>
          <label className="label">Pin your site location *</label>
          <p className="text-xs text-gray-400 mb-2">Click anywhere on the map to set your site address.</p>
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
        <div>
          <label className="label">Site Address *</label>
          <textarea className="input" rows={2} required value={form.deliveryAddress} onChange={set('deliveryAddress')} placeholder="Click the map to auto-fill, or type manually" />
        </div>
        <div>
          <label className="label">Preferred Date (optional)</label>
          <input className="input" type="date" value={form.preferredDate} onChange={set('preferredDate')} />
        </div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Submitting...' : 'Submit Request'}</button>
      </form>
    </div>
  )
}