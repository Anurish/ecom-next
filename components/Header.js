// Header.js - will be filled with full production UI in next step
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";


export default function Header() {
  const { cart } = useCart();
const cartCount = cart.reduce(
  (sum, item) => sum + (item.paidQty || 0) + (item.freeQty || 0),
  0
);


  return (
    <header className="w-full border-b bg-white">
      {/* Top bar */}
      <div className="w-full border-b text-xs text-gray-600 py-2">
        <div className="max-w-7xl mx-auto flex justify-end gap-6 px-4">
          <Link href="#">Track your order</Link>
          <Link href="#">Delivery and shipping</Link>
          <Link href="#">Helpdesk</Link>
          <Link href="#">Payments</Link>
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
              alt="Arztschlaflogo"
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
          <Link href="/blogs">Blogs</Link>
          <Link href="/offers"><p className="hover:text-green-700">Angebote</p></Link>
          <Link href="/about">About</Link>
        </nav>

        {/* Search + Cart */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search pills"
            className="hidden md:block px-4 py-2 border rounded-full text-sm w-60"
          />

      <div id="cart-icon" className="relative">
  <Link href="/cart">
    <img src="/icons/cart.svg" className="w-6" />

    {cartCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
        {cartCount}
      </span>
    )}
  </Link>
</div>


       <Link href="/checkout">
  <button className="relative mt-2">
    <Image
      src="/icons/checkout-svgrepo-com.svg"
      width={20}
      height={20}
      alt="checkout"
    />
  </button>
</Link>

        </div>
      </div>
    </header>
  );
}
