import useSWR from "swr";
import ProductCard from "./ProductCard";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function BestSelling() {
  const { data, error } = useSWR("/api/local-best-selling", fetcher);

  if (error) return <div>Failed to load products</div>;
  if (!data) return <div>Loading best-selling medicines...</div>;

  const products = (data?.products || []).slice(0, 4);


  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Best Selling Medicines</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </section>
  );
}
