import { useState } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { getProductsAdmin, createProduct, updateProduct, deleteProduct } from '../../../api/products.api'
import { getAllSuppliers } from '../../../api/suppliers.api'
import { formatCurrency } from '../../../utils/format'
import { uploadProductImage } from '../../../api/supabase'
import Modal from '../../../components/ui/Modal'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import PageLoader from '../../../components/ui/PageLoader'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiUpload } from 'react-icons/fi'

const CATEGORIES = ['TRANSFORMER','STREET_LIGHTING','CONTROL_PANEL','OTHER']
const EMPTY = { name:'', description:'', category:'TRANSFORMER', price:'', unit:'unit', stock:'', imageUrl:'', supplierId:'' }

export default function ProductsAdminPage() {
  const { data: products, loading, refetch } = useFetch(getProductsAdmin)
  const { data: suppliers } = useFetch(getAllSuppliers)
  const [modalOpen, setModalOpen]   = useState(false)
  const [deleteId, setDeleteId]     = useState(null)
  const [editing, setEditing]       = useState(null)
  const [form, setForm]             = useState(EMPTY)
  const [saving, setSaving]         = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [preview, setPreview]       = useState(null)
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setPreview(null); setModalOpen(true) }
  const openEdit = (p) => {
    setEditing(p)
    setForm({ ...p, price: String(p.price), stock: String(p.stock), supplierId: p.supplierId || '' })
    setPreview(p.imageUrl || null)
    setModalOpen(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      setUploading(true)
      const url = await uploadProductImage(file)
      setForm(p => ({ ...p, imageUrl: url }))
      setPreview(url)
      toast.success('Image uploaded.')
    } catch (err) {
      toast.error('Image upload failed.')
    } finally { setUploading(false) }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), supplierId: form.supplierId || null }
      if (editing) await updateProduct(editing.id, payload)
      else await createProduct(payload)
      toast.success(editing ? 'Product updated.' : 'Product created.')
      setModalOpen(false)
      refetch()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed.') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteId)
      toast.success('Product deleted.')
      setDeleteId(null)
      refetch()
    } catch { toast.error('Delete failed.') }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-blue">Products</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><FiPlus className="w-4 h-4" /> Add Product</button>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{['Image','Name','Category','Price','Stock','Supplier','Status',''].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y">
            {products?.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {p.imageUrl
                    ? <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">No img</div>
                  }
                </td>
                <td className="px-4 py-3 font-medium text-brand-blue">{p.name}</td>
                <td className="px-4 py-3 text-xs"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{p.category}</span></td>
                <td className="px-4 py-3 font-semibold text-brand-green">{formatCurrency(p.price)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3 text-gray-500">{p.supplier?.name || '—'}</td>
                <td className="px-4 py-3">
                  <span className={p.isAvailable ? 'text-green-600 text-xs font-medium' : 'text-red-500 text-xs font-medium'}>
                    {p.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="text-brand-blue hover:text-brand-blueLight"><FiEdit2 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(p.id)} className="text-red-400 hover:text-red-600"><FiTrash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleSave} className="space-y-3">
          {/* Image Upload */}
          <div>
            <label className="label">Product Image</label>
            <div className="flex items-center gap-4">
              {preview
                ? <img src={preview} alt="preview" className="w-16 h-16 rounded-lg object-cover border" />
                : <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">No img</div>
              }
              <label className="btn-outline text-sm cursor-pointer flex items-center gap-2">
                <FiUpload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          {[['name','Product Name'],['description','Description'],['unit','Unit (e.g. unit, set, meter)']].map(([k,l]) => (
            <div key={k}><label className="label">{l}</label><input className="input" value={form[k]} onChange={set(k)} /></div>
          ))}
          <div><label className="label">Category</label>
            <select className="input" value={form.category} onChange={set('category')}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Price (PHP)</label><input className="input" type="number" min="0" required value={form.price} onChange={set('price')} /></div>
            <div><label className="label">Stock</label><input className="input" type="number" min="0" required value={form.stock} onChange={set('stock')} /></div>
          </div>
          <div><label className="label">Supplier</label>
            <select className="input" value={form.supplierId} onChange={set('supplierId')}>
              <option value="">No supplier</option>
              {suppliers?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={saving || uploading} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Product" message="Are you sure you want to delete this product? This cannot be undone."
        confirmLabel="Delete" danger />
    </div>
  )
}