import Header from "../components/Header";
import HeroBanner from "../components/HeroBanner";
import Categories from "../components/Categories";
import BestSelling from "../components/BestSelling";
import PaymentMethods from "../components/PaymentMethods";
import WhyChooseUs from "../components/WhyChooseUs";
import LongInfoText from "../components/LongInfoText";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroBanner />

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <Categories />
      </div>

      {/* Best Selling Medicines */}
      <div className="max-w-7xl mx-auto px-4 mt-14">
        <BestSelling />
      </div>

      {/* Payment Methods */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <PaymentMethods />
      </div>

      {/* Why Choose Us */}
      <div className="max-w-7xl mx-auto px-4 mt-20">
        <WhyChooseUs />
      </div>

      {/* Long SEO Info Text */}
      <div className="max-w-7xl mx-auto px-4 mt-20">
        <LongInfoText />
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 mt-20">
        <Testimonials />
      </div>

      {/* Footer */}
      <div className="mt-0">
        <Footer />
      </div>
    </div>
  );
}
