import Image from "next/image";
import CategoryCard from "./CategoryCard";
import Link from "next/link";

export default function Categories() {
const categories = [
  {
    title: "Sleep Disorder",
    slug: "Sleeping-pills",
    icon: "/icons/categories/fi_2829069.png",
  },
  {
    title: "Painkiller",
    slug: "Painkiller",
    icon: "/icons/categories/fi_1497064.png",
  },
  {
    title: "Antibiotics",
    slug: "Antibiotics",
    icon: "/icons/categories/fi_2873052.png",
  },
  {
    title: "Stimulants",
    slug: "Stimulants",
    icon: "/icons/categories/fi_10688616.png",
  },
  {
    title: "Erection Pills",
    slug: "Erection-Pills",
    icon: "/icons/categories/fi_384331.png",
  },
];

  
  return (
     <div className="w-full max-w-7xl mx-auto px-4 my-16">
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-10">
        Explore Our Range of Medicines
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="block"
          >
            <CategoryCard
              title={cat.title}
              icon={
                <Image
                  src={cat.icon}
                  alt={cat.title}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              }
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
