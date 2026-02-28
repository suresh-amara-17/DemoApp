'use client'

import { useAuth } from '@/app/context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Dashboard</h1>
      <p className="text-lg text-gray-600 mb-8">
        Hello, <span className="font-bold">{user?.email || 'User'}</span>! You are now logged in.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">📄 Invoices</h2>
          <p className="text-gray-600">View and manage your invoices</p>
          <a
            href="/dashboard/invoices"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Go to Invoices
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">🛒 Purchases</h2>
          <p className="text-gray-600">View and manage your purchases</p>
          <a
            href="/dashboard/purchases"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Go to Purchases
          </a>
        </div>
      </div>
    </div>
  )
}
