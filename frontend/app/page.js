'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to Auth App</h1>
        <p className="text-xl mb-8">A simple authentication demo with Next.js</p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-white text-blue-900 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}
