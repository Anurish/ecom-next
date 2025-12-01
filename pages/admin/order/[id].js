import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import useAdmin from "../../../hooks/useAdmin";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminOrderDetails() {
  const { admin, loading: authLoading } = useAdmin();
  const router = useRouter();
  const { id } = router.query;

  // 1. While verifying admin
  if (authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Checking access...
      </div>
    );
  }

  // 2. If not admin, block rendering (redirect handled inside the hook)
  if (!admin) return null;

  // 3. Fetch order only after admin is verified
  const { data, error } = useSWR(id ? `/api/orders/${id}` : null, fetcher);

  if (error) return <div>Error loading order details</div>;
  if (!data) return <div className="p-10 text-center">Loading order...</div>;

  const order = data.order || data;

  const updateStatus = async () => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: order.status }),
      });
      alert("Order status updated!");
    } catch (e) {
      alert("Failed to update");
    }
  };

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

          <Link href="/admin/orders">
            <div className="text-gray-800 p-2 bg-gray-200 rounded cursor-pointer font-semibold">
              Orders
            </div>
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">

        <h1 className="text-3xl font-bold mb-6">Order Details</h1>

        {/* ORDER INFO */}
        <div className="bg-white p-6 rounded-xl border shadow-sm mb-10">
          <p className="text-sm text-gray-500">Order ID:</p>
          <p className="text-xl font-semibold">{order._id}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

            {/* CUSTOMER INFO */}
            <div className="border rounded-xl p-5">
              <h2 className="font-semibold text-lg mb-3">Customer Information</h2>
              <p><strong>Name:</strong> {order.name || "N/A"}</p>
              <p><strong>Email:</strong> {order.email || "N/A"}</p>
              <p><strong>Phone:</strong> {order.phone || "N/A"}</p>
            </div>

            {/* SHIPPING INFO */}
            <div className="border rounded-xl p-5">
              <h2 className="font-semibold text-lg mb-3">Shipping Address</h2>
              <p>{order.address?.street}</p>
              <p>{order.address?.city}, {order.address?.postalCode}</p>
              <p>{order.address?.country}</p>
            </div>
          </div>

          {/* PAYMENT STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="border rounded-xl p-5">
              <h2 className="font-semibold text-lg mb-3">Payment</h2>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-white text-xs 
                    ${order.paymentStatus === "paid" ? "bg-green-500" : "bg-red-500"}
                  `}
                >
                  {order.paymentStatus}
                </span>
              </p>
              <p className="mt-2">
                <strong>Stripe Session:</strong> {order.stripeSessionId || "N/A"}
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h2 className="font-semibold text-lg mb-3">Order Status</h2>
              <select
                className="border p-3 rounded-lg w-full"
                value={order.status}
                onChange={(e) => (order.status = e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
              </select>

              <button
                onClick={updateStatus}
                className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-lg"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>

        {/* ORDER ITEMS */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Order Items</h2>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3">Name</th>
                <th className="py-3">Qty</th>
                <th className="py-3">Price</th>
                <th className="py-3">Total</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="border-b">
                  <td className="py-3">{item.name}</td>
                  <td className="py-3">{item.quantity}</td>
                  <td className="py-3">€{item.price}</td>
                  <td className="py-3 font-semibold">
                    €{(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TOTAL */}
          <div className="text-right mt-6 text-lg font-bold">
            Total: €{order.total}
          </div>
        </div>
      </main>
    </div>
  );
}
