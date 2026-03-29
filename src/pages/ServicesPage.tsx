import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Globe, Monitor, Smartphone, CheckCircle2, 
  ArrowRight, Zap, Code2, Layers, Star,
  MessageCircle, ChevronDown, Cpu
} from "lucide-react";
import { Link } from "react-router-dom";

type CustomService = {
  id: number;
  type: 'website' | 'desktop' | 'mobile';
  sort_order: number;
  is_active: boolean;
  name: { ar: string; en: string };
  tagline: { ar: string; en: string };
  description: { ar: string; en: string };
  price: { ar: string; en: string };
  features: { ar: string[]; en: string[] };
  techStack: { ar: string[]; en: string[] };
  mainImage: string;
};

const TYPE_META = {
  website: {
    icon: Globe,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    accent: 'text-blue-400',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dot: 'bg-blue-400',
    btn: 'bg-blue-500 hover:bg-blue-600',
  },
  desktop: {
    icon: Monitor,
    gradient: 'from-violet-500/20 to-purple-500/20',
    accent: 'text-violet-400',
    border: 'border-violet-500/30',
    glow: 'shadow-violet-500/20',
    badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    dot: 'bg-violet-400',
    btn: 'bg-violet-500 hover:bg-violet-600',
  },
  mobile: {
    icon: Smartphone,
    gradient: 'from-emerald-500/20 to-teal-500/20',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/20',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-400',
    btn: 'bg-emerald-500 hover:bg-emerald-600',
  },
};

const PROCESS_STEPS = (isAr: boolean) => [
  { icon: Star,     label: isAr ? "تحليل المتطلبات"  : "Requirements Analysis",  desc: isAr ? "نفهم احتياجاتك ونحدد أفضل حل"         : "We understand your needs and define the best solution" },
  { icon: Layers,   label: isAr ? "التصميم والتخطيط" : "Design & Planning",       desc: isAr ? "نصمم الواجهات ونضع خارطة الطريق"         : "We design interfaces and create the project roadmap" },
  { icon: Code2,    label: isAr ? "التطوير والبرمجة" : "Development",             desc: isAr ? "نبني المنتج بأحدث التقنيات وأفضل الممارسات" : "We build using the latest tech and best practices" },
  { icon: Zap,      label: isAr ? "الاختبار والتسليم" : "Testing & Delivery",     desc: isAr ? "نختبر كل شيء ونسلمك منتجاً متكاملاً"       : "Thorough testing and full handover with documentation" },
];

