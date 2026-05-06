import api from './axios'
export const getDashboard    = () => api.get('/admins/dashboard')
export const getActivityLogs = () => api.get('/admins/logs')
export const getAllAdmins     = () => api.get('/admins')
export const createAdmin     = (data) => api.post('/admins', data)
export const deleteAdmin     = (id) => api.delete(`/admins/${id}`)
