'use client'

import { useState, useEffect } from 'react'

export default function InvoiceModal({ isOpen, invoice, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: '',
    status: 'Pending',
    description: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Pre-fill form when editing
  useEffect(() => {
    if (invoice) {
      setFormData({
        title: invoice.title || '',
        amount: invoice.amount || '',
        date: invoice.date ? invoice.date.split('T')[0] : '',
        status: invoice.status || 'Pending',
        description: invoice.description || '',
      })
    } else {
      setFormData({
        title: '',
        amount: '',
        date: '',
        status: 'Pending',
        description: '',
      })
    }
    setError('')
  }, [invoice, isOpen])

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

    if (!formData.title || !formData.amount || !formData.date) {
      setError('Please fill in all required fields')
      console.error('❌ Missing fields:', {
        title: !formData.title,
        amount: !formData.amount,
        date: !formData.date,
      })
      return
    }

    setIsLoading(true)
    const dataToSend = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      date: formData.date,
      status: formData.status,
      description: formData.description,
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
          {invoice ? 'Edit Invoice' : 'Add New Invoice'}
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Invoice title"
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
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Invoice description"
              rows="3"
              disabled={isLoading}
            />
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
              {isLoading ? 'Saving...' : 'Save Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
