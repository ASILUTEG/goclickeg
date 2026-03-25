import { useLanguage } from "@/contexts/LanguageContext";
import { Network, Code2, Link, Cpu, Database, Share2, Server, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const IntegrationsMarquee = () => {
  const { lang, t } = useLanguage();
  const isAr = lang === "ar";

  const integrations = [
    { id: "1", label: isAr ? "نظام نفيس (NPHIES)" : "NPHIES System", icon: Network },
    { id: "2", label: isAr ? "معايير HL7" : "HL7 Standards", icon: Code2 },
    { id: "3", label: isAr ? "واجهات FHIR" : "FHIR API", icon: Link },
    { id: "4", label: isAr ? "أجهزة الأشعة DICOM" : "DICOM Imaging", icon: Cpu },
    { id: "5", label: isAr ? "أنظمة ERP (Odoo/SAP)" : "ERP Systems", icon: Database },
    { id: "6", label: isAr ? "واتساب للأعمال" : "WhatsApp API", icon: Share2 },
    { id: "7", label: isAr ? "ربط أجهزة التحاليل" : "Lab Analyzers", icon: Server },
    { id: "8", label: isAr ? "بوابات الدفع" : "Payment Gateways", icon: ShieldCheck },
  ];

  // We duplicate the array to create a seamless infinite scrolling effect
  const marqueeItems = [...integrations, ...integrations];

  return (
    <section className="py-16 bg-muted/30 overflow-hidden border-y border-border">
      <div className="container mx-auto px-4 mb-10 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
          {isAr ? "يتكامل بسلاسة مع منظومتك الطبية" : "Seamlessly Integrates With Your Ecosystem"}
        </h2>
        <p className="text-muted-foreground">
          {isAr 
            ? "نحن ندعم أقوى المعايير العالمية والأنظمة المحلية لضمان سير العمل بمرونة."
            : "We support the top global standards and local systems to ensure flexible workflows."}
        </p>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative flex overflow-hidden w-full group">
        {/* Left Gradient Fade */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

        {/* The scrolling track */}
        <motion.div 
          className="flex gap-6 w-max items-center"
          animate={{ 
            x: isAr ? ["0%", "50%"] : ["0%", "-50%"] 
          }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 35, // Adjust speed (higher is slower)
          }}
        >
          {marqueeItems.map((item, idx) => (
            <div 
              key={`${item.id}-${idx}`} 
              className="flex items-center gap-3 bg-card border border-border shadow-sm px-6 py-4 rounded-2xl min-w-48 hover:border-primary/50 hover:shadow-md transition-all cursor-default"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="font-bold text-foreground text-sm whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Right Gradient Fade */}
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
};

export default IntegrationsMarquee;
