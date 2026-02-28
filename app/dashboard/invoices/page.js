'use client'

import { useState, useEffect } from 'react'
import { invoiceAPI, purchaseAPI } from '@/app/lib/apiClient'
import { useAuth } from '@/app/context/AuthContext'
import InvoiceModal from '@/app/components/InvoiceModal'
import DeleteConfirmModal from '@/app/components/DeleteConfirmModal'

export default function Invoices() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState([])
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const isAdmin = user?.role === 'admin' || user?.role === 'manager'
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, invoice: null })
  const [isDeleting, setIsDeleting] = useState(false)

  // Load invoices on mount
  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await invoiceAPI.getAll()
      // API returns array directly, not wrapped in {data: []}
      setInvoices(Array.isArray(response) ? response : [])
      
      // If no invoices, fetch purchases to display instead
      if (!Array.isArray(response) || response.length === 0) {
        const purchasesResponse = await purchaseAPI.getAll()
        setPurchases(Array.isArray(purchasesResponse) ? purchasesResponse : [])
      }
    } catch (err) {
      setError(err.message || 'Failed to load invoices')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setSelectedInvoice(null)
    setIsModalOpen(true)
  }

  const openEditModal = (invoice) => {
    setSelectedInvoice(invoice)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedInvoice(null)
  }

  const handleSaveInvoice = async (data) => {
    try {
      console.log('💾 handleSaveInvoice called with data:', data)
      console.log('👤 Current user:', user)
      
      // Add ownerId from logged-in user
      const invoiceData = {
        ...data,
        ownerId: user?.id,
      }
      
      console.log('📦 Final data to send:', invoiceData)
      
      if (selectedInvoice) {
        // Update invoice
        console.log('🔄 Updating invoice:', selectedInvoice.id)
        await invoiceAPI.update(selectedInvoice.id, invoiceData)
      } else {
        // Create new invoice
        console.log('➕ Creating new invoice')
        await invoiceAPI.create(invoiceData)
      }
      closeModal()
      await fetchInvoices()
    } catch (err) {
      setError(err.message || 'Failed to save invoice')
      console.error('Save error:', err)
    }
  }

  const openDeleteModal = (invoice) => {
    setDeleteModal({ isOpen: true, invoice })
  }

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, invoice: null })
  }

  const handleDeleteInvoice = async () => {
    try {
      setIsDeleting(true)
      await invoiceAPI.delete(deleteModal.invoice.id)
      closeDeleteModal()
      await fetchInvoices()
    } catch (err) {
      setError(err.message || 'Failed to delete invoice')
      console.error('Delete error:', err)
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📄 Invoices</h1>
          {/* <p className="text-gray-600">View your invoices</p> */}
        </div>
        {isAdmin && (
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            + Add Invoice
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div>
          <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
            <p className="text-gray-600">No invoices found</p>
          </div>
          
          {purchases.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🛒 Purchases</h2>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-blue-900 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left">Item</th>
                      <th className="px-6 py-3 text-left">Vendor</th>
                      <th className="px-6 py-3 text-left">Amount</th>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {purchases.map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold">{purchase.name}</td>
                        <td className="px-6 py-4">{purchase.vendor}</td>
                        <td className="px-6 py-4">${Number(purchase.amount).toFixed(2)}</td>
                        <td className="px-6 py-4">{new Date(purchase.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-bold ${
                              purchase.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : purchase.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {purchase.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
                {isAdmin && <th className="px-6 py-3 text-left">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{invoice.title}</td>
                  <td className="px-6 py-4">${Number(invoice.amount).toFixed(2)}</td>
                  <td className="px-6 py-4">{new Date(invoice.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        invoice.status === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openEditModal(invoice)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(invoice)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <InvoiceModal
        isOpen={isModalOpen}
        invoice={selectedInvoice}
        onClose={closeModal}
        onSave={handleSaveInvoice}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        itemName={deleteModal.invoice?.title}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteInvoice}
        isLoading={isDeleting}
      />
    </div>
  )
}
