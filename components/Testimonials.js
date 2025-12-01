"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Testimonials() {
  const reviews = [
    { name: "Oliver K.", text: "Excellent service and fast delivery. Highly recommended!" },
    { name: "Marta D.", text: "The medicines were genuine and arrived on time. Great prices too." },
    { name: "Jonas W.", text: "Very smooth ordering process and secure payment options." },
    { name: "Alicia F.", text: "I will definitely order again. Process was simple and smooth." },
    { name: "Alicia F.", text: "I will definitely order again. Process was simple and smooth." },
  ];

  return (
    <section
      className="relative w-screen left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] bg-[#FFEBEC] py-8 overflow-hidden"
    >
      {/* LEFT decorative image - moved UP */}
      <img
        src="/uploads/left.png"
        className="hidden md:block absolute left-0 bottom-[60px]  w-[200px] opacity-70 pointer-events-none"
        alt=""
      />

      {/* RIGHT decorative image (unchanged) */}
      <img
        src="/uploads/right.png"
        className="hidden md:block absolute right-0 bottom-[-40px] w-[260px] opacity-70 pointer-events-none"
        alt=""
      />

      <h2 className="text-center text-[22px] font-semibold mb-12">
        What Customers are saying
      </h2>

      <div className="max-w-[1350px] mx-auto px-6 relative">
    <Swiper
  modules={[Autoplay, Pagination]}
  autoplay={{ delay: 2600 }}
  pagination={{ clickable: true, el: ".custom-swiper-pagination" }}
  loop
  spaceBetween={30}
  slidesPerView={1}
  breakpoints={{
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
    1350: { slidesPerView: 4 },
  }}
>

          {reviews.map((r, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white p-7 rounded-2xl shadow-sm text-center">
                <div className="flex justify-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-orange-500 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">{r.text}</p>
                <p className="text-sm font-semibold text-gray-900">
                  — {r.name}, apotheek customer
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
