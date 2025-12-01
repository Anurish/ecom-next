import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-md p-5">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="space-y-3">
          <Link href="/admin" className="block p-2 rounded hover:bg-gray-100">
            Dashboard
          </Link>
          <Link href="/admin/products" className="block p-2 rounded hover:bg-gray-100">
            Products
          </Link>
          <Link href="/admin/orders" className="block p-2 rounded hover:bg-gray-100">
            Orders
          </Link>
          <Link href="/admin/categories" className="block p-2 rounded hover:bg-gray-100">
            Categories
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}
