import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t pt-14 relative overflow-hidden">

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* LEFT SECTION */}
        <div>
          <img 
            src="/Arztschlaf-png.webp" 
            alt="Apotheek247" 
            className="w-48 mb-6 -ml-2"
          />

          <h3 className="font-semibold text-lg mb-3">
            Arztschlaf.com: Your Online Health Partner
          </h3>

          <p className="text-gray-600 leading-relaxed max-w-xl">
            In a world where health and wellness are more important than ever, 
            DoctorPharma.org is positioning itself as a key player in meeting 
            your OTC medication needs in France. With an intuitive interface, 
            a wide range of products, and a commitment to quality and safety, 
            we offer an exceptional user experience.
          </p>
        </div>

        {/* RIGHT SECTION – LINKS */}
       <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-gray-700">

  <div className="space-y-3">
    <Link href="/">
      <p className="font-semibold cursor-pointer hover:text-red-500">Home</p>
    </Link>

    <Link href="/category/painkiller">
      <p className="font-semibold cursor-pointer hover:text-red-500">Pain killers</p>
    </Link>

    <Link href="/privacy-policy">
      <p className="font-semibold cursor-pointer hover:text-red-500">Privacy Policy</p>
    </Link>
  </div>

  <div className="space-y-3">
    <Link href="/category/sleep-disorder">
      <p className="font-semibold cursor-pointer hover:text-red-500">Sleeping pills</p>
    </Link>

    <Link href="/category/stimulants">
      <p className="font-semibold cursor-pointer hover:text-red-500">Stimulants</p>
    </Link>

    <Link href="/category/erection-pills">
      <p className="font-semibold cursor-pointer hover:text-red-500">Erection pills</p>
    </Link>

    <Link href="/cookies">
      <p className="font-semibold cursor-pointer hover:text-red-500">Cookies</p>
    </Link>
  </div>

  <div className="space-y-3">
    <Link href="/blogs">
      <p className="font-semibold cursor-pointer hover:text-red-500">Blogs</p>
    </Link>

    <Link href="/offers">
      <p className="font-semibold cursor-pointer hover:text-red-500">Offers</p>
    </Link>

    <Link href="/about-us">
      <p className="font-semibold cursor-pointer hover:text-red-500">About us</p>
    </Link>
  </div>

</div>


      </div>

      {/* WAVE BACKGROUND + COPYRIGHT */}
{/* WAVE + COPYRIGHT + FLOWER  */}
<div className="relative w-full mt-20">
  {/* Wave strip */}
  <img
    src="/footer-wave.png"
    alt="wave"
    className="w-full h-[110px] object-cover"
  />

  {/* Flower on right */}
  <img
    src="/footer-flower.png"
    alt="flower"
    className="absolute right-6 bottom-0 w-[120px] opacity-70 pointer-events-none"
  />

  {/* Copyright */}
  <p className="absolute bottom-6 inset-x-0 text-center text-gray-600 text-sm">
    © 2025 All rights reserved
  </p>
</div>




    </footer>
  );
}
