// CategoryCard.js - will be filled with full production UI in next step
export default function CategoryCard({ icon, title }) {
  return (
    <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-card border cursor-pointer hover:shadow-lg transition">
      {icon}
      <p className="font-medium text-gray-700">{title}</p>
    </div>
  );
}
