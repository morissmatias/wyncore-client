import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { requestService } from '../../api/orders.api'
import { useFetch } from '../../hooks/useFetch'
import { getServices } from '../../api/services.api'
import toast from 'react-hot-toast'

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
          <label className="label">Site Address *</label>
          <textarea className="input" rows={2} required value={form.deliveryAddress} onChange={set('deliveryAddress')} />
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
