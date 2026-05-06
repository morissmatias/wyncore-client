import { useFetch } from '../../hooks/useFetch'
import { getDashboard } from '../../api/admins.api'
import { useAuth } from '../../context/AuthContext'
import { FiUsers, FiShoppingBag, FiClock, FiPackage, FiSettings } from 'react-icons/fi'
import PageLoader from '../../components/ui/PageLoader'

export default function AdminDashboard() {
  const { user } = useAuth()
  const { data: stats, loading } = useFetch(getDashboard)

  if (loading) return <PageLoader />

  const cards = [
    { label: 'Total Customers', value: stats?.totalCustomers, icon: FiUsers, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Orders',    value: stats?.totalOrders,    icon: FiShoppingBag, color: 'bg-green-50 text-green-600' },
    { label: 'Pending Orders',  value: stats?.pendingOrders,  icon: FiClock,  color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Products',        value: stats?.totalProducts,  icon: FiPackage, color: 'bg-purple-50 text-purple-600' },
    { label: 'Services',        value: stats?.totalServices,  icon: FiSettings, color: 'bg-teal-50 text-teal-600' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-blue">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back, {user?.name} · {user?.role?.replace('_', ' ')}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card text-center">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-brand-blue">{value ?? '—'}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
