"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Payments() {
  const payments = [
    { title: "How iDEAL work?", icon: "/icons/payments/ideal.png" },
    { title: "How Bancontact work?", icon: "/icons/payments/bancontact.png" },
    { title: "How Google pay work?", icon: "/icons/payments/googlepay.png" },
    { title: "How Apple pay work?", icon: "/icons/payments/applepay.png" },
    { title: "How Credit card work?", icon: "/icons/payments/creditcard.png" },
    { title: "How Crypto work?", icon: "/icons/payments/crypto.png" },
  ];

  return (
    <>
      <Header />

      <div className="bg-white text-gray-800 pb-20 px-6">
        {/* PAGE TITLE */}
        <section className="max-w-6xl mx-auto text-center pt-12">
          <h1 className="text-xl font-semibold mb-2">Payments</h1>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Here are various payment options that we support. Select any to learn more.
          </p>
        </section>

        {/* PAYMENT GRID */}
        <section className="max-w-6xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {payments.map((item, idx) => (
            <div
              key={idx}
              className="border rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.05)] bg-white flex items-start gap-4 cursor-pointer hover:shadow-md transition"
            >
              <img src={item.icon} alt={item.title} className="w-10 h-10 object-contain" />
              <div>
                <h2 className="font-medium text-sm mb-1">{item.title}</h2>
                <p className="text-xs text-gray-500">Lorem ipsum dolor sit amet consectetur.</p>
              </div>
            </div>
          ))}
        </section>
      </div>

      <Footer />
    </>
  );
}
