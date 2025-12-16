import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import products from "../data/products.json";
const resolveProductSlug = (product) => {
  return product.slug || product._id || product.id || null;
};

export default function Header() {
  const { cart } = useCart();

  const cartCount = cart.reduce(
    (sum, item) => sum + (item.paidQty || 0) + (item.freeQty || 0),
    0
  );

  /* ================= SEARCH STATE ================= */
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter((p) => p.name?.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query]);

  return (
    <header className="w-full border-b bg-white">
      {/* Top bar */}
      <div className="w-full border-b text-xs text-gray-600 py-2">
        <div className="max-w-7xl mx-auto flex justify-end gap-6 px-4">
          <Link href="#">Track your order</Link>
          <Link href="#">Delivery and shipping</Link>
          <Link href="/helpdesk">Helpdesk</Link>
          <Link href="/payments">Payments</Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/Arztschlaf-png.webp"
              width={140}
              height={100}
              alt="Arztschlaf"
              priority
            />
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
          <Link href="/">Home</Link>
          <Link href="/category/Sleeping-pills">Sleep Disorder</Link>
          <Link href="/category/Painkiller">Painkiller</Link>
          <Link href="/category/Antibiotics">Antibiotics</Link>
          <Link href="/category/Stimulants">Stimulants</Link>
          <Link href="/category/Erection-Pills">Erection Pills</Link>
          <Link href="/offers" className="hover:text-green-700">
            Angebote
          </Link>
          <Link href="/about-us">About</Link>
        </nav>

        {/* Search + Cart */}
        <div className="flex items-center gap-4">
          {/* SEARCH */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search pills"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 120)}
              className="w-56 px-4 py-2 border rounded-full text-sm 
                         focus:outline-none focus:ring-1 focus:ring-green-600"
            />

      {showDropdown && query && (
  <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
    {searchResults.length > 0 ? (
      searchResults.map((item) => {
        const slug = resolveProductSlug(item);
        if (!slug) return null;

        return (
          <Link
            key={slug}
            href={`/product/${slug}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-sm"
          >
            <img
              src={
                item.image ||
                (item.images && item.images[0]) ||
                "/placeholder.jpg"
              }
              alt={item.name}
              className="w-10 h-10 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-gray-500">
                €{Number(item.price || item.selling_price || 0).toFixed(2)}
              </p>
            </div>
          </Link>
        );
      })
    ) : (
      <div className="px-4 py-3 text-sm text-gray-500">
        No results found
      </div>
    )}
  </div>
)}

          </div>

          {/* CART */}
          <div id="cart-icon" className="relative">
            <Link href="/cart">
              <img src="/icons/cart.svg" className="w-6" alt="Cart" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* CHECKOUT */}
          <Link href="/checkout">
            <button className="relative mt-1">
              <Image
                src="/icons/checkout-svgrepo-com.svg"
                width={20}
                height={20}
                alt="Checkout"
              />
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
