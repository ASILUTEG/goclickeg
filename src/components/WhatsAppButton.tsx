import { useState } from "react";
import { MessageCircle, X, Building2, Stethoscope, FlaskConical, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, t } = useLanguage();
  const isAr = lang === "ar";
  
  const whatsappNumber = "201111536173";

  const options = [
    {
      id: "lab",
      icon: FlaskConical,
      label: isAr ? "أدير معملاً طبياً" : "I manage a Lab",
      message: isAr
        ? "مرحباً GoClick 👋، أرغب في معرفة المزيد عن نظام (GoLab) لإدارة المعامل."
        : "Hello GoClick 👋, I'm interested in learning more about GoLab."
    },
    {
      id: "clinic",
      icon: Stethoscope,
      label: isAr ? "أدير عيادة / مجمع طبي" : "I manage a Clinic",
      message: isAr
        ? "مرحباً GoClick 👋، أرغب في معرفة المزيد عن نظام (GoClinic) لإدارة العيادات."
        : "Hello GoClick 👋, I'm interested in learning more about GoClinic."
    },
    {
      id: "hospital",
      icon: Building2,
      label: isAr ? "أدير مستشفى" : "I manage a Hospital",
      message: isAr
        ? "مرحباً GoClick 👋، نحن نمثل مستشفى ونرغب في مناقشة حلول (GoHospital)."
        : "Hello GoClick 👋, we represent a hospital and want to discuss GoHospital solutions."
    },
    {
      id: "general",
      icon: HelpCircle,
      label: isAr ? "استفسار عام" : "General Inquiry",
      message: isAr
        ? "مرحباً GoClick 👋، لدي استفسار عام حول خدماتكم."
        : "Hello GoClick 👋, I have a general inquiry about your services."
    }
  ];

  const handleOptionClick = (msg: string) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 end-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
            className={`mb-4 bg-background border border-border shadow-2xl rounded-2xl w-[320px] max-w-[calc(100vw-3rem)] overflow-hidden flex flex-col`}
            style={{ transformOrigin: isAr ? "bottom left" : "bottom right" }}
          >
            {/* Header */}
            <div className="bg-[hsl(142,70%,45%)] p-4 text-white flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-base leading-tight">
                  {isAr ? "مرحباً بك في GoClick 👋" : "Welcome to GoClick 👋"}
                </h4>
                <p className="text-white/80 text-xs mt-0.5">
                  {isAr ? "كيف يمكننا مساعدتك اليوم؟" : "How can we help you today?"}
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 bg-card flex flex-col gap-2">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                {isAr ? "اختر ما يناسبك للحصول على استشارة أسرع:" : "Choose an option for faster assistance:"}
              </p>
              
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleOptionClick(opt.message)}
                  className="flex items-center gap-3 w-full p-3 text-start rounded-xl border border-border hover:border-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,45%)]/5 transition group"
                >
                  <div className="bg-muted group-hover:bg-[hsl(142,70%,45%)]/10 text-muted-foreground group-hover:text-[hsl(142,70%,45%)] rounded-lg p-2 transition">
                    <opt.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-foreground group-hover:text-[hsl(142,70%,45%)] transition">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
            
            {/* Footer */}
            <div className="p-3 bg-muted/40 border-t border-border text-center">
              <p className="text-[10px] text-muted-foreground">
                {isAr ? "نرد عادةً خلال دقائق" : "We usually reply in a few minutes"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform ${
          isOpen ? "bg-muted text-foreground" : "bg-[hsl(142,70%,45%)] text-white animate-pulse-glow hover:scale-110"
        }`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        title={isAr ? "الدعم الفني عبر واتساب" : "WhatsApp Support"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
      </motion.button>
    </div>
  );
};

export default WhatsAppButton;
