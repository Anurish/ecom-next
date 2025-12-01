// components/ProductCard.js
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, showAddToCart = true }) {
  const { addToCart } = useCart();

  const id = product._id || product.id || product.slug || "";
  const slug = product.slug || id;

  const img =
    product.image ||
    (product.images && product.images.length && product.images[0]) ||
    `/uploads/${product.slug || id}.jpg` ||
    "/placeholder.jpg";

  const price = Number(product.selling_price ?? product.price ?? product.amount ?? 0);

  // FLY-TO-CART animation
const flyToCart = (imageSrc, e) => {
  const cartIcon = document.getElementById("cart-icon");
  const flyContainer = document.getElementById("fly-container");
  if (!cartIcon || !flyContainer) return;

  const imgRect = e.currentTarget.getBoundingClientRect();   // <-- FIXED
  const cartRect = cartIcon.getBoundingClientRect();

  const tempImg = document.createElement("img");
  tempImg.src = imageSrc;
  tempImg.className = "fly-img";
  tempImg.style.left = imgRect.left + "px";
  tempImg.style.top = imgRect.top + "px";

  flyContainer.appendChild(tempImg);

  requestAnimationFrame(() => {
    tempImg.style.transform = `translate(${cartRect.left - imgRect.left}px, ${cartRect.top - imgRect.top}px) scale(0.2)`;
    tempImg.style.opacity = "0";
  });

  setTimeout(() => tempImg.remove(), 900);

  setTimeout(() => {
    cartIcon.classList.add("cart-bounce");
    setTimeout(() => cartIcon.classList.remove("cart-bounce"), 500);
  }, 900);
};


 const handleAddToCart = (e) => {
  e.preventDefault();
  e.stopPropagation();

  const sku = product.sku || product.SKU || product.product_sku || null;

  const cartItem = {
    _id: product._id || product.id || String(slug),
    sku,
    name: product.name || product.title || "Product",
    price,
    images: product.images || (product.image ? [product.image] : []),
    paidQty: 1,
    freeQty: 0,
    slug,
  };

  if (!sku) {
    console.warn("PRODUCT HAS NO SKU — WhatsApp API WILL FAIL:", product);
  }

  addToCart(cartItem);

  // run animation — PASS FULL EVENT
  flyToCart(img, e);
};


  return (
    <Link href={`/product/${slug}`} legacyBehavior>
      <a className="block group">
        <div className="rounded-xl border p-4 shadow-sm hover:shadow-lg transition flex flex-col justify-between h-full bg-white">
          <div>
            <div className="w-full h-44 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
              <img src={img} alt={product.name} className="max-h-full object-contain" />
            </div>

            <h3 className="mt-4 font-semibold text-sm md:text-base text-gray-800">{product.name}</h3>
            <p className="text-red-500 font-bold mt-1">€{price.toFixed(2)}</p>
          </div>

          <div className="mt-4 flex gap-2">
            {showAddToCart && (
         <button
  onClick={(e) => handleAddToCart(e)}
  className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
>
  Add to cart
</button>

            )}
            <span className="hidden md:inline-block px-3 py-2 border rounded-lg text-sm text-gray-700">
              View
            </span>
          </div>
        </div>
      </a>
    </Link>
  );
}
