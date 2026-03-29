import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Download, MessageCircle, ArrowRight, BadgeCheck, Facebook } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProducts } from "@/contexts/ProductContext";
import type { ProductSlug } from "@/content/products";

function buildWhatsAppUrl(number: string, message?: string) {
  const digits = number.replace(/[^\d]/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

function extractPlaylistId(url: string | undefined): string | null {
  if (!url) return null;
  const match = url.match(/[?&]list=([^&]+)/);
  return match ? match[1] : null;
}

function buildFacebookPagePluginUrl(pageUrl: string) {
  const params = new URLSearchParams({
    href: pageUrl,
    tabs: "timeline",
    // Facebook's maximum supported width is 500. 
    // Setting it to 500 ensures it fills up to that limit.
    width: "500", 
    height: "900", // Stretch height to fill container
    small_header: "false",
    adapt_container_width: "true", // This is the key for "stretching"
    hide_cover: "false",
    show_facepile: "true",
    appId: "", // Optional: Add your App ID if you have one
  });

  return `https://www.facebook.com/plugins/page.php?${params.toString()}`;
}

const ProductPage = () => {
  const { slug } = useParams<{ slug: ProductSlug }>();
  const { lang } = useLanguage();
  const { products } = useProducts();

  const product = useMemo(() => (slug ? products.find(p => p.slug === slug) : undefined), [slug, products]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-28 pb-16">
          <div className="rounded-2xl border border-border bg-card p-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Product not found</h1>
            <p className="text-muted-foreground mb-6">
              {lang === "ar"
                ? "المنتج غير موجود. الرجاء العودة للرئيسية."
                : "This product doesn’t exist. Please go back home."}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const title = product.name[lang];
  const tagline = product.tagline[lang];
  const description = product.description[lang];
  const facebookPageUrl = product.facebookUrl || "https://www.facebook.com/golabsys";
  const whatsappUrl = buildWhatsAppUrl(
    product.whatsappNumber || "201111536173",
    product.whatsappMessage?.[lang]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        <section className="border-b border-border bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 pt-12 pb-12">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="order-last lg:order-first">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${product.accentClassName}`}>
                    <product.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {lang === "ar"
                      ? product.type === "lab"
                        ? "حلول المعامل"
                        : product.type === "clinic"
                          ? "حلول العيادات"
                          : "حلول المستشفيات"
                      : product.type.toUpperCase()}
                  </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">{title}</h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-5">{tagline}</p>
                <p className="text-muted-foreground leading-relaxed mb-6">{description}</p>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[hsl(142,70%,45%)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {lang === "ar" ? "تواصل واتساب" : "WhatsApp Chat"}
                  </a>

                  {product.trialUrl && (
                    <a
                      href={product.trialUrl}
                      download={product.trialUrl.startsWith('http') ? undefined : `GoClick-${product.slug}-Trial`}
                      target={product.trialUrl.startsWith('http') ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90"
                    >
                      <Download className="h-4 w-4" />
                      {lang === "ar" ? "تحميل النسخة التجريبية" : "Download Trial"}
                    </a>
                  )}

                  <a
                    href={facebookPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                    title="Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                    {lang === "ar" ? "فيسبوك" : "Facebook"}
                  </a>
                </div>

                <p className="mt-5 text-sm font-semibold text-primary">{product.price[lang]}</p>
              </div>

              <div className="order-first lg:order-last rounded-2xl border border-border bg-card p-4 card-elevated">
                {product.youtubeId ? (
                  <div className="aspect-video overflow-hidden rounded-xl">
                    <iframe
                      className="h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${product.youtubeId}`}
                      title={`${title} demo`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video overflow-hidden rounded-xl bg-muted">
                    <img 
                      src={product.mainImage || "https://placehold.co/800x450/1e293b/94a3b8?text=No+Image"} 
                      alt={title} 
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/800x450/1e293b/94a3b8?text=No+Image"; }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {lang === "ar" ? "المميزات" : "Features"}
                </h2>
                <p className="text-muted-foreground">
                  {lang === "ar"
                    ? "أهم المميزات التي تجعل المنتج مناسباً لاحتياجاتك."
                    : "Key capabilities that make this product a perfect fit."}
                </p>
              </div>

              <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
                {product.features.map((f, idx) => (
                  <div key={idx} className="rounded-2xl border border-border bg-card p-5">
                    <div className="font-semibold text-foreground">{f[lang]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {!!product.howItWorks?.length && (
          <section className="py-14">
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {lang === "ar" ? "كيف يعمل" : "How it works"}
                </h2>
                <p className="text-muted-foreground">
                  {lang === "ar"
                    ? "٣ خطوات بسيطة توضّح رحلة الاستخدام من البداية للنهاية."
                    : "A simple 3-step flow from start to finish."}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {product.howItWorks.map((s, idx) => (
                  <div key={idx} className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                      {idx + 1}
                    </div>
                    <div className="font-bold text-foreground mb-2">{s.title[lang]}</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc[lang]}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {!!extractPlaylistId(product.youtubePlaylistUrl) && (
          <section className="py-14 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {lang === "ar" ? "كيفية استخدام التطبيق" : "How to use the app"}
                </h2>
                <p className="text-muted-foreground">
                  {lang === "ar"
                    ? "قائمة تشغيل توضح لك كيفية استخدام النظام خطوة بخطوة."
                    : "A comprehensive video playlist on how to use the system step by step."}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 card-elevated">
                <div className="aspect-video overflow-hidden rounded-xl bg-muted">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/videoseries?list=${extractPlaylistId(product.youtubePlaylistUrl)}`}
                    title="How to use playlist"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {!!product.pricingImage?.src && (
          <section className="py-14 bg-muted/40">
            <div className="container mx-auto px-4">
              <div className="flex items-end justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {lang === "ar" ? "قائمة الأسعار" : "Pricing"}
                  </h2>
                  <p className="text-muted-foreground">
                    {lang === "ar"
                      ? "صورة لقائمة الأسعار (يمكن استبدالها بملفك الحقيقي لاحقاً)."
                      : "An image of the pricing list (replace with your real file later)."}
                  </p>
                </div>
                <div className="text-sm font-semibold text-primary">{product.price[lang]}</div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 card-elevated">
                <img
                  src={product.pricingImage.src}
                  alt={product.pricingImage.alt[lang]}
                  loading="lazy"
                  className="w-full rounded-xl border border-border bg-muted object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {!!product.images?.length && (
          <section className="py-14">
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {lang === "ar" ? "صور المنتج" : "Product Images"}
                </h2>
                <p className="text-muted-foreground">
                  {lang === "ar"
                    ? "لقطات توضيحية من واجهات المنتج."
                    : "UI snapshots and product highlights."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {product.images.map((img, idx) => (
                  <div key={idx} className="rounded-2xl border border-border bg-card p-3">
                    <img
                      src={img.src}
                      alt={img.title[lang]}
                      loading="lazy"
                      className="aspect-[4/3] w-full rounded-xl border border-border bg-muted object-cover"
                    />
                    <div className="px-1 pt-3">
                      <div className="text-sm font-semibold text-foreground">{img.title[lang]}</div>
                      <div className="text-xs text-muted-foreground">{img.subtitle[lang]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {!!product.success?.length && (
          <section className="py-14 bg-muted/40">
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {lang === "ar" ? "قصص نجاح العملاء" : "Customer Success"}
                </h2>
                <p className="text-muted-foreground">
                  {lang === "ar"
                    ? "مقتطفات سريعة من تجارب العملاء."
                    : "Quick highlights from real customer experiences."}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {product.success.map((s, idx) => (
                  <div key={idx} className="rounded-2xl border border-border bg-card p-6 card-elevated">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <BadgeCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{s.name[lang]}</div>
                        {s.title && <div className="text-sm text-muted-foreground">{s.title[lang]}</div>}
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">“{s.quote[lang]}”</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {!!product.partners?.length && (
          <section className="py-14">
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {lang === "ar" ? "شركاؤنا" : "Partners"}
                </h2>
                <p className="text-muted-foreground">
                  {lang === "ar"
                    ? "شركاء موثوقون يدعمون نجاح المنتج."
                    : "Trusted partners supporting product success."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.partners.map((p, idx) => (
                  <div
                    key={`${p.title.en}-${idx}`}
                    className="bg-card rounded-2xl p-6 card-elevated border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-xl border border-border bg-muted overflow-hidden flex items-center justify-center flex-shrink-0">
                        <img
                          src={p.imageSrc || "https://placehold.co/200x200/e2e8f0/94a3b8?text=Partner"}
                          alt={p.title[lang]}
                          loading="lazy"
                          className="h-full w-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/200x200/e2e8f0/94a3b8?text=Partner"; }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-foreground truncate">{p.title[lang]}</div>
                        <div className="text-sm text-muted-foreground truncate">{p.subtitle[lang]}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-14 bg-muted/40">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {lang === "ar" ? "تابعنا على فيسبوك" : "Follow us on Facebook"}
              </h2>
              <p className="text-muted-foreground">
                {lang === "ar"
                  ? "آخر الأخبار والتحديثات من صفحتنا الرسمية."
                  : "Latest updates and posts from our official page."}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden card-elevated flex flex-col min-h-[650px] md:min-h-[800px] lg:min-h-[900px]">
                <iframe
                  title="Facebook Page"
                  src={buildFacebookPagePluginUrl(facebookPageUrl)}
                  className="w-full flex-grow bg-white"
                  style={{ border: "none", overflow: "hidden" }}
                  scrolling="yes"
                  frameBorder={0}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Facebook className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground mb-1">
                      {lang === "ar" ? "صفحة فيسبوك" : "Facebook Page"}
                    </div>
                    <a
                      href={facebookPageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary hover:underline break-all"
                    >
                      {facebookPageUrl}
                    </a>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {lang === "ar"
                        ? "لو واجهت مشكلة في العرض داخل الإطار (بسبب إعدادات فيسبوك)، استخدم الرابط مباشرة."
                        : "If the embedded view is blocked (Facebook settings), use the direct link."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {!!product.faqs?.length && (
          <section className="py-14">
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}
                </h2>
                <p className="text-muted-foreground">
                  {lang === "ar"
                    ? "إجابات سريعة لأكثر الأسئلة تكراراً."
                    : "Quick answers to common questions."}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {product.faqs.slice(0, 6).map((f, idx) => (
                  <div key={idx} className="rounded-2xl border border-border bg-card p-6">
                    <div className="font-bold text-foreground mb-2">{f.q[lang]}</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.a[lang]}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductPage;

