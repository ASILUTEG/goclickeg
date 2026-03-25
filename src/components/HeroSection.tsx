import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ArrowDown, Play } from "lucide-react";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80"
      >
        <source
          src="https://cdn.coverr.co/videos/coverr-medical-technology-4736/1080p.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Particles / floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary-foreground/20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-primary-foreground/90 text-sm font-medium">
              {t("hero.subtitle").slice(0, 40)}...
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6 max-w-4xl mx-auto">
            {t("hero.title")}
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#products"
              className="px-8 py-4 rounded-xl bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90 transition-all shadow-lg hover:shadow-xl text-base"
            >
              {t("hero.cta")}
            </a>
            <a
              href="#contact"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground font-semibold hover:bg-primary-foreground/10 transition-all text-base"
            >
              <Play className="w-5 h-5" />
              {t("hero.demo")}
            </a>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-6 h-6 text-primary-foreground/50" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
