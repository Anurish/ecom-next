import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function AdminDashboard() {
  const { data, error } = useSWR("/api/admin/me", fetcher);

  if (error) return <div>Access denied</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-4">Welcome, {data.user.email}</p>

      <a
        href="/admin/products"
        className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded"
      >
        Manage Products
      </a>
    </div>
  );
}