const ServicesPage = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [services, setServices] = useState<CustomService[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<string>("all");

  useEffect(() => {
    fetch("http://localhost:3001/api/services")
      .then(r => r.json())
      .then(data => setServices(Array.isArray(data) ? data.filter(s => s.is_active) : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeType === "all" ? services : services.filter(s => s.type === activeType);
  const whatsappNum = "201111536173";
  const whatsapp = (s: CustomService) => `https://wa.me/${whatsappNum}?text=${encodeURIComponent(isAr ? `مرحباً، أريد الاستفسار عن خدمة ${s.name.ar}` : `Hi, I'm interested in your ${s.name.en} service`)}`;

  return (
    <div className={`min-h-screen bg-background ${isAr ? "rtl" : "ltr"}`}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/3 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold mb-6">
              <Cpu className="w-4 h-4" />
              {isAr ? "خدمات التطوير المخصص" : "Custom Development Services"}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground leading-tight mb-6">
              {isAr ? (
                <><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">نبني</span> ما تحلم به</>
              ) : (
                <>We <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">Build</span> Your Vision</>
              )}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              {isAr
                ? "موقع ويب، تطبيق سطح مكتب، أو تطبيق جوال — نحول أفكارك إلى منتجات رقمية احترافية تتجاوز توقعاتك."
                : "Website, Desktop App, or Mobile App — we transform your ideas into professional digital products that exceed your expectations."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/${whatsappNum}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/30"
              >
                <MessageCircle className="w-5 h-5" />
                {isAr ? "ابدأ مشروعك الآن" : "Start Your Project"}
              </a>
              <a href="#services-list" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-border bg-card text-foreground font-semibold text-base hover:bg-muted transition-all">
                {isAr ? "استعرض خدماتنا" : "Explore Services"}
                <ChevronDown className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Floating service icons */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center justify-center gap-8 mt-16">
            {[
              { icon: Globe, label: isAr ? "مواقع ويب" : "Websites", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
              { icon: Monitor, label: isAr ? "برامج سطح المكتب" : "Desktop Apps", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
              { icon: Smartphone, label: isAr ? "تطبيقات الجوال" : "Mobile Apps", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className={`flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border ${color} backdrop-blur-sm`}>
                <Icon className="w-7 h-7" />
                <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Filter Tabs ── */}
      <section id="services-list" className="py-4 sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              { key: "all",     label: isAr ? "الكل"           : "All",          icon: Layers },
              { key: "website", label: isAr ? "مواقع الويب"    : "Websites",     icon: Globe },
              { key: "desktop", label: isAr ? "سطح المكتب"    : "Desktop Apps",  icon: Monitor },
              { key: "mobile",  label: isAr ? "تطبيقات الجوال" : "Mobile Apps",  icon: Smartphone },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveType(tab.key)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeType === tab.key
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Cards ── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              {isAr ? "جاري التحميل..." : "Loading..."}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">{isAr ? "لا توجد خدمات متاحة" : "No services available"}</div>
          ) : (
            <div className="space-y-16">
              {filtered.map((service, i) => {
                const meta = TYPE_META[service.type];
                const Icon = meta.icon;
                const isEven = i % 2 === 0;
                return (
                  <motion.article
                    key={service.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className={`rounded-3xl border ${meta.border} bg-card overflow-hidden shadow-xl ${meta.glow}`}
                  >
                    {/* Flex row — reverse on odd indices for alternating layout */}
                    <div className={`flex flex-col lg:flex-row ${!isEven ? "lg:flex-row-reverse" : ""}`}>

                      {/* Image — fixed width on desktop, full on mobile */}
                      <div className="relative w-full lg:w-[45%] flex-shrink-0 min-h-[260px] lg:min-h-[420px] overflow-hidden">
                        <img
                          src={service.mainImage || `https://placehold.co/800x500/1e293b/94a3b8?text=${service.name.en}`}
                          alt={service.name[lang as 'ar' | 'en']}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/800x500/1e293b/94a3b8?text=Service"; }}
                        />
                        {/* Gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} mix-blend-multiply`} />
                        {/* Type badge */}
                        <div className="absolute top-4 start-4">
                          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${meta.badge} text-xs font-bold backdrop-blur-sm bg-background/60`}>
                            <Icon className="w-3.5 h-3.5" />
                            {service.type === 'website' ? (isAr ? 'موقع ويب' : 'Website')
                              : service.type === 'desktop' ? (isAr ? 'سطح المكتب' : 'Desktop')
                              : (isAr ? 'جوال' : 'Mobile')}
                          </span>
                        </div>
                        {/* Price badge */}
                        <div className="absolute bottom-4 end-4">
                          <span className="px-4 py-2 rounded-2xl bg-black/60 text-white text-sm font-bold backdrop-blur-sm border border-white/10">
                            {service.price[lang as 'ar' | 'en']}
                          </span>
                        </div>
                      </div>

                      {/* Content — takes remaining space */}
                      <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
                        <div>
                          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.gradient} border ${meta.border} mb-5`}>
                            <Icon className={`w-7 h-7 ${meta.accent}`} />
                          </div>
                          <h2 className="text-2xl lg:text-3xl font-black text-foreground mb-3">
                            {service.name[lang as 'ar' | 'en']}
                          </h2>
                          <p className={`text-base font-semibold ${meta.accent} mb-4`}>
                            {service.tagline[lang as 'ar' | 'en']}
                          </p>
                          <p className="text-muted-foreground leading-relaxed mb-6">
                            {service.description[lang as 'ar' | 'en']}
                          </p>

                          {/* Features */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                            {(service.features[lang as 'ar' | 'en'] || []).map((feat, fi) => (
                              <div key={fi} className="flex items-center gap-2">
                                <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${meta.accent}`} />
                                <span className="text-sm text-foreground font-medium">{feat}</span>
                              </div>
                            ))}
                          </div>

                          {/* Tech Stack */}
                          {(service.techStack[lang as 'ar' | 'en'] || []).length > 0 && (
                            <div className="mb-6">
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{isAr ? "التقنيات المستخدمة" : "Tech Stack"}</p>
                              <div className="flex flex-wrap gap-2">
                                {(service.techStack[lang as 'ar' | 'en'] || []).map((tech, ti) => (
                                  <span key={ti} className={`px-3 py-1 rounded-lg text-xs font-semibold border ${meta.badge}`}>
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                          <a
                            href={whatsapp(service)}
                            target="_blank" rel="noopener noreferrer"
                            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-bold text-sm transition-all hover:scale-[1.02] shadow-lg ${meta.btn}`}
                          >
                            <MessageCircle className="w-4 h-4" />
                            {isAr ? "ابدأ الآن" : "Get Started"}
                          </a>
                          <Link
                            to="/#contact"
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border bg-background text-foreground font-semibold text-sm hover:bg-muted transition-all"
                          >
                            <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
                            {isAr ? "اطلب استشارة" : "Request Consultation"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-20 bg-muted/20 border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
              {isAr ? "كيف نعمل؟" : "Our Process"}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {isAr ? "منهجية عمل واضحة ومجربة نضمن من خلالها تسليمك منتجاً يتجاوز توقعاتك." : "A clear, proven workflow that guarantees delivery of a product that exceeds your expectations."}
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS(isAr).map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <div className="absolute -top-3 -start-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-black shadow-md">
                  {i + 1}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{step.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/80 via-primary to-blue-600 p-12 text-center shadow-2xl shadow-primary/30"
          >
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                {isAr ? "جاهز لبناء مشروعك؟" : "Ready to Build Your Project?"}
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                {isAr ? "تواصل معنا اليوم ونبدأ تحويل فكرتك إلى واقع رقمي." : "Contact us today and let's turn your idea into a digital reality."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`https://wa.me/${whatsappNum}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-black hover:bg-white/90 transition-all hover:scale-105 shadow-xl"
                >
                  <MessageCircle className="w-5 h-5" />
                  {isAr ? "تواصل عبر واتساب" : "WhatsApp Us"}
                </a>
                <Link
                  to="/#contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/40 bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
                >
                  {isAr ? "راسلنا عبر النموذج" : "Send Us a Message"}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
