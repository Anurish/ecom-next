import useSWR from "swr";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function AdminProducts() {
  const { data, error } = useSWR("/api/admin/products", fetcher);

  if (error) return <p>Access denied</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <Link
        href="/admin/add-product"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Product
      </Link>

      <div className="mt-6 space-y-4">
        {data.products.map((p) => (
          <div
            key={p._id}
            className="p-4 border rounded flex justify-between bg-white"
          >
            <span>{p.name}</span>

            <Link
              href={`/admin/edit-product?id=${p._id}`}
              className="text-blue-600"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
