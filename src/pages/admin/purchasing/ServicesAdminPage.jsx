import { useState } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { getServicesAdmin, createService, updateService, deleteService } from '../../../api/services.api'
import Modal from '../../../components/ui/Modal'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import PageLoader from '../../../components/ui/PageLoader'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'

const TYPES = ['LAYOUT_DESIGN','INSTALLATION','CONSTRUCTION','TRANSMISSION_DISTRIBUTION','SUBSTATION','SOLAR_PV_UTILITY','SOLAR_ROOFTOP','OTHER']
const EMPTY = { name:'', description:'', type:'INSTALLATION', basePrice:'' }

export default function ServicesAdminPage() {
  const { data: services, loading, refetch } = useFetch(getServicesAdmin)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId]   = useState(null)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [saving, setSaving]       = useState(false)
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (s) => { setEditing(s); setForm({ ...s, basePrice: s.basePrice ? String(s.basePrice) : '' }); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const payload = { ...form, basePrice: form.basePrice ? Number(form.basePrice) : null }
      if (editing) await updateService(editing.id, payload)
      else await createService(payload)
      toast.success(editing ? 'Service updated.' : 'Service created.')
      setModalOpen(false); refetch()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed.') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await deleteService(deleteId); toast.success('Service deleted.'); setDeleteId(null); refetch() }
    catch { toast.error('Delete failed.') }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-blue">Services</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><FiPlus className="w-4 h-4" /> Add Service</button>
      </div>
      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{['Name','Type','Base Price','Status',''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y">
            {services?.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-brand-blue">{s.name}</td>
                <td className="px-4 py-3 text-xs"><span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{s.type}</span></td>
                <td className="px-4 py-3">{s.basePrice ? `₱${Number(s.basePrice).toLocaleString()}` : 'Quoted'}</td>
                <td className="px-4 py-3"><span className={s.isAvailable ? 'text-green-600 text-xs font-medium' : 'text-red-500 text-xs font-medium'}>{s.isAvailable ? 'Available' : 'Unavailable'}</span></td>
                <td className="px-4 py-3"><div className="flex gap-2">
                  <button onClick={() => openEdit(s)} className="text-brand-blue hover:text-brand-blueLight"><FiEdit2 className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(s.id)} className="text-red-400 hover:text-red-600"><FiTrash2 className="w-4 h-4" /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Service' : 'Add Service'}>
        <form onSubmit={handleSave} className="space-y-3">
          <div><label className="label">Name</label><input className="input" required value={form.name} onChange={set('name')} /></div>
          <div><label className="label">Description</label><textarea className="input" rows={3} value={form.description} onChange={set('description')} /></div>
          <div><label className="label">Type</label>
            <select className="input" value={form.type} onChange={set('type')}>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
          </div>
          <div><label className="label">Base Price (PHP) — leave blank if quoted per project</label>
            <input className="input" type="number" min="0" value={form.basePrice} onChange={set('basePrice')} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Service" message="Delete this service? This cannot be undone." confirmLabel="Delete" danger />
    </div>
  )
}
