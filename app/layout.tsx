import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SGPC - Sistema de Gestão',
  description: 'Gerencie funcionários, turnos e horas trabalhadas com autenticação Discord',
  generator: 'Cerreti',
  icons: {
    icon: [
      {
        url: '/pc.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/pc.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/pc.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
