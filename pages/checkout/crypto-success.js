import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function CryptoSuccess() {
  const [order, setOrder] = useState(null);
  const [qr, setQr] = useState("");
  const [status, setStatus] = useState("waiting");
  const [timeLeft, setTimeLeft] = useState(null);
  const [copied, setCopied] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);


  useEffect(() => {
    let interval;
    let timer;

    // If order in localStorage does NOT match current payment ID → reset timer completely
const saved = localStorage.getItem("crypto_order");


if (!saved) {
  setTimeout(() => {
    const retry = localStorage.getItem("crypto_order");
    if (retry) setOrder(JSON.parse(retry));
  }, 500);
  return;
}


    const obj = JSON.parse(saved);
   const newOrder = obj?.order || obj?.newOrder;
const crypto = obj?.cryptoPayment || obj?.cryptoPaymentResponse || obj?.payment;

    if (!newOrder || !crypto) return;

    // ----- TIMER RESTORE / CREATE START TIME -----
    let startTime = localStorage.getItem("crypto_start_time");
    if (!startTime) {
      startTime = Date.now();
      localStorage.setItem("crypto_start_time", startTime);
    }

    const timePassed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
    const remaining = 1800 - timePassed;

    if (remaining <= 0) {
  setStatus("expired");
  setTimeLeft(0);
  return;   // <-- stop here, do NOT remove start time
}
 else {
      setTimeLeft(remaining);
    }

    // Set order object
   const formatted = {
  orderId: newOrder.order_id,
  createdAt: newOrder.createdAt,
  totalEur: crypto.price_amount,
  payAddress: crypto.pay_address,
  payAmount: crypto.pay_amount,
  payCurrency: crypto.pay_currency,
  paymentId: crypto.payment_id,
};

    setOrder(formatted);

    // ---- Load QR ----
    const loadQr = async () => {
      try {
        const res = await fetch(
          `https://test2.ezdash.online/api/v1/payment/now-payment/${crypto.payment_id}`
        );
        const data = await res.json();
        setQr(
          data?.data?.qr_code ||
            `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${crypto.pay_address}`
        );
      } catch {
        setQr(
          `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${crypto.pay_address}`
        );
      }
    };
    loadQr();

    // ---- POLL STATUS ----
const checkStatus = async () => {
  try {
    const res = await fetch(
      `https://test2.ezdash.online/api/v1/payment/now-payment/${crypto.payment_id}`
    );
    const data = await res.json();

    console.log("Payment status response:", data?.data?.payment_status); // <-- LOG HERE

    setStatus(data?.data?.payment_status || "waiting");

  if (data?.data?.payment_status === "finished") {
  clearInterval(interval);
  clearInterval(timer);
  setPaymentSuccess(true);       // <─ show success popup
  setStatus("finished");
  localStorage.removeItem("crypto_start_time");
  return;
}

    if (data?.data?.payment_status === "expired") {
      clearInterval(interval);
      clearInterval(timer);
      setStatus("expired");
      localStorage.removeItem("crypto_start_time");
      return;
    }

  } catch (error) {
    console.error("Payment status check failed:", error);
  }
};


    checkStatus();
    interval = setInterval(checkStatus, 15000);

    // ---- Countdown ----
    timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t === null) return t;
     if (t <= 1) {
  clearInterval(interval);
  clearInterval(timer);
  setStatus("expired");
  return 0; // do NOT remove start time here
}

        return t - 1;
      });
    }, 1000);

    return () => {
      interval && clearInterval(interval);
      timer && clearInterval(timer);
    };
  }, []);

