

export default function CategoryCard({ icon, title, index = 0 }) {
  return (
    <div
      className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border
                 cursor-pointer shadow-card hover:shadow-lg transition
                 category-animate"
     style={{ animationDelay: `${index * 180}ms` }}

    >
      {icon}
      <p className="font-medium text-gray-700">{title}</p>
    </div>
  );
}
