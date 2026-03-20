import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Rehab Tracker',
  description: 'Seguimiento de lesiones y terapia física',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Rehab Tracker' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f7' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} antialiased`}>
      <body className="min-h-[100dvh] pb-safe">
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: '12px',
              background: 'var(--card)',
              color: 'var(--text)',
              border: '0.5px solid var(--divider)',
              boxShadow: 'var(--shadow-lg)',
              fontSize: '14px',
              fontWeight: 500,
            },
          }}
        />
      </body>
    </html>
  )
}
