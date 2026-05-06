import api from './axios'
export const getProducts      = (params) => api.get('/products', { params })
export const getProductsAdmin = () => api.get('/products/admin/all')
export const getProduct       = (id) => api.get(`/products/${id}`)
export const createProduct    = (data) => api.post('/products', data)
export const updateProduct    = (id, data) => api.patch(`/products/${id}`, data)
export const deleteProduct    = (id) => api.delete(`/products/${id}`)
