'use client'

import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'

export default function Sidebar() {
  const { logout, user } = useAuth()

  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-blue-200 text-sm mt-2">Welcome, {user?.email || 'User'}</p>
        <p className="text-blue-300 text-xs mt-1">Role: {user?.role || 'user'}</p>
      </div>

      <nav className="space-y-4 flex-1">
        <div>
          <h2 className="text-xs font-bold uppercase text-blue-300 mb-4">Menu</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="block px-4 py-2 rounded hover:bg-blue-800 transition"
              >
                🏠 Home
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/invoices"
                className="block px-4 py-2 rounded hover:bg-blue-800 transition"
              >
                📄 Invoices
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/purchases"
                className="block px-4 py-2 rounded hover:bg-blue-800 transition"
              >
                🛒 Purchases
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <button
        onClick={logout}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
      >
        Logout
      </button>
    </div>
  )
}
