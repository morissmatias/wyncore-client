import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  FiHome, FiShoppingBag, FiFileText, FiUsers,
  FiPackage, FiTruck, FiSettings, FiActivity
} from 'react-icons/fi'

const navItems = {
  CEO_CFO: [
    { to: '/admin',          icon: FiHome,      label: 'Dashboard' },
    { to: '/admin/orders',   icon: FiShoppingBag, label: 'Orders' },
    { to: '/admin/invoices', icon: FiFileText,  label: 'Invoices' },
    { to: '/admin/customers',icon: FiUsers,     label: 'Customers' },
    { to: '/admin/products', icon: FiPackage,   label: 'Products' },
    { to: '/admin/services-mgmt', icon: FiSettings, label: 'Services' },
    { to: '/admin/suppliers',icon: FiTruck,     label: 'Suppliers' },
    { to: '/admin/accounts', icon: FiUsers,     label: 'Admin Accounts' },
    { to: '/admin/logs',     icon: FiActivity,  label: 'Activity Logs' },
  ],
  CUSTOMER_SERVICE: [
    { to: '/admin',          icon: FiHome,      label: 'Dashboard' },
    { to: '/admin/orders',   icon: FiShoppingBag, label: 'Orders' },
    { to: '/admin/invoices', icon: FiFileText,  label: 'Invoices' },
    { to: '/admin/customers',icon: FiUsers,     label: 'Customers' },
  ],
  PURCHASING: [
    { to: '/admin',              icon: FiHome,    label: 'Dashboard' },
    { to: '/admin/products',     icon: FiPackage, label: 'Products' },
    { to: '/admin/services-mgmt',icon: FiSettings,label: 'Services' },
    { to: '/admin/suppliers',    icon: FiTruck,   label: 'Suppliers' },
  ],
}

export default function AdminSidebar() {
  const { user } = useAuth()
  const items = navItems[user?.role] || []

  return (
    <aside className="w-60 bg-brand-blue min-h-screen flex flex-col">
      <div className="p-5 border-b border-blue-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">W</span>
          </div>
          <span className="text-white font-display font-bold">WynCore</span>
        </div>
        <div className="mt-3">
          <p className="text-white text-sm font-medium">{user?.name}</p>
          <p className="text-blue-300 text-xs">{user?.role?.replace('_', ' ')}</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-brand-green text-white font-medium'
                  : 'text-blue-200 hover:bg-blue-700 hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
