import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Users, Building2, Globe2, Headphones } from "lucide-react";

const StatsSection = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: Users, value: "500+", label: t("stats.clients") },
    { icon: Building2, value: "120+", label: t("stats.hospitals") },
    { icon: Globe2, value: "15+", label: t("stats.countries") },
    { icon: Headphones, value: t("stats.support.value"), label: t("stats.support") },
  ];

  return (
    <section className="relative -mt-12 sm:-mt-16 md:-mt-20 z-20 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-card rounded-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 card-elevated"
      >
        {stats.map((s, i) => (
          <div key={i} className="text-center">
            <div className="w-12 h-12 rounded-xl bg-accent mx-auto mb-3 flex items-center justify-center">
              <s.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">{s.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default StatsSection;
