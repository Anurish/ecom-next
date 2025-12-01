export default function WhyChooseUs() {
  const items = [
  {
  title: "Safe & Reliable",
  subtitle: "",
  text: "Lorem ipsum dolor sit amet consectetur.",
  iconBg: "bg-[#FFF2E9]",
  icon: "/icons/why/safe.png",
  size: "w-24 h-24", // <-- increased size
},

    {
      title: "International shipments",
      subtitle: "",
      text: "Lorem ipsum dolor sit amet consectetur.",
      iconBg: "bg-[#FFF2E9]",
      icon: "/icons/why/international.png",
    },
    {
      title: "WhatsApp Customer Service",
      subtitle: "",
      text: "Lorem ipsum dolor sit amet consectetur.",
      iconBg: "bg-[#FFECEC]",
      icon: "/icons/why/whatsapp.png",
    },
  ];

  return (
    <section className="my-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`p-8 rounded-xl ${item.iconBg} border border-red-100 text-center`}
          >
            {/* CUSTOM IMAGE ICON */}
            <div className="mb-4 flex justify-center">
              <img
                src={item.icon}
                alt={item.title}
                className="w-20 h-16 object-contain"
              />
            </div>

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-red-600">{item.title}</h2>

            {/* OPTIONAL SUBTITLE */}
            {item.subtitle && (
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {item.subtitle}
              </p>
            )}

            {/* DESCRIPTION */}
            <p className="text-gray-600 text-sm mt-3">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
