'use client'

import { AuthProvider } from '@/app/context/AuthContext'

export default function ClientLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}
