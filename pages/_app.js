// pages/_app.js
import "../styles/globals.css";              // Tailwind
import "../styles/animation.css";           // <-- Add animation CSS
import { CartProvider } from "../context/CartContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      {/* Global container for flying image animation */}
      <div id="fly-container"></div>

      <Component {...pageProps} />
    </CartProvider>
  );
}
