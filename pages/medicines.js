import useSWR from "swr";
import ProductCard from "../components/ProductCard";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Medicines() {
  const { data, error } = useSWR("/api/ezdash/category?category=${readableCategory}&page=${pageNumber}&limit=12", fetcher);


  if (error) return <div>Error loading medicines</div>;
  if (!data) return <div className='p-10 text-center'>Loading medicines...</div>;

  const products = Array.isArray(data) ? data : data?.products || [];

  return (
    <div className="w-full bg-white pb-20">

      {/* TOP CATEGORY BAR */}
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            "Sleep Disorder",
            "Painkiller",
            "Antibiotics",
            "Stimulants",
            "Erection Pills"
          ].map((cat, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 p-6 border rounded-xl bg-white shadow-sm hover:shadow-lg transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <p className="text-sm font-medium text-gray-700">{cat}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PAGE HEADING */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <h1 className="text-3xl font-bold text-gray-900">Medicines</h1>
        <p className="mt-4 text-gray-600 leading-relaxed">
          Order medicines easily, safely, and with fast home delivery. 
          We offer a wide range of approved medicines from trusted providers.
        </p>
      </div>

      {/* PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.length === 0 && (
            <p>No products found.</p>
          )}

          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="max-w-7xl mx-auto px-4 mt-14 flex justify-center">
        <div className="flex gap-3">
          <button className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">
            Prev
          </button>
          <button className="px-4 py-2 border rounded-lg bg-red-500 text-white">
            1
          </button>
          <button className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">
            2
          </button>
          <button className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">
            3
          </button>
          <button className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-7xl mx-auto px-4 mt-20">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

        <div className="space-y-4">
          {[
            "Can I buy medicines without a prescription?",
            "Do you ship internationally?",
            "Are your medicines authentic?",
            "How long does delivery take?",
            "What payment methods do you support?"
          ].map((q, idx) => (
            <details
              key={idx}
              className="border rounded-lg p-4 bg-white shadow-sm cursor-pointer"
            >
              <summary className="font-semibold text-gray-700">{q}</summary>
              <p className="mt-2 text-gray-600 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
