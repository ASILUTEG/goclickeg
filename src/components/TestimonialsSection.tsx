import { useProducts } from "@/contexts/ProductContext";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const { t, lang } = useLanguage();
  const { products } = useProducts();

  // Combine all success stories/reviews from all products
  const testimonials = products.reduce((acc, p) => {
    if (p.success && p.success.length > 0) {
      acc.push(...p.success);
    }
    return acc;
  }, [] as NonNullable<typeof products[0]['success']>);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("testimonials.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t("testimonials.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((tm, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 card-elevated relative"
            >
              <Quote className="w-8 h-8 text-primary/20 absolute top-4 end-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 text-secondary fill-secondary" />
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-6">
                  "{tm.quote[lang as 'ar' | 'en']}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">
                      {tm.name[lang as 'ar' | 'en'].charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {tm.name[lang as 'ar' | 'en']}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tm.title?.[lang as 'ar' | 'en'] || (lang === "ar" ? "عميل مميز" : "Valued Customer")}
                    </div>
                  </div>
                </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
