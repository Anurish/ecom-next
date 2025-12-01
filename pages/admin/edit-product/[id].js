import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useAdmin from "../../../hooks/useAdmin";

export default function EditProduct() {
  const { admin, loading: authLoading } = useAdmin();
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // 1. While checking admin access
  if (authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Checking access...
      </div>
    );
  }

  // 2. If not admin, block render (redirect happens in hook)
  if (!admin) return null;

  // Load existing product data
  useEffect(() => {
    if (!id) return;

    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const p = data.product || data;
        setForm({
          name: p.name,
          price: p.price,
          stock: p.stock,
          category: p.category,
          description: p.description,
        });
        setPreview(p.images?.[0] || null);
      });
  }, [id]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("price", form.price);
    fd.append("stock", form.stock);
    fd.append("category", form.category);
    fd.append("description", form.description);
    if (image) fd.append("image", image);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        setMsg("Product updated successfully!");
      } else {
        setMsg(data.msg || "Update failed");
      }
    } catch (err) {
      setMsg("Something went wrong");
    }

    setLoading(false);
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

          <Link href="/admin/add-product">
            <div className="text-gray-700 p-2 hover:bg-gray-100 rounded cursor-pointer">
              Add Product
            </div>
          </Link>

          <Link href="/admin/orders">
            <div className="text-gray-700 p-2 hover:bg-gray-100 rounded cursor-pointer">
              Orders
            </div>
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

        {msg && (
          <div className="p-3 mb-6 rounded-lg text-white bg-blue-500 text-center text-sm">
            {msg}
          </div>
        )}

        {/* EDIT PRODUCT FORM */}
        <form
          className="bg-white p-8 rounded-xl shadow-sm border max-w-3xl"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* NAME */}
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input
                type="text"
                required
                className="border p-3 rounded-lg w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="block text-sm font-medium mb-1">Price (EUR)</label>
              <input
                type="number"
                required
                className="border p-3 rounded-lg w-full"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            {/* STOCK */}
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input
                type="number"
                required
                className="border p-3 rounded-lg w-full"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                required
                className="border p-3 rounded-lg w-full"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Sleep Disorder">Sleep Disorder</option>
                <option value="Painkiller">Painkiller</option>
                <option value="Antibiotics">Antibiotics</option>
                <option value="Stimulants">Stimulants</option>
                <option value="Erection Pills">Erection Pills</option>
              </select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows="5"
              className="border p-3 rounded-lg w-full"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            ></textarea>
          </div>

          {/* IMAGE UPLOAD */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">Replace Image</label>
            <input type="file" className="border p-3 rounded-lg w-full" onChange={handleImage} />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 w-32 h-32 object-cover border rounded-lg"
              />
            )}
          </div>

          <button
            type="submit"
            className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </main>
    </div>
  );
}
