import { useState } from "react";
import Link from "next/link";

export default function AddProduct() {
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
      const res = await fetch("/api/products", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        setMsg("Product added successfully!");
        setForm({
          name: "",
          price: "",
          stock: "",
          category: "",
          description: "",
        });
        setPreview(null);
        setImage(null);
      } else {
        setMsg(data.msg || "Failed to create product");
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
            <div className="text-gray-800 p-2 bg-gray-200 rounded cursor-pointer font-semibold">
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
        <h1 className="text-3xl font-bold mb-8">Add Product</h1>

        {/* SUCCESS / ERROR MESSAGE */}
        {msg && (
          <div className="p-3 mb-6 rounded-lg text-white bg-blue-500 text-center text-sm">
            {msg}
          </div>
        )}

        {/* ADD PRODUCT FORM */}
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
                <option value="">Select Category</option>
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
            <label className="block text-sm font-medium mb-1">Upload Image</label>
            <input type="file" className="border p-3 rounded-lg w-full" onChange={handleImage} />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 w-32 h-32 object-cover border rounded-lg"
              />
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="mt-8 bg-red-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </form>
      </main>
    </div>
  );
}
