"use client";
import WhyChooseUs from "../../components/WhyChooseUs";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AboutUs() {
  return (
    <>
      <Header />

      <div className="bg-white text-gray-800">

        {/* Hero strip */}
<section className="relative w-full max-w-6xl mx-auto bg-[#E2F4FF] border-b px-6 py-8 min-h-[170px] flex justify-between items-center rounded-xl mt-4 overflow-visible">
  <div className="max-w-2xl">
    <h1 className="text-2xl font-semibold leading-snug text-[#008C8C]">
      We strive to make healthcare clear, <br />
      accessible, and affordable for everyone.
    </h1>
  </div>

<img
  src="/banner/doctor.png"
  alt="Doctor"
  className="w-72 object-contain absolute right-6 transform translate-y-[15px] z-20"
/>


</section>





        {/* MAIN 2-COLUMN BLOCK: left (about/vision/why) + right (featured) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto px-6 py-10">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-10">

            {/* About Docterpharma */}
            <div>
              <h2 className="text-xl font-semibold mb-2">About Docterpharma.org</h2>
              <p className="text-sm leading-6">
                Welcome to docterpharma.org! We are a modern online pharmacy specializing in providing
                high-quality to our customers in Germany. Our goal is to simplify access to medications,
                streamline the purchasing process, and provide excellent service that meets the needs of
                our customers.
              </p>
            </div>

            {/* Our Vision */}
            <div className="border rounded-md p-6 bg-[#fafafa] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold mb-1">Our Vision</h2>
                <p className="text-sm">
                  To become the most trusted digital healthcare partner in every home — simplifying the path
                  to better health for millions of people.
                </p>
              </div>
              {/* Replace this with your exact arrow image */}
              <img
                src="/banner/Arrows.png"
                alt="Vision"
                className="w-32 sm:w-40 object-contain"
              />
            </div>

            {/* Why Choose Us */}
            <div className="border rounded-md p-6">
              <h2 className="text-lg font-semibold mb-4">Why choose us</h2>

              <p className="text-sm mb-6">
                Welcome to docterpharma.org! We are a modern online pharmacy specializing in providing
                high-quality to our customers in Germany. Our goal is to simplify access to medications,
                streamline the purchasing process, and provide excellent service that meets the needs of
                our customers.
              </p>

              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    {/* Red round icon */}
                    <div className="flex-shrink-0">
                      {/* If you have an icon, use <img src="/assets/red-check.png" ... /> instead */}
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                        {/* • */}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Lorem ipsum</h3>
                      <p className="text-xs leading-5 opacity-80">
                        To become the most trusted digital healthcare partner in every home —
                        simplifying the path to better health for millions of people.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – Featured Articles */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Featured articles</h2>

            {[1, 2, 3].map((i) => (
              <article
                key={i}
                className="bg-white rounded-2xl border shadow-sm overflow-hidden cursor-pointer"
              >
                {/* article image */}
                <img
                  src="/assets/article.png"
                  alt="Article"
                  className="w-full h-32 object-cover"
                />
                <div className="p-3 space-y-1">
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>5 min read</span>
                    <span>12/04/2025</span>
                  </div>
                  <p className="text-sm font-semibold leading-5">
                    Dexamphetamine and Other Stimulants: What You Need to Know Before Using
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* What we do – full width under both columns */}
        <section className="px-6 pb-10 max-w-6xl mx-auto">
          <h2 className="text-lg font-semibold mb-3">What We Do</h2>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>Online Pharmacy</li>
            <li>Clinically tested medicines</li>
            <li>Fast deliveries from the comfort of your home</li>
            <li>Expert consultation for issues &amp; disorders</li>
            <li>Track &amp; support features</li>
          </ul>
        </section>

        {/* Quote */}
        <section className="px-6 py-12 flex justify-center">
          <div className="bg-white border rounded-lg p-8 text-center max-w-2xl shadow-sm">
            <p className="text-base leading-7">
              “Lorem ipsum dolor sit amet consectetur. Vestibulum natoque risus vestibulum ultrices
              faucibus sed. Fringilla pharetra purus eget massa aliquam vel. Tempus integer quam vitae
              netus adipiscing.”
            </p>
          </div>
        </section>

        {/* Customer ratings */}
        <section className="bg-[#E3FAFF] py-12">
          <h2 className="text-lg font-semibold text-center mb-8">
            What Customers are saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-md p-4 shadow-sm text-sm">
                <div className="text-orange-500 mb-2">★★★★★</div>
                <p className="font-semibold">Lorem ipsum dolor sit amet</p>
                <p>Best online medical store</p>
                <p className="text-xs mt-2 opacity-80">
                  — Ankita, Satisfied Customer
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer icons */}
    <WhyChooseUs />
      </div>

      <Footer />
    </>
  );
}
