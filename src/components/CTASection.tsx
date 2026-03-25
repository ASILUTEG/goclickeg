import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-6 sm:p-10 md:p-16 text-center hero-overlay"
        >
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              {t("cta.subtitle")}
            </p>
            <a
              href="https://wa.me/201111536173"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90 transition-all shadow-lg text-base"
            >
              {t("cta.button")}
              <ArrowRight className="w-5 h-5 rtl:rotate-180" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
