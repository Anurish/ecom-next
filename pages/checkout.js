import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function CheckoutPage() {
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);

  // FORM
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [country, setCountry] = useState("Netherlands");
  const [postcode, setPostcode] = useState("");
  const [house, setHouse] = useState("");
  const [addition, setAddition] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [shippingCost, setShippingCost] = useState(0);

  // hidden extracted values
  const [hiddenHouse, setHiddenHouse] = useState("");
  const [hiddenStreet, setHiddenStreet] = useState("");
  const [hiddenCity, setHiddenCity] = useState("");
 const [hiddenState, setHiddenState] = useState("");
  // Payment
  const [countryCode, setCountryCode] = useState("31");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [cryptoCoins, setCryptoCoins] = useState([]);
  const [chosenCrypto, setChosenCrypto] = useState("");
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
 

  

  // Price Calc
  const subtotal = cart.reduce((sum, item) => {
    const paid = item.paidQty || 0;
    const unitPrice = item.offerData?.offerPrice || item.price;
    return sum + paid * unitPrice;
  }, 0);

  const total = subtotal + shippingCost;

const countryPhoneCodes = {
  Netherlands: "31",
  Germany: "49",
  Belgium: "32",
  France: "33",
  "United Kingdom": "44",
  India: "91",
};


  const countryISO = {
    Netherlands: "NL",
    Germany: "DE",
    Belgium: "BE",
    France: "FR",
    "United Kingdom": "GB",
    Ireland: "IE",
  };

  // Suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

useEffect(() => {
  if (!country) return;

  const fetchShipping = async () => {
    try {
      const res = await fetch(
        `/api/ezdash/shipping?country=${country}&type=crypto`
      );

      if (!res.ok) throw new Error("Shipping fetch failed");

      const data = await res.json();
      const cost = data?.data?.shipping_cost?.cost || 0;
      setShippingCost(cost);
    } catch (err) {
      console.error("Shipping error:", err);
      setShippingCost(0);
    }
  };

  fetchShipping();
}, [country]);


  // FIXED — fetch suggestions only when postcode exists & house entered
