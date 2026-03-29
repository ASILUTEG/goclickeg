import { useLanguage } from "@/contexts/LanguageContext";
import { useProducts } from "@/contexts/ProductContext";
import { motion } from "framer-motion";
import { Download, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductsSection = () => {
  const { t, lang } = useLanguage();
  const { products } = useProducts();
  const navigate = useNavigate();

  return (
    <section id="products" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("products.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t("products.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {products.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/${p.slug}`)}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") navigate(`/${p.slug}`);
                }}
                className="bg-card rounded-2xl p-6 card-elevated group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="w-full h-48 mb-6 rounded-xl overflow-hidden bg-muted border border-border">
                  <img 
                    src={p.mainImage || "https://placehold.co/800x400/1e293b/94a3b8?text=No+Image"} 
                    alt={lang === "ar" ? p.name.ar : p.name.en} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/800x400/1e293b/94a3b8?text=No+Image"; }}
                  />
                </div>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl ${p.accentClassName} flex items-center justify-center flex-shrink-0`}>
                    {Icon && <Icon className="w-7 h-7" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {lang === "ar" ? p.name.ar : p.name.en}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      {lang === "ar" ? p.description.ar : p.description.en}
                    </p>
                    <p className="text-primary font-semibold text-sm mb-4">
                      {lang === "ar" ? p.price.ar : p.price.en}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/${p.slug}`);
                        }}
                      >
                        {t("products.details")}
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                      </button>
                      {p.trialUrl && (
                        <a 
                          href={p.trialUrl}
                          download={p.trialUrl.startsWith('http') ? undefined : `GoClick-${p.slug}-Trial`}
                          target={p.trialUrl.startsWith('http') ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:underline"
                        >
                          <Download className="w-4 h-4" />
                          {t("products.trial")}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
