"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function HelpDesk() {
  return (
    <>
      <Header />

      {/* PAGE CONTAINER */}
      <div className="bg-white text-gray-800 pb-20">

        {/* TITLE SECTION */}
        <section className="max-w-6xl mx-auto text-center px-6 pt-12">
          <h1 className="text-xl font-semibold mb-2">Help with Ordering Medicines</h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Welcome to our Help Desk! You can use this if you have any concern on order status, shipment, payment or etc.<br />
            Here are some frequently asked questions to guide you.
          </p>
        </section>

        {/* HELP BOX */}
        <section className="max-w-6xl mx-auto px-6 mt-10">
          <div className="bg-white border rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center shadow-[0_0_20px_rgba(0,0,0,0.05)] gap-8">

            {/* LEFT SIDE TEXT */}
            <div className="max-w-md space-y-4">
              <h2 className="text-lg font-semibold">Need Help with orders</h2>
              <p className="text-sm text-gray-600">
                Welcome to our Help Desk! You can use this if you have any concern on order status, shipment, payment or etc.
                Here are some frequently asked questions to guide you.
              </p>
              <button className="bg-green-700 text-white font-medium text-sm py-2 px-6 rounded-md hover:bg-green-800 transition">
                Track Order
              </button>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <img
              src="/banner/export.png"
              alt="Truck"
              className="w-72 object-contain"
            />
          </div>
        </section>

      </div>

      <Footer />
    </>
  );
}
