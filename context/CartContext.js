import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext();

const CART_EXPIRY_HOURS = 0;
const CART_VERSION = "v2"; // Incremented because structure changed (sku added)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // -------------------------------
  // LOAD CART
  // -------------------------------
  useEffect(() => {
    setHydrated(true);
    if (typeof window === "undefined") return;

    try {
      const saved = JSON.parse(localStorage.getItem("cart") || "null");
      const meta = JSON.parse(localStorage.getItem("cart_meta") || "null");

      if (!saved || !Array.isArray(saved)) return;

      if (meta?.version !== CART_VERSION) {
        console.warn("Cart version changed — clearing old cart");
        localStorage.removeItem("cart");
        localStorage.removeItem("cart_meta");
        return;
      }

      if (CART_EXPIRY_HOURS > 0 && meta?.timestamp) {
        const ageHours = (Date.now() - meta.timestamp) / (1000 * 60 * 60);
        if (ageHours > CART_EXPIRY_HOURS) {
          console.warn("Cart expired — clearing cart");
          localStorage.removeItem("cart");
          localStorage.removeItem("cart_meta");
          return;
        }
      }

      setCart(saved);
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  }, []);

  // -------------------------------
  // SAVE CART
  // -------------------------------
  useEffect(() => {
    if (!hydrated) return;
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem(
        "cart_meta",
        JSON.stringify({
          version: CART_VERSION,
          timestamp: Date.now(),
        })
      );
    } catch (err) {
      console.error("Failed to save cart:", err);
    }
  }, [cart, hydrated]);

  // -------------------------------
  // UNIQUE KEY (sku preferred)
  // -------------------------------
  const getKey = useCallback((product) => {
    if (product.sku) return product.sku;
    if (product.variantId) return `${product._id}_${product.variantId}`;
    if (product.weight) return `${product._id}_${product.weight}`;
    return product._id;
  }, []);

  // -------------------------------
  // ADD TO CART
  // -------------------------------
const addToCart = (product) => {
  setCart((prev) => {
    const key = product.sku || product._id || product.slug;
    const exist = prev.find((item) => item.key === key);

    const addQty = product.quantity || 1;

    // First add => create paidQty & freeQty
    if (!exist) {
      const paidQty = addQty;
      let freeQty = 0;

      if (product.offerData?.combination) {
        const { buy, get } = product.offerData.combination;
        freeQty = Math.floor(paidQty / buy) * get;
      }

      return [...prev, { ...product, key, paidQty, freeQty }];
    }

    // Already in cart => update
    const updated = prev.map((item) => {
      if (item.key !== key) return item;

      const paidQty = item.paidQty + addQty;
      let freeQty = 0;

      if (item.offerData?.combination) {
        const { buy, get } = item.offerData.combination;
        freeQty = Math.floor(paidQty / buy) * get;
      }

      return { ...item, paidQty, freeQty };
    });

    return updated;
  });
};




  // -------------------------------
  // REMOVE ITEM
  // -------------------------------
  const removeFromCart = useCallback((key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  }, []);

  // -------------------------------
  // UPDATE QUANTITY
  // -------------------------------
const updateQuantity = useCallback((key, qty) => {
  setCart((prev) =>
    prev.map((item) => {
      if (item.key !== key) return item;

      const paidQty = Math.max(1, qty);
      let freeQty = 0;

      if (item.offerData?.combination) {
        const { buy, get } = item.offerData.combination;
        freeQty = Math.floor(paidQty / buy) * get;
      }

      return { ...item, paidQty, freeQty };
    })
  );
}, []);



  // -------------------------------
  // CLEAR CART (For success page)
  // -------------------------------
  const clearCart = useCallback(() => {
    setCart([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
      localStorage.removeItem("cart_meta");
    }
  }, []);

  // -------------------------------
  // PROVIDER
  // -------------------------------


    // -------------------------------
  // CALCULATE TOTALS (with offer logic)
  // -------------------------------
  const calculateTotals = useCallback(() => {
    let totalPrice = 0;
    let totalQuantity = 0;

   cart.forEach((item) => {
  const qty = item.paidQty + item.freeQty;
  totalQuantity += qty;

  // OFFER product
  if (item.offerData?.combination?.buy && item.offerData?.combination?.get) {
    const offerPrice = item.offerData.offerPrice || item.price;
    totalPrice += item.paidQty * offerPrice;
  } else {
    totalPrice += item.paidQty * item.price;
  }
});

    return { totalPrice, totalQuantity };
  }, [cart]);

  const { totalPrice, totalQuantity } = calculateTotals();



  return (
 <CartContext.Provider
  value={{
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    totalQuantity
  }}
>

      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
