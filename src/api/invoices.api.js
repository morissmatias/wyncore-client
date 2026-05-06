import api from './axios'
export const getAllInvoices = (params) => api.get('/invoices', { params })
export const getInvoice    = (id) => api.get(`/invoices/${id}`)
export const reviewInvoice = (id, data) => api.patch(`/invoices/${id}/review`, data)
