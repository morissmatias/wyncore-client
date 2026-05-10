import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthRoute = err.config?.url?.includes('/auth/')
    if (err.response?.status === 401 && !isAuthRoute) {
      const userType = localStorage.getItem('userType')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('userType')
      window.location.href = userType === 'admin' ? '/admin/login' : '/login'
    }
    return Promise.reject(err)
  }
)

export default api