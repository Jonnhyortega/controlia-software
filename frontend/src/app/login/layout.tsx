export const metadata = {
  title: 'Login Controlia',
  description: 'Sistema de gestión comercial - Página de Login',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <div>{children}</div>
    </section>
  )
}
