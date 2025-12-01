import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import ProductCard from "../../components/ProductCard";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CategoryPage({ page, rawCategorySlug }) {
  const router = useRouter();

  const CATEGORY_MAP = {
    "sleeping-pills": "Sleeping pills",
    "sleeping pills": "Sleeping pills",
    "painkiller": "Painkiller",
    "antibiotics": "Antibiotics",
    "stimulants": "Stimulants",
    "erection-pills": "Erection Pills",
  };

  const readableCategory =
    CATEGORY_MAP[rawCategorySlug.toLowerCase()] || rawCategorySlug;

  // Fetch products client-side
  const { data } = useSWR(
    `/api/ezdash/category?category=${readableCategory}&page=${page}&limit=12`,
    fetcher
  );

  const products =
    Array.isArray(data?.products) && data?.products.length > 0
      ? data.products
      : [];

  const totalPages = data?.pages || 1;

  const categories = [
    "Sleeping pills",
    "Painkiller",
    "Antibiotics",
    "Stimulants",
    "Erection Pills",
  ];

  const categoryIcons = {
    "Sleeping pills": "/icons/categories/fi_2829069.png",
    "Painkiller": "/icons/categories/fi_1497064.png",
    "Antibiotics": "/icons/categories/fi_2873052.png",
    "Stimulants": "/icons/categories/fi_10688616.png",
    "Erection Pills": "/icons/categories/fi_384331.png",
  };

  return (
    <>
      <Header />

      <div className="w-full bg-white pb-20">

        {/* CATEGORY ICONS */}
        <div className="max-w-7xl mx-auto px-4 pt-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((cat, index) => {
              const url = `/category/${cat.replace(/ /g, "-")}`;
              return (
                <Link key={index} href={url}>
                  <div
                    className={`flex flex-col items-center gap-3 p-6 border rounded-xl cursor-pointer transition ${
                      cat === readableCategory
                        ? "bg-red-50 border-red-300 shadow-md"
                        : "bg-white shadow-sm hover:shadow-lg"
                    }`}
                  >
                    <img
                      src={categoryIcons[cat]}
                      alt={cat}
                      className="w-12 h-12 object-contain"
                    />
                    <p className="text-sm font-medium text-gray-700">{cat}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* TITLE */}
        <div className="max-w-7xl mx-auto px-4 mt-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Order {readableCategory} Medicines Online
          </h1>

          <p className="mt-4 text-gray-600 leading-relaxed">
            Find trustworthy and effective {readableCategory} medicines available
            for fast and secure delivery across Europe.
          </p>

          <p className="mt-4 text-gray-600 leading-relaxed">
            Simply browse, add to cart, and checkout with secure payment options.
          </p>
        </div>

        {/* PRODUCT GRID */}
        <div className="max-w-7xl mx-auto px-4 mt-10">
          {!data && (
            <p className="text-center py-10 text-gray-500">Loading products...</p>
          )}

          {data && products.length === 0 && (
            <p className="text-gray-500">No products found in this category.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((prod) => (
              <ProductCard key={prod._id} product={prod} showAddToCart />
            ))}
          </div>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="max-w-7xl mx-auto px-4 mt-14 flex justify-center">
            <div className="flex gap-3">
              {/* Prev */}
              <button
                disabled={page <= 1}
                onClick={() =>
                  router.push(`/category/${rawCategorySlug}?page=${page - 1}`)
                }
                className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() =>
                    router.push(`/category/${rawCategorySlug}?page=${i + 1}`)
                  }
                  className={`px-4 py-2 border rounded-lg ${
                    page === i + 1
                      ? "bg-red-500 text-white"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {/* Next */}
              <button
                disabled={page >= totalPages}
                onClick={() =>
                  router.push(`/category/${rawCategorySlug}?page=${page + 1}`)
                }
                className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* DELIVERY BANNER */}
        <div className="max-w-7xl mx-auto px-4 mt-20">
          <div className="bg-[#FFEED9] rounded-xl overflow-hidden flex flex-col md:flex-row items-center">
            <img
              src="/banner/delivery-bg.png"
              alt="delivery banner"
              className="w-full md:w-1/3 object-cover"
            />
            <div className="w-full md:w-2/3 p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-800 leading-snug">
                WE DELIVER MEDICINES TO NETHERLANDS, BELGIUM, FRANCE, GERMANY AND MORE
              </h2>
              <p className="text-gray-700 mt-4 text-sm md:text-base">
                Pay with | iDEAL | Bancontact | Apple Pay | Google Pay | Credit Card | Crypto | WhatsApp Contact
              </p>
            </div>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="bg-[#FDEEDC] py-16 mt-20 rounded-xl max-w-6xl mx-auto px-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex justify-center">
              <img
                src="/faq/faq-brain.png"
                alt="FAQ Illustration"
                className="w-72 md:w-80 object-contain"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  "Can I buy prescription medicines without a prescription?",
                  "Do you ship internationally?",
                  "Are your medicines authentic?",
                  "How long does delivery take?",
                  "Which payment methods do you support?",
                  "Is my payment information safe?",
                  "Do you offer customer support on WhatsApp?",
                ].map((q, idx) => (
                  <details
                    key={idx}
                    className="bg-white rounded-xl px-5 py-4 shadow-sm border cursor-pointer"
                  >
                    <summary className="font-medium text-gray-800 flex justify-between items-center">
                      {q} <span className="text-xl font-bold text-gray-500">+</span>
                    </summary>
                    <p className="mt-3 text-gray-600 text-sm">
                      Yes, we provide safe and reliable delivery for all orders.
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

/* ======================================================
   ✔ No more heavy SSR payload
   ✔ Faster load & navigation
====================================================== */
export async function getServerSideProps({ params, query }) {
  const page = Number(query.page) || 1;

  return {
    props: {
      rawCategorySlug: params.category,
      page,
    },
  };
}
