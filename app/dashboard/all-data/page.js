'use client'

import { useState, useEffect } from 'react'
import { invoiceAPI, purchaseAPI } from '@/app/lib/apiClient'
import { useAuth } from '@/app/context/AuthContext'
import InvoiceModal from '@/app/components/InvoiceModal'
import PurchaseModal from '@/app/components/PurchaseModal'
import DeleteConfirmModal from '@/app/components/DeleteConfirmModal'

export default function AllData() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState([])
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, item: null })
  const [isDeleting, setIsDeleting] = useState(false)
  const isAdmin = user?.role === 'admin' || user?.role === 'manager'

  // Load both invoices and purchases on mount
  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError('')
      const [invoicesData, purchasesData] = await Promise.all([
        invoiceAPI.getAll(),
        purchaseAPI.getAll(),
      ])
      setInvoices(Array.isArray(invoicesData) ? invoicesData : [])
      setPurchases(Array.isArray(purchasesData) ? purchasesData : [])
    } catch (err) {
      setError(err.message || 'Failed to load data')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Invoice handlers
  const openAddInvoice = () => {
    setSelectedInvoice(null)
    setInvoiceModalOpen(true)
  }

  const openEditInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setInvoiceModalOpen(true)
  }

  const closeInvoiceModal = () => {
    setInvoiceModalOpen(false)
    setSelectedInvoice(null)
  }

  const handleSaveInvoice = async (data) => {
    try {
      const invoiceData = {
        ...data,
        ownerId: user?.id,
      }

      if (selectedInvoice) {
        await invoiceAPI.update(selectedInvoice.id, invoiceData)
      } else {
        await invoiceAPI.create(invoiceData)
      }
      closeInvoiceModal()
      await fetchAllData()
    } catch (err) {
      setError(err.message || 'Failed to save invoice')
      console.error('Save error:', err)
    }
  }

  const openDeleteInvoice = (invoice) => {
    setDeleteModal({ isOpen: true, type: 'invoice', item: invoice })
  }

  // Purchase handlers
  const openAddPurchase = () => {
    setSelectedPurchase(null)
    setPurchaseModalOpen(true)
  }

  const openEditPurchase = (purchase) => {
    setSelectedPurchase(purchase)
    setPurchaseModalOpen(true)
  }

  const closePurchaseModal = () => {
    setPurchaseModalOpen(false)
    setSelectedPurchase(null)
  }

  const handleSavePurchase = async (data) => {
    try {
      const purchaseData = {
        ...data,
        ownerId: user?.id,
      }

      if (selectedPurchase) {
        await purchaseAPI.update(selectedPurchase.id, purchaseData)
      } else {
        await purchaseAPI.create(purchaseData)
      }
      closePurchaseModal()
      await fetchAllData()
    } catch (err) {
      setError(err.message || 'Failed to save purchase')
      console.error('Save error:', err)
    }
  }

  const openDeletePurchase = (purchase) => {
    setDeleteModal({ isOpen: true, type: 'purchase', item: purchase })
  }

  // Delete handlers
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, type: null, item: null })
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      if (deleteModal.type === 'invoice') {
        await invoiceAPI.delete(deleteModal.item.id)
      } else {
        await purchaseAPI.delete(deleteModal.item.id)
      }
      closeDeleteModal()
      await fetchAllData()
    } catch (err) {
      setError(err.message || 'Failed to delete')
      console.error('Delete error:', err)
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 All Data</h1>
        <p className="text-gray-600">View all your invoices and purchases</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading data...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Invoices Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">📄 Invoices ({invoices.length})</h2>
              {isAdmin && (
                <button
                  onClick={openAddInvoice}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  + Add Invoice
                </button>
              )}
            </div>

            {invoices.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-600">
                No invoices found
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
                              onClick={() => openEditInvoice(invoice)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteInvoice(invoice)}
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
          </div>

          {/* Purchases Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">🛒 Purchases ({purchases.length})</h2>
              {isAdmin && (
                <button
                  onClick={openAddPurchase}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  + Add Purchase
                </button>
              )}
            </div>

            {purchases.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-600">
                No purchases found
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-blue-900 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left">Item</th>
                      <th className="px-6 py-3 text-left">Vendor</th>
                      <th className="px-6 py-3 text-left">Amount</th>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      {isAdmin && <th className="px-6 py-3 text-left">Actions</th>}
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
                        {isAdmin && (
                          <td className="px-6 py-4">
                            <button
                              onClick={() => openEditPurchase(purchase)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 transition text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => openDeletePurchase(purchase)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
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
          </div>
        </div>
      )}

      <InvoiceModal
        isOpen={invoiceModalOpen}
        invoice={selectedInvoice}
        onClose={closeInvoiceModal}
        onSave={handleSaveInvoice}
      />

      <PurchaseModal
        isOpen={purchaseModalOpen}
        purchase={selectedPurchase}
        onClose={closePurchaseModal}
        onSave={handleSavePurchase}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        itemName={deleteModal.type === 'invoice' ? deleteModal.item?.title : deleteModal.item?.name}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
