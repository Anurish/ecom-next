import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";


export default function Offers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();


  const fetchOffers = async () => {
    try {
  const res = await fetch(
  "https://test2.ezdash.online/api/v1/product/available/list?limit=500&searchKey=&country=Netherlands&category=",
  {
    headers: {
      Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzQ5YTE4YTcwOWI1MzM3MDA2ZThlODQiLCJlbWFpbCI6InN1cGVyYWRtaW5AeW9wbWFpbC5jb20iLCJmdWxsbmFtZSI6IlN1cGVyIEFkbWluIiwicm9sZSI6IlN1cGVyQWRtaW4iLCJpYXQiOjE3NjQ2NTI4NzUsImV4cCI6MTc2NDczOTI3NX0.BLOSGsp6beO1BHYVdDYwxOaRcvgZEHbkjK_O1f_VlH0`,
    
    }
  }
);


      const data = await res.json();

      // Debug logs
      console.log("FULL API RESPONSE:", data);
      console.log("DATA FIELD:", data?.data);

      // Smart extraction (covers every API format variation)
      const extracted =
        data?.data?.data ||           // format 1
        data?.data?.products ||       // format 2
        data?.data ||                 // format 3
        [];

      console.log("EXTRACTED PRODUCTS COUNT:", extracted.length);

      setProducts(extracted);
      setLoading(false);
    } catch (err) {
      console.error("Error loading offer products:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-4 mt-10">
        <h2 className="text-2xl font-bold mb-6">Top Angebote</h2>

        {loading ? (
          <p className="text-center text-gray-600 py-20">Laden...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            Keine Angebote verfügbar.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 pb-20">
            {products.map((item, index) => (
            <div
  key={index}
 className="border rounded-lg p-3 hover:shadow-md bg-white flex flex-col h-full"

>
<div onClick={() => (window.location.href = `/product/${item.productId}`)} className="cursor-pointer">
                {/* Image */}
               <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
  
  {/* OFFER BADGE */}
  {item?.offerData?.combination?.buy && item?.offerData?.combination?.get && (
    <div className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-md">
      {item.offerData.combination.buy} + {item.offerData.combination.get} GRATIS
    </div>
  )}

  <img
    src={item.image}
    className="object-contain w-full h-full"
    alt={item.name}
  />
</div>




                {/* Title */}
                <h3 className="text-sm font-semibold mt-3 line-clamp-2 min-h-[40px]">
                  {item.name}
                </h3>
                </div>

                {/* Offer info (if available) */}
                {item?.offerData?.title && (
                  <p className="text-xs text-green-700 font-semibold mt-1">
                    {item.offerData.title}
                  </p>
                )}

                {/* Pricing */}
                <div className="mt-2">
                  <p className="text-lg font-bold text-green-700">
                    € {item?.offerData?.offerPrice ?? item.price}
                  </p>

                  {item?.offerData?.combination?.buy && item?.offerData?.combination?.get && (
                    <p className="text-[11px] text-gray-500 font-medium">
                      Buy {item.offerData.combination.buy} get {item.offerData.combination.get} free
                    </p>
                  )}
                </div>

                <button
onClick={() => {
  let qtyToAdd = 1;

  const buy = item?.offerData?.combination?.buy;
  const get = item?.offerData?.combination?.get;

  // If offer exists
  if (buy && get) {
    const currentQty = Number(item.quantity || 0); // already in cart if present
    const newQty = currentQty + 1;

    // If user just reached offer threshold
    if (newQty % buy === 0) {
      qtyToAdd = 1 + get; // 1 paid + free units
    }
  }

  addToCart({
    ...item,
    quantity: qtyToAdd,
    key: item.sku || item._id || item.slug || item.productId,
    offerData: item.offerData || null
  });
}}


  className="mt-auto w-full bg-red-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition"

>
  In den Warenkorb
</button>

              </div>
            ))}
          </div>
        )}
      </div>
      {/* EXCLUSIVE OFFER INFO BLOCK */}
<div className="max-w-7xl mx-auto px-4 mt-16">
  <h2 className="text-2xl font-bold text-gray-800 mb-4">
    Exklusive Angebote für Medikamente – Kaufen Sie zu den besten Preisen!
  </h2>

  <p className="text-gray-700 leading-relaxed">
    Unsere Online-Angebote für Medikamente. Suchen Sie nach preiswerten Medikamenten?
    Suchen Sie nach preiswerten Medikamenten hoher Qualität? Dann sind Sie mit unseren
    exklusiven Angeboten auf der sicheren Seite.
  </p>

  <p className="text-gray-700 leading-relaxed mt-4">
    Wir haben die besten Preise für alle Ihre Gesundheitsbedürfnisse, von verschreibungspflichtigen Medikamenten über
    Schmerzmittel, Schlafmittel und mehr – garantiert preisgünstig kombiniert mit einem schnellen und pünktlichen
    Lieferservice bis zu Ihrer Haustür.
  </p>

  <p className="text-gray-700 leading-relaxed mt-4">
    Verpassen Sie nicht unsere Angebote. Besuchen Sie unsere Angebotsseite, um unsere aktuellen Sonderangebote für
    ausgewählte Medikamente zu entdecken:
    <br />– <strong>4 + 1 Gratisangebot</strong> – bestellen Sie 4 x gleiche Medikamente und erhalten Sie 1 Stück kostenlos!
    <br />– <strong>8 + 2 Kostenlos-Angebot</strong> – bestellen Sie 8 x gleiche Medikamente und erhalten Sie 2 weitere kostenfrei.
    <br />*Dieses exklusive Angebot gilt ausschließlich für Produkte auf der Angebotsseite. Profitieren Sie jetzt,
    solange der Vorrat reicht – exklusive Angebote für verschreibungspflichtige Medikamente.
  </p>

  <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-3">So nutzen Sie unsere Angebote</h3>
  <ul className="list-disc pl-6 text-gray-700 space-y-2">
    <li><strong>Wählen Sie Ihr Produkt:</strong> Besuchen Sie die Angebotsseite und wählen Sie Ihre Medikamente aus.</li>
    <li><strong>Hinzufügen:</strong> Geben Sie die Anzahl ein und fügen Sie die Produkte Ihrem Warenkorb hinzu.</li>
    <li><strong>Bezahlen:</strong> Sicher bezahlen mit iDeal, Bancontact, Apple Pay, Google Pay, Kreditkarte oder Bitcoin.</li>
    <li><strong>Empfangen:</strong> Diskrete, Geld-zurück-Lieferung direkt bis zu Ihrer Haustür.</li>
  </ul>

  <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-3">Ihre Vorteile</h3>
  <ul className="list-disc pl-6 text-gray-700 space-y-2">
    <li>Reduzierte Kosten durch Preisvorteile für eine Vielzahl von Medikamenten.</li>
    <li>Schnelle, sichere und diskrete Lieferung in neutraler Verpackung.</li>
    <li>Einfachste Bestellung ohne Hindernisse und wenigen Schritten.</li>
    <li>24/7 kompetenter Kundensupport bei Fragen oder Problemen.</li>
    <li>Garantierter Qualitätsanspruch durch vertrauenswürdige Hersteller.</li>
    <li>Flexible Versandformen – Sie bestimmen selbst, wie geliefert wird.</li>
    <li>Unlimitiertes Angebot – bestellen Sie ohne Stückbegrenzung mit Sonderkonditionen.</li>
  </ul>
</div>

   {/* DELIVERY BANNER (PRESERVED) */}
       <div className="max-w-7xl mx-auto px-4 mt-20 py-16">

          <div className="bg-[#FFEED9] rounded-xl overflow-hidden flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/3">
              <img 
                src="/banner/delivery-bg.png" 
                alt="delivery banner" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full md:w-2/3 p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-800 leading-snug">
                WE DELIVER MEDICINES TO NETHERLANDS, BELGIUM,
                FRANCE, GERMANY AND MORE
              </h2>

              <p className="text-gray-700 mt-4 text-sm md:text-base">
                Pay with | iDEAL | Bancontact | Apple Pay | Google Pay | Credit Card | Crypto | WhatsApp Contact
              </p>
            </div>
          </div>
        </div>
      <Footer />
    </>
  );
}
