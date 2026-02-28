import './globals.css'
import ClientLayout from './ClientLayout'

export const metadata = {
  title: 'Auth App',
  description: 'Authentication Demo with Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
