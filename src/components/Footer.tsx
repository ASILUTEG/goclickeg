import { Mail, Phone, MapPin } from "lucide-react";
import { SiteLogo } from "./SiteLogo";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t, lang } = useLanguage();

  return (
    <footer className="bg-zinc-950 text-zinc-300 py-16 dark:bg-background dark:border-t dark:border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <SiteLogo className="h-10 md:h-12 brightness-0 invert opacity-90 dark:brightness-100 dark:invert-0 dark:opacity-100" textClassName="text-white dark:text-foreground" />
            </div>
            <p className="text-zinc-400 dark:text-muted-foreground text-sm leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-zinc-100 dark:text-foreground">{t("footer.quicklinks")}</h4>
            <div className="flex flex-col gap-2">
              <a
                href="/"
                className="text-zinc-400 hover:text-white dark:text-muted-foreground dark:hover:text-foreground text-sm transition-colors"
              >
                {t("nav.home")}
              </a>
              <a
                href="/#products"
                className="text-zinc-400 hover:text-white dark:text-muted-foreground dark:hover:text-foreground text-sm transition-colors"
              >
                {t("nav.products")}
              </a>
              <a
                href="/partners"
                className="text-zinc-400 hover:text-white dark:text-muted-foreground dark:hover:text-foreground text-sm transition-colors"
              >
                {t("nav.partners")}
              </a>
              <a
                href="/about"
                className="text-zinc-400 hover:text-white dark:text-muted-foreground dark:hover:text-foreground text-sm transition-colors"
              >
                {t("nav.about")}
              </a>
              <a
                href="/leave-review"
                className="text-zinc-400 hover:text-white dark:text-muted-foreground dark:hover:text-foreground text-sm transition-colors font-medium border-t border-zinc-800 dark:border-border/50 pt-2 mt-1"
              >
                {lang === "ar" ? "أضف تقييمك (جديد)" : "Leave a Review (New)"}
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-zinc-100 dark:text-foreground">{t("footer.contactus")}</h4>
            <div className="flex flex-col gap-3 text-sm text-zinc-400 dark:text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> info@goclickeg.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> 01111536173
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" /> {lang === "ar" ? "القاهرة، التحرير، مصر" : "Tahrir, Cairo, Egypt"}
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-zinc-100 dark:text-foreground">{t("footer.newsletter")}</h4>
            <p className="text-zinc-400 dark:text-muted-foreground text-sm mb-3">{t("footer.newsletter.desc")}</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={t("footer.email.placeholder")}
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 dark:bg-muted border border-zinc-800 dark:border-border text-zinc-100 dark:text-foreground text-sm placeholder:text-zinc-600 dark:placeholder:text-muted-foreground outline-none focus:border-primary"
              />
              <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                {t("footer.subscribe")}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-900 dark:border-border pt-6 text-center text-sm text-zinc-500 dark:text-muted-foreground">
          © {new Date().getFullYear()} {lang === 'ar' ? 'جو كليك' : 'GoClick'}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
