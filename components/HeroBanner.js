import Image from "next/image";
import Link from "next/link";


export default function HeroBanner() {
  return (
    <section className="w-full py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-[#FFF5F1] rounded-2xl flex flex-col md:flex-row items-center justify-between px-8 py-10 shadow-sm">

          {/* LEFT SECTION */}
          <div className="flex flex-col gap-3 max-w-md">
            <h2 className="text-3xl md:text-4xl font-bold text-[#B91919]">
              4+1 Offer on medicines
            </h2>

            <p className="text-gray-700 text-sm leading-relaxed">
              Buy 4 medicines and get 1 more free.<br />
              Order now and save big!
            </p>
          </div>

        <div className="flex justify-center w-full md:w-auto mt-6 md:mt-0">
  <Link href="/offers">
    <button className="bg-[#B91919] text-white px-8 py-3 rounded-full font-semibold shadow-md hover:bg-[#9d1414] transition">
      View Offer
    </button>
  </Link>
</div>


        {/* RIGHT IMAGE */}
<div className="hidden md:block -mt-10">
  <Image
    src="/hero/offer-pack.png"
    width={250}
    height={180}
    alt="medicine offer"
    className="object-contain"
  />
</div>

        </div>
      </div>
    </section>
  );
}
