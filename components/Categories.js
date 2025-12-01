import Image from "next/image";
import CategoryCard from "./CategoryCard";

export default function Categories() {
  const categories = [
    {
      title: "Sleep Disorder",
      icon: "/icons/categories/fi_2829069.png",
    },
    {
      title: "Painkiller",
      icon: "/icons/categories/fi_1497064.png",
    },
    {
      title: "Antibiotics",
      icon: "/icons/categories/fi_2873052.png",
    },
    {
      title: "Stimulants",
      icon: "/icons/categories/fi_10688616.png",
    },
    {
      title: "Erection Pills",
      icon: "/icons/categories/fi_384331.png",
    },
  ];

  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 my-16">
      
      {/* SECTION TITLE */}
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-10">
        Explore Our Range of Medicines
      </h2>

      {/* CATEGORY GRID */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.title}
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
        ))}
      </div>

    </div>
  );
}
