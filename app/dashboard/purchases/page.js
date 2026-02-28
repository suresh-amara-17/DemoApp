'use client'

import { useState, useEffect } from 'react'
import { purchaseAPI } from '@/app/lib/apiClient'
import { useAuth } from '@/app/context/AuthContext'
import PurchaseModal from '@/app/components/PurchaseModal'
import DeleteConfirmModal from '@/app/components/DeleteConfirmModal'

export default function Purchases() {
  const { user } = useAuth()

  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, purchase: null })
  const [isDeleting, setIsDeleting] = useState(false)

  const isAdmin = user?.role === 'admin' || user?.role === 'manager'

  // Load purchases on mount
  useEffect(() => {
    fetchPurchases()
  }, [])

  // ✅ Clean fetch function
  const fetchPurchases = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await purchaseAPI.getAll()

      console.log('API Response:', response)

      // Support both formats: [] OR { data: [] }
      if (Array.isArray(response)) {
        setPurchases(response)
      } else if (Array.isArray(response?.data)) {
        setPurchases(response.data)
      } else {
        setPurchases([])
      }

    } catch (err) {
      console.error('Fetch error:', err)
      setError(err.message || 'Failed to load purchases')
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setSelectedPurchase(null)
    setIsModalOpen(true)
  }

  const openEditModal = (purchase) => {
    setSelectedPurchase(purchase)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
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

      closeModal()
      fetchPurchases()

    } catch (err) {
      console.error('Save error:', err)
      setError(err.message || 'Failed to save purchase')
    }
  }

  const openDeleteModal = (purchase) => {
    setDeleteModal({ isOpen: true, purchase })
  }

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, purchase: null })
  }

  const handleDeletePurchase = async () => {
    try {
      setIsDeleting(true)

      await purchaseAPI.delete(deleteModal.purchase.id)

      closeDeleteModal()
      fetchPurchases()

    } catch (err) {
      console.error('Delete error:', err)
      setError(err.message || 'Failed to delete purchase')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🛒 Purchases</h1>
        </div>

        {isAdmin && (
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            + Add Purchase
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
          <p className="text-gray-600">Loading purchases...</p>
        </div>
      ) : purchases.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600">No purchases found</p>
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
                  <td className="px-6 py-4 font-semibold">
                    {purchase.name}
                  </td>

                  <td className="px-6 py-4">
                    {purchase.vendor}
                  </td>

                  <td className="px-6 py-4">
                    ${Number(purchase.amount || 0).toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    {purchase.date
                      ? new Date(purchase.date).toLocaleDateString()
                      : '-'}
                  </td>

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
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(purchase)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => openDeleteModal(purchase)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PurchaseModal
        isOpen={isModalOpen}
        purchase={selectedPurchase}
        onClose={closeModal}
        onSave={handleSavePurchase}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        itemName={deleteModal.purchase?.name}
        onClose={closeDeleteModal}
        onConfirm={handleDeletePurchase}
        isLoading={isDeleting}
      />
    </div>
  )
}