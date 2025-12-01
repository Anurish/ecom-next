export default function PaymentMethods() {
  const methods = [
    "iDeal",
    "Bancontact",
    "Apple Pay",
    "Google Pay",
    "Credit Card",
    "Crypto",
    "WhatsApp Pay"
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Pay your way – Fast, Secure & Flexible</h2>

      <div className="flex flex-wrap gap-4">
        {methods.map((m) => (
          <div
            key={m}
            className="px-6 py-3 border rounded-full bg-white shadow-sm text-sm font-medium"
          >
            {m}
          </div>
        ))}
      </div>
    </section>
  );
}
