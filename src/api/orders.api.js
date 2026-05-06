import api from './axios'
export const placeProductOrder = (data) => api.post('/orders/product', data)
export const requestService    = (data) => api.post('/orders/service', data)
export const getMyOrders       = () => api.get('/orders/my')
export const cancelOrder       = (id) => api.patch(`/orders/${id}/cancel`)
export const getAllOrders       = (params) => api.get('/orders', { params })
export const getOrder          = (id) => api.get(`/orders/${id}`)