const copyAddress = () => {
  if (!order?.payAddress) return;
  navigator.clipboard.writeText(order.payAddress);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};


  if (!order) {
    return (
      <>
        <Header />
        <div className="text-center py-32 text-xl font-semibold">
          No order was found.
          <div className="mt-6">
            <a href="/" className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800">
              Return to shop →
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Title */}
        <div className="border rounded-xl p-6 shadow-sm bg-[#c7e3df] text-center text-2xl font-semibold">
          Warten auf Anzahlung
        </div>

        <div className="text-center text-lg font-semibold mt-4">
          Zahlungszeit: {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 text-center border rounded-xl p-6 my-6 shadow-sm bg-white">
          <div>
            <div className="text-gray-500 text-sm">Bestellnummer:</div>
            <div className="font-semibold">{order.orderId}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Erstellungszeit:</div>
            <div className="font-semibold">{new Date(order.createdAt).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">GESAMT:</div>
            <div className="font-semibold">{order.payAmount} {order.payCurrency.toUpperCase()}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Zahlungsmethode</div>
            <div className="font-semibold text-green-700">CRYPTO</div>
          </div>
        </div>

        {/* Payment */}
        <div className="border rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Senden Sie an die folgende Adresse:</h2>

          <div className="flex items-center border rounded-lg p-3 text-sm justify-between bg-gray-50">
            <span className="truncate text-gray-800">{order.payAddress}</span>
            <button onClick={copyAddress} className="text-blue-600 font-medium">
              Kopieren
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-700 text-sm">Bezahlbetrag:</p>
              <p className="font-bold text-xl">
                {order.payAmount} {order.payCurrency.toUpperCase()}
              </p>
            </div>

           <div className="flex justify-center md:justify-end pr-4 md:pr-8 mt-6 md:mt-10">

              {qr ? (
                <div className="relative group flex justify-center">
                  <img src={qr} alt="QR Code" className="w-52 h-52 border rounded-lg cursor-pointer" />
                  <div className="absolute bottom-full mb-3 bg-black text-white text-xs px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition">
                    {order.payAddress}?amount={order.payAmount}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">QR loading...</p>
              )}
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-16 px-4 gap-6">
          {[
            { label: "Warten auf Anzahlung", icon: "/steps/save-money.svg", active: status !== "waiting" ? false : true },
            { label: "Warten auf Bestätigungen", icon: "/steps/Waiting.svg", active: status === "confirming" || status === "finished" },
            { label: "Erhalten", icon: "/steps/Verified.svg", active: status === "finished" },
            { label: "Ihre Bestellung wird in Kürze verpackt", icon: "/steps/fi_17768781.svg", active: status === "finished" }
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all ${
                  step.active
                    ? "border-green-600 bg-green-600 animate-pulse ring-4 ring-green-300"
                    : "border-gray-300 bg-gray-100 opacity-30"
                }`}
              >
                <img src={step.icon} className="w-8 h-8" alt="step" />
              </div>
              <p className={`mt-2 text-sm ${step.active ? "font-bold text-green-700" : "text-gray-700"}`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="/" className="text-green-700 font-semibold hover:underline">
            Zurück zur Startseite →
          </a>
        </div>
      </div>

      {status === "expired" && (
        <div className="text-center mt-10">
          <p className="text-red-600 font-semibold mb-3">Zeit abgelaufen – Zahlung nicht empfangen.</p>
          <button
            onClick={() => {
              localStorage.removeItem("crypto_order");
              localStorage.removeItem("crypto_start_time");
              window.location.href = "/checkout";
            }}
            className="bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800"
          >
            Zahlung erneut versuchen
          </button>
        </div>
      )}

 {paymentSuccess && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-sm w-full animate-scaleIn">
      <img src="/steps/Verified.svg" className="w-20 h-20 mx-auto mb-3" alt="success" />
      <h2 className="text-2xl font-semibold text-green-700 mb-2">
        Zahlung erfolgreich
      </h2>
      <p className="text-gray-600 mb-6">
        Ihre Zahlung wurde bestätigt. Ihre Bestellung wird nun verpackt.
      </p>

      <button
        onClick={() => (window.location.href = "/order-complete")}
        className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 w-full"
      >
        Weiter
      </button>
    </div>
  </div>
)}


     <Footer />

{copied && (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-green-700 text-white text-sm font-semibold rounded-lg shadow-lg animate-toast pointer-events-none z-[999999]">
    Adresse kopiert
  </div>
)}

    </>
  );
}
