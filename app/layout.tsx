import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <title>Vybe — Your Internet Passport</title>
        <meta name="description" content="A living passport for your internet identity. Connect your platforms, build your passport, own your identity." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Vybe — Your Internet Passport" />
        <meta property="og:description" content="Your taste, work, communities, and reputation — in one privacy-aware passport." />
        <meta name="theme-color" content="#0F172A" />
      </head>
      <body>{children}</body>
    </html>
  )
}
