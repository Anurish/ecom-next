import Link from "next/link";
import useSWR from "swr";
import useAdmin from "../../hooks/useAdmin";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function AdminOrders() {
  const { admin, loading } = useAdmin();

  // Step 1: While verifying admin
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Checking access...
      </div>
    );
  }

  // Step 2: If not admin, useAdmin will redirect → don't render anything
  if (!admin) return null;

  // Step 3: Safe to fetch orders AFTER admin verified
  const { data, error } = useSWR("/api/orders", fetcher);

  if (error) return <div>Error loading orders</div>;
  if (!data) return <div className="p-10 text-center">Loading orders...</div>;

  const orders = Array.isArray(data) ? data : data.orders || [];

  return (
    <div className="min-h-screen w-full bg-gray-100 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

        <nav className="space-y-4">
          <Link href="/admin">
            <div className="text-gray-700 p-2 hover:bg-gray-100 rounded cursor-pointer">
              Dashboard
            </div>
          </Link>

          <Link href="/admin/products">
            <div className="text-gray-700 p-2 hover:bg-gray-100 rounded cursor-pointer">
              Products
            </div>
          </Link>

          <Link href="/admin/add-product">
            <div className="text-gray-700 p-2 hover:bg-gray-100 rounded cursor-pointer">
              Add Product
            </div>
          </Link>

          <Link href="/admin/orders">
            <div className="text-gray-800 p-2 bg-gray-200 rounded cursor-pointer font-semibold">
              Orders
            </div>
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Orders</h1>

          <div className="flex gap-3">
            <button className="px-3 py-2 bg-gray-200 rounded-lg text-sm">
              Pending
            </button>
            <button className="px-3 py-2 bg-gray-200 rounded-lg text-sm">
              Shipped
            </button>
            <button className="px-3 py-2 bg-gray-200 rounded-lg text-sm">
              Completed
            </button>
          </div>
        </div>

        {/* ORDERS TABLE */}
        <div className="bg-white p-6 border rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3">Order ID</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Payment</th>
                <th className="py-3">Status</th>
                <th className="py-3">Date</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b">
                  <td className="py-3">{o._id}</td>
                  <td className="py-3">{o.name || "N/A"}</td>
                  <td className="py-3 font-semibold text-red-500">€{o.total}</td>

                  {/* PAYMENT STATUS */}
                  <td className="py-3">
                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs text-white
                        ${o.paymentStatus === "paid" ? "bg-green-500" : "bg-yellow-500"}
                      `}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>

                  {/* ORDER STATUS */}
                  <td className="py-3">
                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs text-white
                        ${
                          o.status === "completed"
                            ? "bg-green-600"
                            : o.status === "shipped"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }
                      `}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td className="py-3">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3 text-right">
                    <Link href={`/admin/order/${o._id}`}>
                      <button className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs">
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <p className="text-center py-6 text-gray-500">No orders found</p>
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center mt-10">
          <button className="px-4 py-2 bg-gray-200 rounded-lg mx-2">Prev</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg mx-2">
            1
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg mx-2">2</button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg mx-2">Next</button>
        </div>

      </main>
    </div>
  );
}
