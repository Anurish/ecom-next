import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice, totalQuantity } = useCart();

  return (
    <>
      <Header />

      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-6">
              Your cart is currently empty.
            </p>
            <Link href="/">
              <button className="px-6 py-3 bg-red-500 text-white rounded-lg">
                Shop Now
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => {
                const visibleQty = (item.paidQty || 0) + (item.freeQty || 0);
                const unitPrice = item.offerData?.offerPrice || item.price;

                return (
                  <div
                    key={item.key}
                    className="flex items-center gap-6 bg-white p-5 border rounded-xl shadow-sm"
                  >
                    <Image
                      src={item.image || item.images?.[0] || "/placeholder.jpg"}
                      width={120}
                      height={120}
                      alt={item.name}
                      className="rounded-lg border object-contain"
                    />

                    <div className="flex-1">
                      <h2 className="text-xl font-semibold">{item.name}</h2>

                      <p className="text-gray-600 mt-1">
                        €{unitPrice.toFixed(2)}
                      </p>

                      {/* OFFER BADGE */}
                      {item.freeQty > 0 && (
                        <p className="text-sm text-green-700 font-bold mt-1">
                          {item.paidQty} + {item.freeQty} Free Offer Applied
                        </p>
                      )}

                      {/* QUANTITY */}
                      <div className="flex items-center gap-3 mt-4">
                        <button
                          className="px-3 py-1 bg-gray-200 rounded-lg"
                          onClick={() =>
                            item.paidQty > 1 &&
                            updateQuantity(item.key, item.paidQty - 1)
                          }
                        >
                          -
                        </button>

                        <span className="px-3 font-semibold">{visibleQty}</span>

                        <button
                          className="px-3 py-1 bg-gray-200 rounded-lg"
                          onClick={() =>
                            updateQuantity(item.key, item.paidQty + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="text-red-600 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ORDER SUMMARY */}
            <div className="bg-white p-6 border rounded-xl shadow-sm h-fit">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="flex justify-between text-gray-700 mb-3">
                <span>Subtotal</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-700 mb-6">
                <span>Items</span>
                <span>{totalQuantity}</span>
              </div>

              <div className="flex justify-between text-xl font-bold mb-8">
                <span>Total</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>

              <Link href="/checkout">
                <button className="w-full bg-red-500 text-white py-3 rounded-xl text-lg font-semibold hover:bg-red-600 transition">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
