import api from './axios'
export const registerCustomer = (data) => api.post('/auth/customer/register', data)
export const loginCustomer    = (data) => api.post('/auth/customer/login', data)
export const loginAdmin       = (data) => api.post('/auth/admin/login', data)
