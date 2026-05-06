import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { registerCustomer } from '../../api/auth.api'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { loginAsCustomer } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', companyOrigin: '', password: '' })
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await registerCustomer(form)
      loginAsCustomer(res.data.data.customer, res.data.data.token)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-display font-bold text-brand-blue mb-6">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[['name','Full Name','text'],['email','Email','email'],['phone','Phone Number','text'],['companyOrigin','Company Name','text'],['password','Password','password']].map(([k,l,t]) => (
            <div key={k}>
              <label className="label">{l}</label>
              <input className="input" type={t} required value={form[k]} onChange={set(k)} />
            </div>
          ))}
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-500">
          Already have an account? <Link to="/login" className="text-brand-green font-medium">Login</Link>
        </p>
      </div>
    </div>
  )
}
