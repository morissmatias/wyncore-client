import { useFetch } from '../../../hooks/useFetch'
import { getActivityLogs } from '../../../api/admins.api'
import { formatDateTime } from '../../../utils/format'
import PageLoader from '../../../components/ui/PageLoader'
import EmptyState from '../../../components/ui/EmptyState'
import { FiActivity } from 'react-icons/fi'

const actionColor = (action) => {
  if (action.includes('CREATED')) return 'bg-green-100 text-green-700'
  if (action.includes('DELETED')) return 'bg-red-100 text-red-700'
  if (action.includes('APPROVED')) return 'bg-blue-100 text-blue-700'
  if (action.includes('REJECTED')) return 'bg-orange-100 text-orange-700'
  return 'bg-gray-100 text-gray-600'
}

export default function ActivityLogsPage() {
  const { data: logs, loading } = useFetch(getActivityLogs)

  if (loading) return <PageLoader />

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-blue mb-6">Activity Logs</h1>
      {!logs?.length
        ? <EmptyState icon={<FiActivity />} title="No activity recorded yet" />
        : <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['Action','Admin','Details','Date'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${actionColor(log.action)}`}>{log.action}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{log.admin?.name}</p>
                      <p className="text-xs text-gray-400">{log.admin?.role?.replace('_',' ')}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{log.details || '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{formatDateTime(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
    </div>
  )
}
