import { useState } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { getAllSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../../../api/suppliers.api'
import Modal from '../../../components/ui/Modal'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import PageLoader from '../../../components/ui/PageLoader'
import EmptyState from '../../../components/ui/EmptyState'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiTruck } from 'react-icons/fi'

const EMPTY = { name:'', contact:'', email:'', address:'' }

export default function SuppliersPage() {
  const { data: suppliers, loading, refetch } = useFetch(getAllSuppliers)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId]   = useState(null)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [saving, setSaving]       = useState(false)
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (s) => { setEditing(s); setForm({ name: s.name, contact: s.contact||'', email: s.email||'', address: s.address||'' }); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      if (editing) await updateSupplier(editing.id, form)
      else await createSupplier(form)
      toast.success(editing ? 'Supplier updated.' : 'Supplier created.')
      setModalOpen(false); refetch()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed.') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await deleteSupplier(deleteId); toast.success('Supplier deleted.'); setDeleteId(null); refetch() }
    catch { toast.error('Delete failed.') }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-blue">Suppliers</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><FiPlus className="w-4 h-4" /> Add Supplier</button>
      </div>

      {!suppliers?.length
        ? <EmptyState icon={<FiTruck />} title="No suppliers yet" action={<button onClick={openAdd} className="btn-primary">Add Supplier</button>} />
        : <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['Name','Contact','Email','Address','Products',''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {suppliers.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-brand-blue">{s.name}</td>
                    <td className="px-4 py-3 text-gray-500">{s.contact || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{s.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{s.address || '—'}</td>
                    <td className="px-4 py-3 text-center">{s._count?.products ?? 0}</td>
                    <td className="px-4 py-3"><div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="text-brand-blue hover:text-brand-blueLight"><FiEdit2 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteId(s.id)} className="text-red-400 hover:text-red-600"><FiTrash2 className="w-4 h-4" /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Supplier' : 'Add Supplier'}>
        <form onSubmit={handleSave} className="space-y-3">
          {[['name','Supplier Name',true],['contact','Contact Person',false],['email','Email',false],['address','Address',false]].map(([k,l,req]) => (
            <div key={k}><label className="label">{l}</label><input className="input" required={req} value={form[k]} onChange={set(k)} /></div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Supplier" message="Delete this supplier? Products linked to them will be unlinked." confirmLabel="Delete" danger />
    </div>
  )
}
