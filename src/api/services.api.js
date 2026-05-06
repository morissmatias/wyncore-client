import api from './axios'
export const getServices      = () => api.get('/services')
export const getServicesAdmin = () => api.get('/services/admin/all')
export const getService       = (id) => api.get(`/services/${id}`)
export const createService    = (data) => api.post('/services', data)
export const updateService    = (id, data) => api.patch(`/services/${id}`, data)
export const deleteService    = (id) => api.delete(`/services/${id}`)
