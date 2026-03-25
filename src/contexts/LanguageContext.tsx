import { createContext, useContext, useState, ReactNode } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const translations: Record<string, Record<Language, string>> = {
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.products": { ar: "المنتجات", en: "Products" },
  "nav.about": { ar: "من نحن", en: "About Us" },
  "nav.contact": { ar: "تواصل معنا", en: "Contact" },
  "nav.partners": { ar: "شركاؤنا", en: "Partners" },
  "hero.title": { ar: "حلول برمجية ذكية للقطاع الطبي", en: "Smart Software Solutions for Healthcare" },
  "brand": { ar: "GoClick", en: "GoClick" },
  "hero.subtitle": { ar: "نبتكر أنظمة برمجية متطورة تُحدث ثورة في إدارة المنشآت الطبية وتحسين رعاية المرضى", en: "We create advanced software systems that revolutionize healthcare facility management and improve patient care" },
  "hero.cta": { ar: "استكشف منتجاتنا", en: "Explore Our Products" },
  "hero.demo": { ar: "طلب عرض توضيحي", en: "Request a Demo" },
  "products.title": { ar: "منتجاتنا", en: "Our Products" },
  "products.subtitle": { ar: "حلول متكاملة مصممة خصيصاً لتلبية احتياجات القطاع الصحي", en: "Integrated solutions designed specifically for healthcare sector needs" },
  "products.details": { ar: "عرض التفاصيل", en: "View Details" },
  "products.trial": { ar: "تحميل نسخة تجريبية", en: "Download Trial" },
  "partners.title": { ar: "شركاؤنا", en: "Our Partners" },
  "partners.subtitle": { ar: "نفخر بشراكتنا مع أبرز المؤسسات الصحية", en: "We're proud to partner with leading healthcare institutions" },
  "testimonials.title": { ar: "آراء عملائنا", en: "Client Testimonials" },
  "testimonials.subtitle": { ar: "ماذا يقول عملاؤنا عن تجربتهم معنا", en: "What our clients say about their experience with us" },
  "stats.clients": { ar: "عميل", en: "Clients" },
  "stats.hospitals": { ar: "مستشفى", en: "Hospitals" },
  "stats.countries": { ar: "دولة", en: "Countries" },
  "stats.support": { ar: "دعم فني", en: "Support" },
  "stats.support.value": { ar: "٢٤/٧", en: "24/7" },
  "footer.description": { ar: "شركة رائدة في تطوير البرمجيات الطبية، نسعى لتحسين جودة الرعاية الصحية من خلال التكنولوجيا المتقدمة.", en: "A leading medical software company, striving to improve healthcare quality through advanced technology." },
  "footer.quicklinks": { ar: "روابط سريعة", en: "Quick Links" },
  "footer.contactus": { ar: "تواصل معنا", en: "Contact Us" },
  "footer.rights": { ar: "جميع الحقوق محفوظة", en: "All Rights Reserved" },
  "footer.newsletter": { ar: "النشرة البريدية", en: "Newsletter" },
  "footer.newsletter.desc": { ar: "اشترك للحصول على آخر الأخبار والتحديثات", en: "Subscribe for the latest news and updates" },
  "footer.subscribe": { ar: "اشتراك", en: "Subscribe" },
  "footer.email.placeholder": { ar: "بريدك الإلكتروني", en: "Your email" },
  "cta.title": { ar: "جاهز لتحويل منشأتك الطبية رقمياً؟", en: "Ready to Digitally Transform Your Healthcare Facility?" },
  "cta.subtitle": { ar: "تواصل معنا اليوم واحصل على استشارة مجانية", en: "Contact us today and get a free consultation" },
  "cta.button": { ar: "تواصل معنا الآن", en: "Contact Us Now" },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("ar");

  const toggleLang = () => setLang(l => l === "ar" ? "en" : "ar");
  const t = (key: string) => translations[key]?.[lang] || key;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, dir }}>
      <div dir={dir} className={lang === "ar" ? "font-arabic" : "font-sans"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
