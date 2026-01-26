import './globals.css'

export const metadata = {
  title: 'Real Analysis Visualizations',
  description: 'Interactive visualizations of key theorems and proofs in real analysis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
