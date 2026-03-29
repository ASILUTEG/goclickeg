import { useState } from "react";
import { MessageCircle, X, Building2, Stethoscope, FlaskConical, HelpCircle, Globe, Monitor, Smartphone, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const whatsappNumber = "201111536173";

  const PRODUCTS = [
    {
      id: "lab",
      icon: FlaskConical,
      color: "text-blue-400 bg-blue-500/10 group-hover:bg-blue-500/20 group-hover:text-blue-400",
      label: isAr ? "أدارة معملاً طبياً" : "I manage a Lab",
      message: isAr
        ? "مرحباً GoClick 👋، أرغب في معرفة المزيد عن نظام (GoLab) لإدارة المعامل."
        : "Hello GoClick 👋, I'm interested in learning more about GoLab.",
    },
    {
      id: "clinic",
      icon: Stethoscope,
      color: "text-secondary bg-secondary/10 group-hover:bg-secondary/20 group-hover:text-secondary",
      label: isAr ? "أدارة عيادة / مجمع طبي" : "I manage a Clinic",
      message: isAr
        ? "مرحباً GoClick 👋، أرغب في معرفة المزيد عن نظام (GoClinic) لإدارة العيادات."
        : "Hello GoClick 👋, I'm interested in learning more about GoClinic.",
    },
    {
      id: "hospital",
      icon: Building2,
      color: "text-accent-foreground bg-accent/20 group-hover:bg-accent/30 group-hover:text-foreground",
      label: isAr ? "أدارة مستشفى" : "I manage a Hospital",
      message: isAr
        ? "مرحباً GoClick 👋، نحن نمثل مستشفى ونرغب في مناقشة حلول (GoHospital)."
        : "Hello GoClick 👋, we represent a hospital and want to discuss GoHospital solutions.",
    },
    {
      id: "general",
      icon: HelpCircle,
      color: "text-muted-foreground bg-muted group-hover:bg-muted/80 group-hover:text-foreground",
      label: isAr ? "استفسار عام" : "General Inquiry",
      message: isAr
        ? "مرحباً GoClick 👋، لدي استفسار عام حول خدماتكم."
        : "Hello GoClick 👋, I have a general inquiry about your services.",
    },
  ];

  const DEV_SERVICES = [
    {
      id: "website-dev",
      icon: Globe,
      color: "text-blue-400 bg-blue-500/10 group-hover:bg-blue-500/20 group-hover:text-blue-400",
      label: isAr ? "تطوير موقع ويب" : "Website Development",
      message: isAr
        ? "مرحباً GoClick 👋، أرغب في الاستفسار عن خدمة تطوير مواقع الويب."
        : "Hello GoClick 👋, I'm interested in your Website Development service.",
    },
    {
      id: "desktop-dev",
      icon: Monitor,
      color: "text-violet-400 bg-violet-500/10 group-hover:bg-violet-500/20 group-hover:text-violet-400",
      label: isAr ? "تطوير تطبيق سطح مكتب" : "Desktop App Development",
      message: isAr
        ? "مرحباً GoClick 👋، أرغب في الاستفسار عن خدمة تطوير تطبيقات سطح المكتب."
        : "Hello GoClick 👋, I'm interested in your Desktop App Development service.",
    },
    {
      id: "mobile-dev",
      icon: Smartphone,
      color: "text-emerald-400 bg-emerald-500/10 group-hover:bg-emerald-500/20 group-hover:text-emerald-400",
      label: isAr ? "تطوير تطبيق جوال" : "Mobile App Development",
      message: isAr
        ? "مرحباً GoClick 👋، أرغب في الاستفسار عن خدمة تطوير تطبيقات الجوال."
        : "Hello GoClick 👋, I'm interested in your Mobile App Development service.",
    },
  ];

  const handleOptionClick = (msg: string) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const OptionBtn = ({ opt }: { opt: typeof PRODUCTS[number] }) => (
    <button
      key={opt.id}
      onClick={() => handleOptionClick(opt.message)}
      className="flex items-center gap-3 w-full p-2.5 text-start rounded-xl border border-transparent hover:border-[hsl(142,70%,45%)]/30 hover:bg-[hsl(142,70%,45%)]/5 transition group"
    >
      <div className={`flex-shrink-0 rounded-lg p-1.5 transition ${opt.color}`}>
        <opt.icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-semibold text-foreground group-hover:text-[hsl(142,70%,45%)] transition leading-snug">
        {opt.label}
      </span>
    </button>
  );

  return (
    <div className="fixed bottom-6 end-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
            className="mb-4 bg-background border border-border shadow-2xl rounded-2xl w-[340px] max-w-[calc(100vw-3rem)] overflow-hidden flex flex-col"
            style={{ transformOrigin: isAr ? "bottom left" : "bottom right" }}
          >
            {/* Header */}
            <div className="bg-[hsl(142,70%,45%)] p-4 text-white flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-base leading-tight">
                  {isAr ? "مرحباً بك في GoClick 👋" : "Welcome to GoClick 👋"}
                </h4>
                <p className="text-white/80 text-xs mt-0.5">
                  {isAr ? "كيف يمكننا مساعدتك اليوم؟" : "How can we help you today?"}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto max-h-[70vh]">
              {/* Products Group */}
              <div className="p-3 pb-0">
                <div className="flex items-center gap-2 px-1 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {isAr ? "أنظمة إدارة طبية" : "Medical Systems"}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="flex flex-col gap-0.5">
                  {PRODUCTS.map((opt) => <OptionBtn key={opt.id} opt={opt} />)}
                </div>
              </div>

              {/* Divider */}
              <div className="px-3 my-2">
                <div className="border-t border-border" />
              </div>

              {/* Dev Services Group */}
              <div className="p-3 pt-0 pb-3">
                <div className="flex items-center gap-2 px-1 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {isAr ? "خدمات التطوير البرمجي" : "Development Services"}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="flex flex-col gap-0.5">
                  {DEV_SERVICES.map((opt) => <OptionBtn key={opt.id} opt={opt} />)}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-muted/40 border-t border-border text-center">
              <p className="text-[10px] text-muted-foreground">
                {isAr ? "نرد عادةً خلال دقائق ✅" : "We usually reply in a few minutes ✅"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all ${
          isOpen
            ? "bg-muted text-foreground scale-95"
            : "bg-[hsl(142,70%,45%)] text-white hover:scale-110 animate-pulse-glow"
        }`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        title={isAr ? "الدعم الفني عبر واتساب" : "WhatsApp Support"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="w-7 h-7" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default WhatsAppButton;
