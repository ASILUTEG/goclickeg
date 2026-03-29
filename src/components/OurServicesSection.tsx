import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Globe, Monitor, Smartphone, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

type ServicePreview = {
  id: number;
  type: 'website' | 'desktop' | 'mobile';
  name: { ar: string; en: string };
  tagline: { ar: string; en: string };
  description: { ar: string; en: string };
  price: { ar: string; en: string };
  features: { ar: string[]; en: string[] };
  mainImage: string;
};

const TYPE_CONFIG = {
  website: {
    icon: Globe,
    gradient: "from-blue-500 to-cyan-500",
    softBg: "bg-blue-500/10",
    softText: "text-blue-400",
    border: "border-blue-500/20",
    checkColor: "text-blue-400",
    glowColor: "shadow-blue-500/10",
  },
  desktop: {
    icon: Monitor,
    gradient: "from-violet-500 to-purple-500",
    softBg: "bg-violet-500/10",
    softText: "text-violet-400",
    border: "border-violet-500/20",
    checkColor: "text-violet-400",
    glowColor: "shadow-violet-500/10",
  },
  mobile: {
    icon: Smartphone,
    gradient: "from-emerald-500 to-teal-500",
    softBg: "bg-emerald-500/10",
    softText: "text-emerald-400",
    border: "border-emerald-500/20",
    checkColor: "text-emerald-400",
    glowColor: "shadow-emerald-500/10",
  },
};

const OurServicesSection = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [services, setServices] = useState<ServicePreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/services")
      .then(r => r.json())
      .then(data => setServices(Array.isArray(data) ? data.filter((s: any) => s.is_active).slice(0, 3) : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && services.length === 0) return null;

  return (
    <section id="our-services" className="py-24 bg-muted/10 border-y border-border relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            {isAr ? "خدمات التطوير المخصص" : "Custom Development"}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            {isAr ? "نبني ما تحتاجه" : "We Build What You Need"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {isAr
              ? "من مواقع الويب إلى تطبيقات الجوال وبرامج سطح المكتب — نحول أفكارك إلى منتجات رقمية احترافية."
              : "From websites to mobile apps and desktop software — we turn your ideas into professional digital products."}
          </p>
        </motion.div>

        {/* Service Cards */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-muted-foreground">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            {isAr ? "جاري التحميل..." : "Loading..."}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {services.map((service, i) => {
              const cfg = TYPE_CONFIG[service.type] || TYPE_CONFIG.website;
              const Icon = cfg.icon;
              const featureList = (service.features[lang as 'ar' | 'en'] || []).slice(0, 4);

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`group relative bg-card border ${cfg.border} rounded-2xl overflow-hidden hover:shadow-xl ${cfg.glowColor} transition-all duration-300 hover:-translate-y-1 flex flex-col`}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={service.mainImage || "https://placehold.co/600x400/1e293b/94a3b8?text=Service"}
                      alt={service.name[lang as 'ar' | 'en']}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/600x400/1e293b/94a3b8?text=Service"; }}
                    />
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent`} />
                    {/* Type pill */}
                    <div className="absolute top-3 start-3">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${cfg.softBg} ${cfg.softText} border ${cfg.border} text-xs font-bold backdrop-blur-sm`}>
                        <Icon className="w-3 h-3" />
                        {service.type === 'website' ? (isAr ? 'موقع ويب' : 'Website')
                          : service.type === 'desktop' ? (isAr ? 'سطح المكتب' : 'Desktop')
                          : (isAr ? 'جوال' : 'Mobile')}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Icon + Title */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br ${cfg.gradient} shadow-md`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-foreground text-base leading-tight">
                          {service.name[lang as 'ar' | 'en']}
                        </h3>
                        <p className={`text-xs font-semibold ${cfg.softText} mt-0.5`}>
                          {service.tagline[lang as 'ar' | 'en']}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                      {service.description[lang as 'ar' | 'en']}
                    </p>

                    {/* Features */}
                    <ul className="space-y-1.5 mb-5 flex-1">
                      {featureList.map((feat, fi) => (
                        <li key={fi} className="flex items-center gap-2">
                          <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${cfg.checkColor}`} />
                          <span className="text-xs text-foreground/80 font-medium">{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                      <span className={`text-sm font-bold ${cfg.softText}`}>
                        {service.price[lang as 'ar' | 'en']}
                      </span>
                      <Link
                        to="/services"
                        className={`flex items-center gap-1.5 text-xs font-bold ${cfg.softText} hover:underline`}
                      >
                        {isAr ? "اكتشف المزيد" : "Learn More"}
                        <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
          >
            {isAr ? "استعرض جميع الخدمات" : "View All Services"}
            <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default OurServicesSection;
