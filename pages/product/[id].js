import { useRouter } from "next/router";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch product + related WITHOUT blocking UI
  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        const res = await fetch(`/api/product/${id}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data.product);
          setRelated(data.related);
        }
      } catch (err) {
        console.error("Product fetch failed:", err);
      }
      setLoading(false);
    }

    fetchData();
  }, [id]);

  // UI shows instantly while product loads
  if (loading)
    return (
      <div className="text-center py-20 text-xl">
        Loading product…
      </div>
    );

  if (!product)
    return (
      <div className="py-20 text-center text-xl">
        Product not found
      </div>
    );

  const productImage =
    product.image ||
    (product.images?.length ? product.images[0] : null) ||
    "/placeholder.jpg";

  const price =
    Number(product.selling_price ?? product.price ?? product.amount ?? 0);

  const handleAdd = (q) => {
    const cartItem = {
      _id: product._id,
      sku: product.sku || product.SKU || product.product_sku,
      name: product.name,
      price,
      quantity: q,
      images: product.images || [product.image],
      slug: product.slug,
    };
    addToCart(cartItem);
  };

  return (
    <>
      <Header />

      <div className="max-w-5xl mx-auto py-10 px-4">
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 underline"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Image
            src={productImage}
            width={500}
            height={500}
            alt={product.name}
            className="rounded-lg object-contain"
          />

          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-xl text-gray-700 mb-4">
              {product.category?.name || product.category}
            </p>
            <p className="text-4xl font-bold text-red-500 mb-6">
              €{price.toFixed(2)}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {product.description || "No description available."}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mt-6">
              <span className="font-semibold">Quantity:</span>

              <button
                className="px-3 py-1 bg-gray-200 rounded-lg"
                onClick={() => qty > 1 && setQty(qty - 1)}
              >
                -
              </button>

              <span className="px-3 font-semibold">{qty}</span>

              <button
                className="px-3 py-1 bg-gray-200 rounded-lg"
                onClick={() => setQty(qty + 1)}
              >
                +
              </button>
            </div>

            {/* Add to cart */}
            <button
              onClick={() => handleAdd(qty)}
              className="w-full bg-red-500 text-white py-3 rounded-lg mt-6 text-lg font-semibold hover:bg-red-600 transition"
            >
              Add {qty} to Cart
            </button>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>

          {related?.length === 0 && (
            <p className="text-gray-500">No related products found</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((item) => {
              const img =
                item.image ||
                (item.images?.length ? item.images[0] : null) ||
                "/placeholder.jpg";

              const rPrice = Number(
                item.selling_price ?? item.price ?? item.amount ?? 0
              ).toFixed(2);

              return (
                <div
                  key={item._id}
                  className="border p-4 rounded-lg cursor-pointer"
                  onClick={() => router.push(`/product/${item._id}`)}
                >
                  <Image
                    src={img}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="rounded-lg object-contain"
                  />
                  <h3 className="font-semibold mt-3 text-sm">{item.name}</h3>
                  <p className="text-red-500 font-bold">€{rPrice}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
