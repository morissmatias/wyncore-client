import { useFetch } from '../../hooks/useFetch'
import { getServices } from '../../api/services.api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import PageLoader from '../../components/ui/PageLoader'

export default function ServicesPage() {
  const { data: services, loading } = useFetch(getServices)
  const { isCustomer } = useAuth()
  const navigate = useNavigate()

  if (loading) return <PageLoader />
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-brand-blue mb-8">Electrical Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services?.map(s => (
          <div key={s.id} className="card hover:shadow-md transition-shadow">
            <span className="text-xs font-medium bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{s.type}</span>
            <h3 className="font-semibold text-brand-blue mt-2 mb-1">{s.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{s.description}</p>
            <button
              onClick={() => isCustomer ? navigate('/request-service', { state: { service: s } }) : navigate('/login')}
              className="btn-outline text-sm"
            >Request Service</button>
          </div>
        ))}
      </div>
    </div>
  )
}
