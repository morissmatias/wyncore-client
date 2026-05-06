import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]         = useState(null)
  const [userType, setUserType] = useState(null) // 'customer' | 'admin'
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const storedUser     = localStorage.getItem('user')
    const storedUserType = localStorage.getItem('userType')
    if (storedUser && storedUserType) {
      setUser(JSON.parse(storedUser))
      setUserType(storedUserType)
    }
    setLoading(false)
  }, [])

  const loginAsCustomer = (customer, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(customer))
    localStorage.setItem('userType', 'customer')
    setUser(customer)
    setUserType('customer')
  }

  const loginAsAdmin = (admin, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(admin))
    localStorage.setItem('userType', 'admin')
    setUser(admin)
    setUserType('admin')
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    setUser(null)
    setUserType(null)
  }

  const isAdmin     = userType === 'admin'
  const isCustomer  = userType === 'customer'
  const isCEO       = isAdmin && user?.role === 'CEO_CFO'
  const isCS        = isAdmin && user?.role === 'CUSTOMER_SERVICE'
  const isPurchasing= isAdmin && user?.role === 'PURCHASING'

  return (
    <AuthContext.Provider value={{ user, userType, loading, loginAsCustomer, loginAsAdmin, logout, isAdmin, isCustomer, isCEO, isCS, isPurchasing }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
