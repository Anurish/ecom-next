import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";

export default function WhatsappSuccess() {
  const [order, setOrder] = useState(null);
  const [storedProducts, setStoredProducts] = useState([]);
  const { clearCart } = useCart();

  useEffect(() => {
    const savedOrder = localStorage.getItem("whatsapp_order");
    const savedCart = localStorage.getItem("whatsapp_products");

    if (savedOrder) setOrder(JSON.parse(savedOrder));
    if (savedCart) setStoredProducts(JSON.parse(savedCart));

    clearCart();
  }, [clearCart]);

  if (!order) {
    return (
      <>
        <Header />
        <div className="max-w-3xl mx-auto text-center py-20">
          <h2 className="text-xl font-semibold">Keine Bestelldaten gefunden</h2>
          <p className="text-gray-600 mt-2">
            Bitte schließen Sie die Bestellung erneut ab.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  const newOrder = order?.newOrder || order;
  const customer = order?.customer_details || {};
  const subtotal = newOrder?.subtotal ?? 0;
  const shipping = order?.shippingCost ?? 0;
  const total = newOrder?.totalPrice ?? subtotal + shipping;
  const orderDate = newOrder?.order_date
    ? new Date(newOrder.order_date).toLocaleString()
    : "N/A";

  const whatsappUrl = `https://wa.me/8875759505?text=Hallo, ich habe eine Bestellung abgeschlossen. Meine Bestellnummer ist ${newOrder?.order_id}`;
const whatsappSubtotal = storedProducts.reduce(
  (sum, item) =>
    sum + (item.original_price || item.price) * (item.paid_quantity || item.paidQty || 0),
  0
);

const whatsappTotal = whatsappSubtotal + shipping;

  return (
    <>
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-10 text-black">

        {/* Top success message */}
        <h2 className="text-center font-semibold text-xl">
          Vielen Dank für Ihren Einkauf bei uns. Wir haben Ihre Bestellung erhalten.
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Um Ihre Bestellung zu bestätigen, wenden Sie sich bitte an unser Support-Team.
        </p>

        {/* Confirm button */}
        <div className="text-center mt-6">
          <a
            href={whatsappUrl}
            target="_blank"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-lg rounded-lg font-semibold"
          >
            Bestellung bestätigen
          </a>
        </div>

        {/* Order meta bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-10 border-y py-5">
          <div>
            <p className="text-gray-500 text-sm">BESTELLNUMMER</p>
            <p className="font-bold">{newOrder?.order_id}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">DATUM</p>
            <p className="font-bold">{orderDate}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">GESAMT</p>
            <p className="font-bold">€{whatsappTotal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">ZAHLUNGSART</p>
            <p className="font-bold">Zahlung auf WhatsApp bestätigen</p>
          </div>
        </div>

        {/* Order details box */}
        <div className="bg-white shadow rounded-xl p-6 border mt-10">
          <h3 className="font-bold text-xl mb-6">Bestelldetails</h3>

          <table className="w-full text-sm">
            <tbody>
          {storedProducts.length > 0 &&
  storedProducts.map((item, index) => (
    <tr key={index} className="border-b">
      <td className="py-3">
        {item.name} × {item.paidQty + item.freeQty}
        {item.freeQty > 0 && (
          <span className="text-green-700 font-semibold"> ({item.freeQty} Free)</span>
        )}
      </td>
      <td className="text-right font-semibold">
      €{((item.original_price || item.price) * (item.paid_quantity || item.paidQty)).toFixed(2)}

      </td>
    </tr>
  ))}


              <tr>
                <td className="py-3 font-medium">Zwischensumme:</td>
                <td className="text-right font-medium">
                €{whatsappSubtotal.toFixed(2)}

                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium">Versandkosten:</td>
                <td className="text-right font-medium">
                  €{shipping.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium">Zahlungsart:</td>
                <td className="text-right font-medium">
                  Zahlung auf WhatsApp bestätigen
                </td>
              </tr>
              <tr>
                <td className="py-3 text-lg font-bold">Gesamt:</td>
                <td className="text-right text-lg font-bold">
                 <p className="font-bold">€{whatsappTotal.toFixed(2)}</p>

                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Address box */}
        <div className="bg-white shadow rounded-xl p-6 border mt-10">
          <h3 className="font-bold text-xl mb-6">Lieferadresse</h3>
          <p><strong>Name: </strong>{customer.firstname} {customer.lastname}</p>
          <p><strong>Hausnummer: </strong>{customer.house_no}</p>
          <p><strong>Straße: </strong>{customer.street_name}</p>
          <p><strong>Stadt: </strong>{customer.city}</p>
          {customer.state && (
            <p><strong>Zustand: </strong>{customer.state}</p>
          )}
          <p><strong>Land: </strong>{customer.country}</p>
          <p><strong>PLZ: </strong>{customer.zip}</p>
          <p className="mt-3"><strong>Kontaktnummer: </strong>+{customer.phone}</p>
        </div>
      </div>

      <Footer />
    </>
  );
}
