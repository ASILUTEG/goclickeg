import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProducts } from "@/contexts/ProductContext";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ShieldCheck, Star, Users } from "lucide-react";

const Partners = () => {
  const { lang } = useLanguage();
  const { products } = useProducts();
  const isAr = lang === "ar";

  // Create "All" filter pseudo-ID
  const ALL_FILTER = "ALL";
  const [activeFilter, setActiveFilter] = useState<string>(ALL_FILTER);

  // Flatten all partners and attach source product info
  const allPartners = useMemo(() => {
    return products.flatMap((product) => 
      (product.partners || []).map((partner, index) => ({
        ...partner,
        id: `${product.slug}-partner-${index}`,
        productId: product.slug,
        productName: product.name,
      }))
    );
  }, [products]);

  // Derived filtered partners
  const filteredPartners = useMemo(() => {
    if (activeFilter === ALL_FILTER) return allPartners;
    return allPartners.filter(p => p.productId === activeFilter);
  }, [allPartners, activeFilter]);

  // Extract all success stories (testimonials) for the spotlight
  const allSuccessStories = useMemo(() => {
    return products.flatMap((product) => 
      (product.success || []).map((review, index) => ({
        ...review,
        id: `${product.slug}-review-${index}`,
        productId: product.slug,
        productName: product.name,
      }))
    );
  }, [products]);

  // Filtered success stories
  const filteredStories = useMemo(() => {
    if (activeFilter === ALL_FILTER) return allSuccessStories;
    return allSuccessStories.filter(s => s.productId === activeFilter);
  }, [allSuccessStories, activeFilter]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Dedicated Hero Wrapper */}
        <section className="relative bg-zinc-950 text-white overflow-hidden py-24 border-b border-zinc-900">
          <div className="absolute inset-0 z-0">
            {/* Pulsing grid background effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm font-medium mb-6 backdrop-blur-md"
            >
              <Users className="w-4 h-4 text-primary" />
              {isAr ? "شركاء النجاح" : "Our Partners"}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight drop-shadow-sm"
            >
              {isAr ? "نُمكّن الرواد في" : "Empowering the Pioneers in"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{isAr ? "الرعاية الصحية" : "Healthcare"}</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed"
            >
              {isAr 
                ? "تثق بنا مئات المعامل، العيادات والمستشفيات يومياً لقيادة تحولهم الرقمي وتقديم رعاية أفضل للمرضى."
                : "Hundreds of labs, clinics, and hospitals trust us daily to drive their digital transformation and deliver better patient care."}
            </motion.p>
          </div>
        </section>

        {/* Smart Filter Section */}
        <section className="py-12 bg-background relative z-20">
          <div className="container mx-auto px-4">
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              <button
                onClick={() => setActiveFilter(ALL_FILTER)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeFilter === ALL_FILTER
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border"
                }`}
              >
                {isAr ? "جميع الشركاء" : "All Partners"}
              </button>
              
              {products.map(product => (
                <button
                  key={product.slug}
                  onClick={() => setActiveFilter(product.slug)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    activeFilter === product.slug
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border"
                  }`}
                >
                  {product.name[lang as 'ar' | 'en']} {isAr ? "العملاء" : "Clients"}
                </button>
              ))}
            </div>

            {/* Logo Grid */}
            {filteredPartners.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl mx-auto"
              >
                <AnimatePresence mode="popLayout">
                  {filteredPartners.map((partner) => (
                    <motion.div
                      layout
                      key={partner.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="group bg-card rounded-3xl border border-border shadow-sm flex flex-col overflow-hidden relative card-elevated transition-colors hover:border-primary/50"
                    >
                      {/* Image Area */}
                      <div className="p-6 md:p-8 aspect-[4/3] bg-muted/10 relative flex items-center justify-center border-b border-border/50">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <img 
                          src={partner.imageSrc} 
                          alt={partner.title[lang as 'ar' | 'en']}
                          className="w-full h-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110 relative z-10"
                        />
                      </div>
                      
                      {/* Data Area (Below Photo) */}
                      <div className="p-5 flex flex-col items-center text-center bg-card z-20 mt-auto">
                        <h4 className="font-bold text-foreground text-sm md:text-base mb-1 group-hover:text-primary transition-colors">
                          {partner.title[lang as 'ar' | 'en'] || (isAr ? "شريكنا" : "Our Partner")}
                        </h4>
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[1.5rem]">
                          {partner.subtitle[lang as 'ar' | 'en']}
                        </p>
                        <span className="text-[10px] md:text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md mt-auto">
                          {partner.productName[lang as 'ar' | 'en']}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-20 text-muted-foreground flex flex-col items-center justify-center">
                <Building2 className="w-16 h-16 opacity-20 mb-4" />
                <p className="text-lg font-medium">
                  {isAr ? "لا يوجد شركاء في هذا القسم حالياً." : "No partners found in this category yet."}
                </p>
              </div>
            )}
            
          </div>
        </section>

        {/* Partner Spotlight Success Stories */}
        {filteredStories.length > 0 && (
          <section className="py-20 bg-muted/30 border-t border-border mt-auto">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold text-sm mb-4">
                  <Star className="w-4 h-4 fill-secondary" />
                  {isAr ? "قصص نجاح العملاء" : "Partner Spotlight"}
                </div>
                <h3 className="text-3xl font-extrabold text-foreground">
                  {isAr ? "ماذا يقول شركاؤنا؟" : "What Our Partners Say"}
                </h3>
              </div>

              <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <AnimatePresence>
                  {filteredStories.map((story) => (
                    <motion.div
                      layout
                      key={story.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-card p-8 rounded-3xl border border-border shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors"
                    >
                      <ShieldCheck className="absolute top-6 end-6 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
                      <div className="flex gap-1 mb-6">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className="w-4 h-4 text-secondary fill-secondary" />
                        ))}
                      </div>
                      <p className="text-foreground font-medium text-lg leading-relaxed mb-8 relative z-10">
                        "{story.quote[lang as 'ar' | 'en']}"
                      </p>
                      <div className="flex items-center gap-4 mt-auto">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-pulse-glow">
                          <span className="text-primary font-bold text-lg">
                            {story.name[lang as 'ar' | 'en'].charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-foreground">
                            {story.name[lang as 'ar' | 'en']}
                          </div>
                          <div className="text-xs text-muted-foreground font-medium flex gap-2 items-center">
                            <span>{story.title?.[lang as 'ar' | 'en']}</span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="text-primary">{story.productName[lang as 'ar' | 'en']}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Partners;
