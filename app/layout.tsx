import type { Metadata, Viewport } from "next"
import { Inter, Oswald } from "next/font/google"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" })

export const metadata: Metadata = {
  title: "Projeto Pereirinha - Gremio Recreativo",
  description:
    "Futebol recreativo para jovens de 4 a 17 anos em Sao Paulo. Inscricoes abertas!",
}

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${_inter.variable} ${_oswald.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
