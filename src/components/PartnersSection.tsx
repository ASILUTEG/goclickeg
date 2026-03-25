import { useLanguage } from "@/contexts/LanguageContext";
import { useProducts } from "@/contexts/ProductContext";
import { motion } from "framer-motion";

const PartnersSection = () => {
  const { t, lang } = useLanguage();
  const { products } = useProducts();

  // Extract all unique partners from all products
  const partners = products.reduce((acc, p) => {
    if (!p.partners) return acc;
    p.partners.forEach(partner => {
      // Use English title as a unique identifier to deduplicate
      if (!acc.some(ext => ext.title.en === partner.title.en)) {
        acc.push(partner);
      }
    });
    return acc;
  }, [] as NonNullable<typeof products[0]['partners']>);

  if (!partners || partners.length === 0) return null;

  return (
    <section id="partners" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("partners.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t("partners.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl p-6 card-elevated"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl border border-border bg-muted overflow-hidden flex items-center justify-center flex-shrink-0">
                  <img
                    src={p.imageSrc}
                    alt={p.title[lang]}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-foreground truncate">{p.title[lang]}</div>
                  <div className="text-sm text-muted-foreground truncate">{p.subtitle[lang]}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
