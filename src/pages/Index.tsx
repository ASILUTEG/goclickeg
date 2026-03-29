import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ProductsSection from "@/components/ProductsSection";
import ROICalculator from "@/components/ROICalculator";
import PartnersSection from "@/components/PartnersSection";
import IntegrationsMarquee from "@/components/IntegrationsMarquee";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import OurServicesSection from "@/components/OurServicesSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ProductsSection />
      <OurServicesSection />
      <ROICalculator />
      <IntegrationsMarquee />
      <PartnersSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