const fetchSuggestions = async (value) => {
  setHouse(value);

  if (!value || value.length < 1) return;
  if (!postcode || postcode.length < 4) return;

  try {
    const formattedPostcode = postcode.replace(/\s+/g, "").toUpperCase();

   const url = `/api/postgrid/suggest?country=${country}&postcode=${formattedPostcode}&house=${value}`;

    const res = await fetch(url);
    const data = await res.json();

    const list = data?.suggestions || [];

    if (data.success && list.length > 0) {
      setSuggestions(list.map((s) => ({ label: s.label, raw: s.label })));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  } catch (err) {
    console.log("PostGrid Error", err);
  }
};


const verifyAddressWithPostgrid = async ({
  street,
  houseNumber,
  postcode,
  countryISO,
}) => {
  try {
    const body = new URLSearchParams({
      "address[line1]": `${street} ${houseNumber}`,
      "address[postalOrZip]": postcode,
      "address[country]": countryISO,
    });

    const res = await fetch("/api/postgrid/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const result = await res.json();

    const status = result?.data?.summary?.verificationStatus;

    if (status === "verified" || status === "partially_verified") {
      setHiddenState(result.data.provinceOrState || "");
      setHiddenCity(result.data.city || hiddenCity);

      console.log("POSTGRID STATE:", result.data.provinceOrState);
    }
  } catch (err) {
    console.error("PostGrid verification failed", err);
  }
};


 const handleSuggestionSelect = async (selected) => {
  setShowSuggestions(false);
  setHouse(selected.label);

  const parts = selected.label.trim().split(" ");
  const houseNum = parts.find((p) => /^\d/.test(p));
  const streetName = parts.slice(0, parts.indexOf(houseNum)).join(" ");
  const cityName = parts[parts.length - 1];

  setHiddenHouse(houseNum);
  setHiddenStreet(streetName);
  setHiddenCity(cityName);

  // 🔴 THIS IS THE MISSING STEP
  try {
    const body = new URLSearchParams({
      "address[line1]": `${streetName} ${houseNum}`,
      "address[postalOrZip]": postcode,
      "address[country]": countryISO[country] || "NL",
    });

    const res = await fetch("/api/postgrid/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const result = await res.json();

    if (result.success) {
      setHiddenState(result.data.provinceOrState); // ✅ THIS FIXES IT
      setHiddenCity(result.data.city || cityName);
    } else {
      alert("Address verification incomplete. Please reselect your address.");
    }
  } catch (err) {
    console.error("Verification failed", err);
  }
};



  const fetchCryptoCoins = async () => {
    try {
      const url = `https://prod2api.ezdash.online/api/v1/payment/stripe-publish-key?country=${country}&type=crypto`;
      const res = await fetch(url);
      const data = await res.json();
      const coins = (data?.data?.bitcoin_list || []).map((c) => c.code);
      setCryptoCoins(coins);
      setChosenCrypto(coins[0] || "");
      setShowCryptoDropdown(true);
    } catch {
      setCryptoCoins([]);
      setShowCryptoDropdown(false);
    }
  };

  // Checkout flow
  const startCheckout = async () => {

    const ezdashPhone = `${countryCode}${phone}`;

console.log("FINAL PHONE FOR EZDASH:", ezdashPhone);
if (!hiddenState) {
  alert("Address verification incomplete. Please reselect your address.");
  setLoading(false);
  return;
}


    if (!name || !email || !phone || !country || !postcode || !house) {
      alert("Please fill all required fields");
      return;
    }

    if (!hiddenStreet || !hiddenCity || !hiddenHouse) {
      alert("Please select a valid address from the suggestions");
      return;
    }

    if (!paymentMethod) {
      alert("Please select payment method");
      return;
    }

    setLoading(true);

    // WHATSAPP
if (paymentMethod === "whatsapp") {
  try {
const fixedCart = cart.map((item) => {
  const paid = item.paidQty || 0;
  const free = item.freeQty || 0;
  const unitPrice = item.offerData?.offerPrice || item.price;

const billingUnitPrice =
  paid + free > 0 ? (paid * unitPrice) / (paid + free) : unitPrice;

return {
  ...item,
  productId: item.productId || item._id || item.sku || item.slug,

  quantity: paid + free,  // admin sees total = 5
  paid_quantity: paid,    // actual paid items = 4
  free_quantity: free,    // free = 1

  price: billingUnitPrice,  // backend charges only for paid
  original_price: unitPrice, // show real price in UI
};

});



  const payload = {
  customer: {
    firstname: name,
    lastname: label,
    email,
    additional: addition,
    city: hiddenCity,
    state: hiddenState,

    house_no: hiddenHouse,
    street_name: `${hiddenStreet} ${hiddenHouse} ${postcode} ${hiddenCity}`,
    zip: postcode,

    phone: ezdashPhone, // ✅ THIS IS THE KEY FIX

    country_code: countryISO[country] || "NL",
    country,
    guest_ip: "",
    autoFill: "postgrid",
  },
  domain: "apotheek.com",
  success_url: `${window.location.origin}/checkout/whatsapp-success`,
  cancel_url: `${window.location.origin}/checkout`,
  currency: "EUR",
  order_notes: notes,
  products: fixedCart,
};

    localStorage.setItem("whatsapp_products", JSON.stringify(fixedCart));

    const res = await fetch(
      "https://test2.ezdash.online/api/v1/order/user/create?type=whatsapp",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();

    if (data?.success) {
      localStorage.setItem("whatsapp_order", JSON.stringify(data.data));
      window.location.href = "/checkout/whatsapp-success";
    } else alert(data.message);
  } catch {
    alert("WhatsApp payment failed");
  }

  setLoading(false);
  return;
}



    // CRYPTO
if (paymentMethod === "crypto") {
  if (!chosenCrypto) {
    alert("Please select a crypto coin");
    setLoading(false);
    return;
  }

  try {
    const fixedCart = cart.map((item) => ({
      ...item,
      productId: item.productId || item._id || item.sku || item.slug,
      quantity: item.paidQty || item.quantity || 1,
    }));

// normalize phone
const cleanPhone = phone.replace(/\D/g, "");
const cleanCode = countryCode.replace(/\D/g, "");
const ezdashPhone = `${cleanCode}${cleanPhone}`;

console.log("SENDING TO EZDASH:", ezdashPhone);

const countryISOMap = {
  Netherlands: "NL",
  Germany: "DE",
  Belgium: "BE",
  France: "FR",
  "United Kingdom": "GB",
  India: "IN",
};

const payload = {
  customer: {
    firstname: name,
    lastname: label,
    email,
    additional: addition,
    city: hiddenCity,
   state: hiddenState,

    house_no: hiddenHouse,
    street_name: `${hiddenStreet} ${hiddenHouse} ${postcode} ${hiddenCity}`,
    zip: postcode,

    phone: ezdashPhone, // ✅ FULL NUMBER (digits only)

    country_code: countryISOMap[country] || "NL",
    country,
    guest_ip: "",
    autoFill: "postgrid",
  },
  domain: "apotheek.com",
  success_url: `${window.location.origin}/checkout/whatsapp-success`,
  cancel_url: `${window.location.origin}/checkout`,
  currency: "EUR",
  order_notes: notes,
  products: fixedCart,
};



  const res = await fetch(
  "https://test2.ezdash.online/api/v1/order/user/create?type=crypto",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    mode: "cors",              // <— Firefox requires this
    credentials: "omit"        // <— required for Firefox cross-origin
  }
);

    const data = await res.json();
if (data?.success) {

  // IMPORTANT: Reset previous countdown timer for new payment
  localStorage.removeItem("crypto_start_time");

  localStorage.setItem(
    "crypto_order",
    JSON.stringify({
      newOrder: data?.data?.newOrder || data?.data?.order,
      cryptoPaymentResponse: data?.data?.cryptoPaymentResponse || data?.data?.crypto,
    })
  );

  setTimeout(() => {
    window.location.href = "/checkout/crypto-success";
  }, 400);
}

 else alert(data.message);
  } catch {
    alert("Crypto payment failed");
  }

  setLoading(false);
  return;
}




  };

  return (
    <>
      <Header />

      {cart.length === 0 ? (
        <div className="text-center py-32 text-gray-700 text-xl font-semibold">
          Your cart is empty.
          <div className="mt-6">
            <a href="/" className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800">
              Continue Shopping →
            </a>
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* LEFT */}
              <div className="lg:col-span-2 bg-white rounded-xl border p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Billing address</h2>

                {/* NAME + LABEL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input className="w-full border rounded-lg p-3" placeholder="First name *"
                    value={name} onChange={(e) => setName(e.target.value)} />
                  <input className="w-full border rounded-lg p-3" placeholder="Last name *"
                    value={label} onChange={(e) => setLabel(e.target.value)} />
                </div>

                {/* COUNTRY + ZIP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                  <select
                    className="w-full border rounded-lg p-3"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      setCountryCode(countryPhoneCodes[e.target.value]);
                    }}
                  >
                    {Object.keys(countryPhoneCodes).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <input placeholder="Postcode *" className="w-full border rounded-lg p-3"
                    value={postcode} onChange={(e) => setPostcode(e.target.value)} />
                </div>

                {/* HOUSE WITH SUGGESTIONS */}
                <div className="mt-5 relative">
                  <input
                    placeholder="House Number *"
                    className="w-full border rounded-lg p-3"
                    value={house}
                    onChange={(e) => {
                      const value = e.target.value;
                      setHouse(value);
                      setShowSuggestions(false);
                      clearTimeout(window._pg_timer);
                      window._pg_timer = setTimeout(() => fetchSuggestions(value), 300);
                    }}
                  />

                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute w-full bg-white border z-50 rounded shadow max-h-60 overflow-y-auto">
                      {suggestions.map((s, i) => (
                        <div
                          key={i}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSuggestionSelect(s)}
                        >
                          {s.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ADDITION */}
                <input
                  placeholder="Addition (optional)"
                  className="w-full border rounded-lg p-3 mt-5"
                  value={addition}
                  onChange={(e) => setAddition(e.target.value)}
                />

                {/* PHONE + EMAIL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                  <div className="flex">
                 <select
  className="border rounded-l-lg px-3 bg-gray-100"
  value={countryCode}
  onChange={(e) => setCountryCode(e.target.value)}
>
  {Object.entries(countryPhoneCodes).map(([country, code]) => (
    <option key={country} value={code}>
      +{code}
    </option>
  ))}
</select>


                 <input
  placeholder="Phone Number"
  className="w-full border rounded-r-lg p-3"
  value={phone}
  onChange={(e) => {
    // allow only digits
    const digits = e.target.value.replace(/\D/g, "");
    setPhone(digits);
  }}
/>

                  </div>

                  <input
                    placeholder="Email *"
                    className="w-full border rounded-lg p-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* NOTES */}
                <textarea
                  placeholder="Order notes (optional)"
                  className="w-full border rounded-lg p-3 mt-5 h-32"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* RIGHT — PAYMENT */}
              <div className="bg-white border rounded-xl p-6 shadow-sm h-fit">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>€{shippingCost.toFixed(2)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* PAYMENT METHODS */}
                <div className="mt-6 border p-4 rounded-xl bg-gray-50 text-sm space-y-3">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="radio"
                      checked={paymentMethod === "crypto"}
                      onChange={() => {
                        setPaymentMethod("crypto");
                        fetchCryptoCoins();
                      }}
                    />
                    Pay via Crypto
                  </label>

                  {paymentMethod === "crypto" && showCryptoDropdown && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">Select Crypto Coin</label>
                      <select
                        className="w-full border rounded-lg p-3"
                        value={chosenCrypto}
                        onChange={(e) => setChosenCrypto(e.target.value)}
                      >
                        {cryptoCoins.map((coin, i) => (
                          <option key={i} value={coin}>
                            {coin}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="radio"
                      checked={paymentMethod === "whatsapp"}
                      onChange={() => setPaymentMethod("whatsapp")}
                    />
                    Pay via WhatsApp
                  </label>
                </div>

                <button
                  onClick={startCheckout}
                  disabled={loading}
                  className="mt-5 w-full bg-green-700 text-white py-3 rounded-xl hover:bg-green-800"
                >
                  {loading ? "Processing..." : "Checkout →"}
                </button>
              </div>
            </div>

            {/* CART LIST */}
            <div className="mt-12 bg-white border rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Cart</h2>
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-start gap-4 pb-6 border-b">
                  <Image
  src={
    item.images?.[0] ||
    item.product_image ||
    item.image ||
    item.featured_image ||
    "/placeholder.jpg"
  }
  width={90}
  height={90}
  className="rounded-lg border"
  alt={item.name}
/>

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <span className="px-3 py-1 border rounded-lg text-sm">
                        Qty: {item.paidQty + item.freeQty}
                        {item.freeQty > 0 && (
                          <span className="text-green-700 font-semibold ml-2">
                            ({item.freeQty} Free)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="font-bold text-gray-800 text-lg">
                      €{((item.offerData?.offerPrice || item.price) * item.paidQty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

         {loading && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999]">
    <div className="bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md text-center animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="w-14 h-14 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800">Processing your payment…</h2>
      <p className="mt-3 text-gray-600 text-sm">
        Do not refresh or close this window. This may take a few seconds.
      </p>
    </div>
  </div>
)}
      <Footer />
    </>
  );
}
