import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { loginCustomer } from '../../api/auth.api'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { loginAsCustomer } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await loginCustomer(form)
      loginAsCustomer(res.data.data.customer, res.data.data.token)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-display font-bold text-brand-blue mb-6">Customer Login</h1>
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
        <p className="text-sm text-center mt-4 text-gray-500">
          No account? <Link to="/register" className="text-brand-green font-medium">Register here</Link>
        </p>
        <p className="text-sm text-center mt-2 text-gray-400">
          <Link to="/admin/login" className="hover:text-brand-blue">Admin Login →</Link>
        </p>
      </div>
    </div>
  )
}
