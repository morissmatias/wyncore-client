import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageLoader from '../components/ui/PageLoader'

// Public pages
import LandingPage    from '../pages/public/LandingPage'
import CatalogPage    from '../pages/public/CatalogPage'
import ServicesPage   from '../pages/public/ServicesPage'
import ProductDetailPage from '../pages/public/ProductDetailPage'

// Auth pages
import LoginPage      from '../pages/auth/LoginPage'
import RegisterPage   from '../pages/auth/RegisterPage'
import AdminLoginPage from '../pages/auth/AdminLoginPage'

// Customer pages
import CustomerDashboard from '../pages/customer/CustomerDashboard'
import CartPage          from '../pages/customer/CartPage'
import CheckoutPage      from '../pages/customer/CheckoutPage'
import MyOrdersPage      from '../pages/customer/MyOrdersPage'
import ServiceRequestPage from '../pages/customer/ServiceRequestPage'
import ProfilePage       from '../pages/customer/ProfilePage'

// Admin pages
import AdminDashboard    from '../pages/admin/AdminDashboard'
import OrdersPage        from '../pages/admin/OrdersPage'
import InvoicesPage      from '../pages/admin/InvoicesPage'
import InvoiceDetailPage from '../pages/admin/InvoiceDetailPage'
import CustomersPage     from '../pages/admin/CustomersPage'
import ProductsAdminPage from '../pages/admin/purchasing/ProductsAdminPage'
import ServicesAdminPage from '../pages/admin/purchasing/ServicesAdminPage'
import SuppliersPage     from '../pages/admin/purchasing/SuppliersPage'
import AdminAccountsPage from '../pages/admin/ceo/AdminAccountsPage'
import ActivityLogsPage  from '../pages/admin/ceo/ActivityLogsPage'

// Layouts
import PublicLayout from '../components/layout/PublicLayout'
import AdminLayout  from '../components/layout/AdminLayout'

const ProtectedCustomer = ({ children }) => {
  const { user, isCustomer, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user || !isCustomer) return <Navigate to="/login" replace />
  return children
}

const ProtectedAdmin = ({ children, roles }) => {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/admin" replace />
  return <AdminLayout>{children}</AdminLayout>
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
      <Route path="/catalog" element={<PublicLayout><CatalogPage /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
      <Route path="/catalog/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />

      {/* Auth */}
      <Route path="/login"       element={<LoginPage />} />
      <Route path="/register"    element={<RegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Customer */}
      <Route path="/dashboard"       element={<ProtectedCustomer><PublicLayout><CustomerDashboard /></PublicLayout></ProtectedCustomer>} />
      <Route path="/cart"            element={<ProtectedCustomer><PublicLayout><CartPage /></PublicLayout></ProtectedCustomer>} />
      <Route path="/checkout"        element={<ProtectedCustomer><PublicLayout><CheckoutPage /></PublicLayout></ProtectedCustomer>} />
      <Route path="/my-orders"       element={<ProtectedCustomer><PublicLayout><MyOrdersPage /></PublicLayout></ProtectedCustomer>} />
      <Route path="/request-service" element={<ProtectedCustomer><PublicLayout><ServiceRequestPage /></PublicLayout></ProtectedCustomer>} />
      <Route path="/profile"         element={<ProtectedCustomer><PublicLayout><ProfilePage /></PublicLayout></ProtectedCustomer>} />

      {/* Admin - shared (CEO + CS) */}
      <Route path="/admin"           element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
      <Route path="/admin/orders"    element={<ProtectedAdmin roles={['CEO_CFO','CUSTOMER_SERVICE']}><OrdersPage /></ProtectedAdmin>} />
      <Route path="/admin/invoices"  element={<ProtectedAdmin roles={['CEO_CFO','CUSTOMER_SERVICE']}><InvoicesPage /></ProtectedAdmin>} />
      <Route path="/admin/invoices/:id" element={<ProtectedAdmin roles={['CEO_CFO','CUSTOMER_SERVICE']}><InvoiceDetailPage /></ProtectedAdmin>} />
      <Route path="/admin/customers" element={<ProtectedAdmin roles={['CEO_CFO','CUSTOMER_SERVICE']}><CustomersPage /></ProtectedAdmin>} />

      {/* Admin - Purchasing */}
      <Route path="/admin/products"      element={<ProtectedAdmin roles={['CEO_CFO','PURCHASING']}><ProductsAdminPage /></ProtectedAdmin>} />
      <Route path="/admin/services-mgmt" element={<ProtectedAdmin roles={['CEO_CFO','PURCHASING']}><ServicesAdminPage /></ProtectedAdmin>} />
      <Route path="/admin/suppliers"     element={<ProtectedAdmin roles={['CEO_CFO','PURCHASING']}><SuppliersPage /></ProtectedAdmin>} />

      {/* Admin - CEO/CFO only */}
      <Route path="/admin/accounts" element={<ProtectedAdmin roles={['CEO_CFO']}><AdminAccountsPage /></ProtectedAdmin>} />
      <Route path="/admin/logs"     element={<ProtectedAdmin roles={['CEO_CFO']}><ActivityLogsPage /></ProtectedAdmin>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
