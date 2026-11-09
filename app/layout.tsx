import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hệ thống quản lý bãi xe',
  description: 'Hệ thống quản lý bãi đỗ xe thông minh - Bản đồ & Định vị',
  icons: { icon: '/bk-logo.png' },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors />
      </body>
    </html>
  )
}
