import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import "@meshsdk/react/styles.css"; // Thêm CSS của Mesh
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import MeshProviderClient from "@/components/client-mesh-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BHMS - Blockchain Heritage Management System",
  description: "Secure your digital legacy with blockchain technology",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <MeshProviderClient>
            <Navbar/>
            {children}
          </MeshProviderClient>
        </ThemeProvider>
      </body>
    </html>
  )
}