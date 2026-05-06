import Navbar from './Navbar'
export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="bg-brand-blue text-blue-200 text-center text-sm py-4">
        © {new Date().getFullYear()} Wyn Power Corporation. All rights reserved.
      </footer>
    </div>
  )
}
