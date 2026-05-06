export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-PH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export const statusBadgeClass = (status) => {
  const map = {
    PENDING:   'badge-pending',
    APPROVED:  'badge-approved',
    REJECTED:  'badge-rejected',
    CANCELLED: 'badge-cancelled',
    DELIVERED: 'badge-delivered',
  }
  return map[status] || 'badge-pending'
}
