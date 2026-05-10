import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useFetch } from '../../hooks/useFetch'
import { getMyOrders } from '../../api/orders.api'
import { FiShoppingBag, FiPackage, FiSettings, FiUser } from 'react-icons/fi'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const { data: orders } = useFetch(getMyOrders)
  const pending = orders?.filter(o => o.status === 'PENDING').length || 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-brand-blue mb-1">Welcome, {user?.name}</h1>
      <p className="text-gray-500 mb-8">{user?.companyOrigin}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: orders?.length || 0, icon: FiShoppingBag },
          { label: 'Pending', value: pending, icon: FiPackage },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="card text-center">
            <Icon className="w-6 h-6 text-brand-green mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-blue">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { to: '/catalog', icon: FiPackage, label: 'Browse Products', desc: 'Shop transformers, lighting, and panels' },
          { to: '/request-service', icon: FiSettings, label: 'Request Service', desc: 'Submit a service request' },
          { to: '/my-orders', icon: FiShoppingBag, label: 'My Orders', desc: 'Track your orders and requests' },
          { to: '/profile', icon: FiUser, label: 'My Profile', desc: 'Update your account details' },
        ].map(({ to, icon: Icon, label, desc }) => (
          <Link key={to} to={to} className="card hover:shadow-md transition-shadow text-center">
            <Icon className="w-8 h-8 text-brand-green mx-auto mb-2" />
            <p className="font-semibold text-brand-blue">{label}</p>
            <p className="text-xs text-gray-500 mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
