import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { updateMyProfile } from '../../api/customers.api'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, loginAsCustomer } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', companyOrigin: user?.companyOrigin || '' })
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await updateMyProfile(form)
      const token = localStorage.getItem('token')
      loginAsCustomer(res.data.data, token)
      toast.success('Profile updated.')
    } catch { toast.error('Update failed.') } finally { setLoading(false) }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-brand-blue mb-6">My Profile</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        {[['name','Full Name'],['phone','Phone Number'],['companyOrigin','Company Name']].map(([k,l]) => (
          <div key={k}>
            <label className="label">{l}</label>
            <input className="input" value={form[k]} onChange={set(k)} />
          </div>
        ))}
        <div>
          <label className="label">Email</label>
          <input className="input bg-gray-50" value={user?.email} disabled />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
        </div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  )
}
