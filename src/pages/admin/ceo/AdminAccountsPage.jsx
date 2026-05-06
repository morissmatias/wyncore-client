import { useState } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { getAllAdmins, createAdmin, deleteAdmin } from '../../../api/admins.api'
import { formatDateTime } from '../../../utils/format'
import Modal from '../../../components/ui/Modal'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import PageLoader from '../../../components/ui/PageLoader'
import toast from 'react-hot-toast'
import { useAuth } from '../../../context/AuthContext'
import { FiPlus, FiTrash2, FiShield } from 'react-icons/fi'

const ROLES = ['CEO_CFO','CUSTOMER_SERVICE','PURCHASING']
const EMPTY = { name:'', email:'', password:'', role:'CUSTOMER_SERVICE' }

export default function AdminAccountsPage() {
  const { user } = useAuth()
  const { data: admins, loading, refetch } = useFetch(getAllAdmins)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId]   = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [saving, setSaving]       = useState(false)
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      await createAdmin(form)
      toast.success('Admin account created.')
      setModalOpen(false); setForm(EMPTY); refetch()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create admin.') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await deleteAdmin(deleteId); toast.success('Admin deleted.'); setDeleteId(null); refetch() }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed.') }
  }

  const roleColor = { CEO_CFO: 'bg-purple-100 text-purple-700', CUSTOMER_SERVICE: 'bg-blue-100 text-blue-700', PURCHASING: 'bg-teal-100 text-teal-700' }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-blue">Admin Accounts</h1>
          <p className="text-sm text-gray-500 mt-1">Only CEO/CFO administrators can create or remove admin accounts.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2"><FiPlus className="w-4 h-4" /> Add Admin</button>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{['Name','Email','Role','Created',''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y">
            {admins?.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FiShield className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-brand-blue">{a.name}</span>
                    {a.id === user.id && <span className="text-xs text-gray-400">(you)</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{a.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleColor[a.role]}`}>{a.role.replace('_',' ')}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">{formatDateTime(a.createdAt)}</td>
                <td className="px-4 py-3">
                  {a.id !== user.id && (
                    <button onClick={() => setDeleteId(a.id)} className="text-red-400 hover:text-red-600">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Admin Account">
        <form onSubmit={handleCreate} className="space-y-3">
          {[['name','Full Name'],['email','Email'],['password','Password']].map(([k,l]) => (
            <div key={k}><label className="label">{l}</label>
              <input className="input" type={k==='password'?'password':k==='email'?'email':'text'} required value={form[k]} onChange={set(k)} />
            </div>
          ))}
          <div><label className="label">Role</label>
            <select className="input" value={form.role} onChange={set('role')}>
              {ROLES.map(r => <option key={r} value={r}>{r.replace('_',' ')}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Creating...' : 'Create Admin'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Admin Account" message="This admin will lose all system access immediately. Continue?" confirmLabel="Delete" danger />
    </div>
  )
}
