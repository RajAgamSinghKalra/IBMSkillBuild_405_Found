import './globals.css'
import { Toaster } from "sonner"

export const metadata = {
  title: 'EmpowerYouth - Your AI Career Coach',
  description: 'AI-powered career guidance for Indian youth aligned with UN SDG 8 - Decent Work & Economic Growth',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}