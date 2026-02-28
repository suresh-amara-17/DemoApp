'use client'

import { useState, useEffect } from 'react'

export default function PurchaseModal({ isOpen, purchase, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    vendor: '',
    amount: '',
    date: '',
    status: 'In Transit',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Pre-fill form when editing
  useEffect(() => {
    if (purchase) {
      setFormData({
        name: purchase.name || '',
        vendor: purchase.vendor || '',
        amount: purchase.amount || '',
        date: purchase.date ? purchase.date.split('T')[0] : '',
        status: purchase.status || 'In Transit',
      })
    } else {
      setFormData({
        name: '',
        vendor: '',
        amount: '',
        date: '',
        status: 'In Transit',
      })
    }
    setError('')
  }, [purchase, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    console.log('📝 Form Data:', formData)

    if (!formData.name || !formData.vendor || !formData.amount || !formData.date) {
      setError('Please fill in all required fields')
      console.error('❌ Missing fields:', {
        name: !formData.name,
        vendor: !formData.vendor,
        amount: !formData.amount,
        date: !formData.date,
      })
      return
    }

    setIsLoading(true)
    const dataToSend = {
      name: formData.name,
      vendor: formData.vendor,
      amount: parseFloat(formData.amount),
      date: formData.date,
      status: formData.status,
    }
    console.log('📤 Sending to API:', dataToSend)
    await onSave(dataToSend)
    setIsLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-blue-900">
          {purchase ? 'Edit Purchase' : 'Add New Purchase'}
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Item Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Item name"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Vendor *</label>
            <input
              type="text"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Vendor name"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="0.00"
              step="0.01"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            >
              <option value="In Transit">In Transit</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              {isLoading ? 'Saving...' : 'Save Purchase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
