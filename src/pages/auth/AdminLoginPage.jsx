import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { loginAdmin } from '../../api/auth.api'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const { loginAsAdmin } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await loginAdmin(form)
      loginAsAdmin(res.data.data.admin, res.data.data.token)
      toast.success('Welcome, ' + res.data.data.admin.name)
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-blue px-4">
      <div className="card w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">W</span>
          </div>
          <span className="font-display font-bold text-brand-blue text-lg">WynCore Admin</span>
        </div>
        <h1 className="text-xl font-display font-bold text-brand-blue mb-5">Administrator Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" required value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" required value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} />
          </div>
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
      </div>
    </div>
  )
}
