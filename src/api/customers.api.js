import api from './axios'
export const getMyProfile    = () => api.get('/customers/me')
export const updateMyProfile = (data) => api.patch('/customers/me', data)
export const getAllCustomers  = () => api.get('/customers')
export const getCustomer     = (id) => api.get(`/customers/${id}`)
