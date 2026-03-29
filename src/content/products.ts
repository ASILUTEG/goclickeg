import type { LucideIcon } from "lucide-react";
import { FlaskConical, Stethoscope, Monitor } from "lucide-react";

export type ProductSlug = "golab" | "goclinic" | "gohospital";
export type ProductType = "lab" | "clinic" | "hospital";

export type ProductContent = {
  slug: ProductSlug;
  type: ProductType;
  icon: LucideIcon;
  accentClassName: string;
  name: { ar: string; en: string };
  tagline: { ar: string; en: string };
  description: { ar: string; en: string };
  price: { ar: string; en: string };
  sort_order?: number;
  youtubeId?: string;
  youtubePlaylistUrl?: string;
  features: Array<{ ar: string; en: string }>;
  howItWorks?: Array<{ title: { ar: string; en: string }; desc: { ar: string; en: string } }>;
  trialUrl?: string;
  whatsappNumber?: string;
  whatsappMessage?: { ar: string; en: string };
  facebookUrl?: string;
  partners?: Array<{
    title: { ar: string; en: string };
    subtitle: { ar: string; en: string };
    imageSrc: string;
  }>;
  success?: Array<{
    name: { ar: string; en: string };
    title?: { ar: string; en: string };
    quote: { ar: string; en: string };
  }>;
  mainImage?: string;
  images?: Array<{ src: string; title: { ar: string; en: string }; subtitle: { ar: string; en: string } }>;
  pricingImage?: { src: string; alt: { ar: string; en: string } };
  faqs?: Array<{ q: { ar: string; en: string }; a: { ar: string; en: string } }>;
};

export const products: ProductContent[] = [
  {
    slug: "golab",
    type: "lab",
    icon: FlaskConical,
    accentClassName: "bg-primary/10 text-primary",
    name: { ar: "GoLab", en: "GoLab" },
    tagline: {
      ar: "نظام إدارة شامل للمختبرات الطبية",
      en: "A comprehensive lab management system",
    },
    description: {
      ar: "حل متكامل لإدارة سير العمل داخل المعمل: تسجيل العينات، تتبعها، إصدار النتائج والتقارير، والتكامل مع الأجهزة.",
      en: "An end-to-end lab workflow solution: sample registration, tracking, results & reporting, with device integration support.",
    },
    mainImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800",
    price: { ar: "ابتداءً من ٣٠٠٠ $/سنوياً", en: "Starting from $3,000/year" },
    features: [
      { ar: "تتبع العينات والنتائج", en: "Sample & results tracking" },
      { ar: "تقارير آلية قابلة للتخصيص", en: "Customizable automated reports" },
      { ar: "صلاحيات متعددة للمستخدمين", en: "Role-based access control" },
      { ar: "إشعارات وتنبيهات", en: "Notifications & alerts" },
    ],
    howItWorks: [
      {
        title: { ar: "استقبال وتسجيل العينة", en: "Receive & register samples" },
        desc: {
          ar: "سجّل بيانات المريض والعينة بسرعة، واطبع باركود للتتبع.",
          en: "Register patient & sample data fast and print barcodes for tracking.",
        },
      },
      {
        title: { ar: "تتبّع سير العمل", en: "Track workflow" },
        desc: {
          ar: "تابع مراحل التحليل والحالة لحظة بلحظة مع تنبيهات تلقائية.",
          en: "Monitor processing stages in real time with automated alerts.",
        },
      },
      {
        title: { ar: "نتائج وتقارير", en: "Results & reporting" },
        desc: {
          ar: "اعتمد النتائج واصدر تقارير احترافية قابلة للتخصيص.",
          en: "Approve results and generate professional, customizable reports.",
        },
      },
    ],
    partners: [
      {
        title: { ar: "HealthPlus Labs", en: "HealthPlus Labs" },
        subtitle: { ar: "معامل — شريك تشغيل", en: "Labs — Operations Partner" },
        imageSrc: "/placeholder.svg",
      },
      {
        title: { ar: "BioGenix", en: "BioGenix" },
        subtitle: { ar: "تقنيات طبية — شريك ابتكار", en: "MedTech — Innovation Partner" },
        imageSrc: "/placeholder.svg",
      },
      {
        title: { ar: "NovaCare", en: "NovaCare" },
        subtitle: { ar: "عيادات — شريك رعاية", en: "Clinic — Care Partner" },
        imageSrc: "/placeholder.svg",
      },
      {
        title: { ar: "MediCare", en: "MediCare" },
        subtitle: { ar: "مستشفى — شريك نجاح", en: "Hospital — Success Partner" },
        imageSrc: "/placeholder.svg",
      },
    ],
    success: [
      {
        name: { ar: "د. أحمد", en: "Dr. Ahmed" },
        title: { ar: "مدير معمل", en: "Lab Director" },
        quote: {
          ar: "GoLab ساعدنا نقلل زمن إصدار النتائج ونحسن دقة التقارير بشكل ملحوظ.",
          en: "GoLab helped us reduce turnaround time and significantly improve reporting accuracy.",
        },
      },
      {
        name: { ar: "أ. سارة", en: "Sara" },
        title: { ar: "مسؤول تشغيل", en: "Operations" },
        quote: {
          ar: "تتبع العينات والتنبيهات خلّى الشغل منظم وسهل على الفريق.",
          en: "Sample tracking and alerts made the workflow organized and easy for the team.",
        },
      },
    ],
    images: [
      {
        src: "/placeholder.svg",
        title: { ar: "لوحة التحكم", en: "Dashboard" },
        subtitle: { ar: "نظرة عامة على الحالات والمهام.", en: "A quick overview of cases and tasks." },
      },
      {
        src: "/placeholder.svg",
        title: { ar: "النتائج", en: "Results" },
        subtitle: { ar: "اعتماد النتائج ومراجعتها بسهولة.", en: "Review and approve results easily." },
      },
      {
        src: "/placeholder.svg",
        title: { ar: "التقارير", en: "Reports" },
        subtitle: { ar: "قوالب تقارير قابلة للتخصيص.", en: "Customizable report templates." },
      },
      {
        src: "/placeholder.svg",
        title: { ar: "تتبّع العينة", en: "Sample tracking" },
        subtitle: { ar: "تتبّع كامل بالباركود.", en: "End-to-end tracking with barcodes." },
      },
    ],
    pricingImage: { src: "/placeholder.svg", alt: { ar: "قائمة أسعار GoLab", en: "GoLab pricing list" } },
    faqs: [
      {
        q: { ar: "هل يدعم الباركود وتتبع العينات؟", en: "Does it support barcodes and sample tracking?" },
        a: {
          ar: "نعم، يدعم تسجيل العينات مع باركود وتتبع مراحلها حتى إصدار التقرير.",
          en: "Yes. You can register samples with barcodes and track them through all stages until reporting.",
        },
      },
      {
        q: { ar: "هل يمكن تخصيص التقارير؟", en: "Can reports be customized?" },
        a: {
          ar: "نعم، يمكن تخصيص شكل التقرير والحقول وفق احتياجات المعمل.",
          en: "Yes. Report templates and fields can be customized to your lab’s needs.",
        },
      },
      {
        q: { ar: "هل يوجد صلاحيات للمستخدمين؟", en: "Is there role-based access control?" },
        a: {
          ar: "نعم، صلاحيات متعددة حسب الدور (استقبال/فني/مشرف/مدير).",
          en: "Yes. Multiple roles and permissions (reception/technician/supervisor/admin).",
        },
      },
      {
        q: { ar: "هل يدعم تعدد الفروع؟", en: "Does it support multiple branches?" },
        a: {
          ar: "نعم، يمكن تشغيله لعدة فروع مع تقارير موحدة أو لكل فرع.",
          en: "Yes. Multi-branch setup with unified reporting or branch-level reporting.",
        },
      },
      {
        q: { ar: "هل يوجد دعم فني وتدريب؟", en: "Do you provide support and training?" },
        a: {
          ar: "نوفر تدريب عند التشغيل ودعم فني حسب الباقة.",
          en: "We provide onboarding training and support depending on your plan.",
        },
      },
    ],
    trialUrl: "#",
    whatsappNumber: "201111536173",
    whatsappMessage: {
      ar: "مرحباً، أريد معرفة تفاصيل GoLab وطلب تجربة.",
      en: "Hi, I’d like details about GoLab and request a trial.",
    },
    facebookUrl: "https://www.facebook.com/golabsys",
  },
  {
    slug: "goclinic",
    type: "clinic",
    icon: Stethoscope,
    accentClassName: "bg-secondary/10 text-secondary",
    name: { ar: "GoClinic", en: "GoClinic" },
    tagline: {
      ar: "حل رقمي متطور لإدارة العيادات",
      en: "An advanced digital clinic solution",
    },
    description: {
      ar: "إدارة المواعيد والمرضى والسجل الطبي الإلكتروني، مع تجربة استخدام بسيطة للطبيب والاستقبال.",
      en: "Manage appointments, patients, and EMR with an easy experience for doctors and reception staff.",
    },
    mainImage: "https://images.unsplash.com/photo-1532938911079-1b06ac7ce122?q=80&w=800",
    price: { ar: "ابتداءً من ٢٠٠٠ $/سنوياً", en: "Starting from $2,000/year" },
    features: [
      { ar: "إدارة مواعيد مرنة", en: "Flexible appointment scheduling" },
      { ar: "سجلات طبية إلكترونية", en: "Electronic medical records" },
      { ar: "فواتير وتقارير", en: "Billing & reporting" },
      { ar: "صلاحيات المستخدمين", en: "User roles & permissions" },
    ],
    howItWorks: [
      {
        title: { ar: "حجز وإدارة المواعيد", en: "Schedule appointments" },
        desc: {
          ar: "تقويم مرن للمواعيد مع تذكيرات وتقليل الغياب.",
          en: "Flexible scheduling with reminders to reduce no-shows.",
        },
      },
      {
        title: { ar: "ملف المريض والسجل الطبي", en: "Patient profile & EMR" },
        desc: {
          ar: "كل بيانات المريض في مكان واحد مع تاريخ الزيارات.",
          en: "Keep patient data in one place with visit history.",
        },
      },
      {
        title: { ar: "فواتير وتقارير", en: "Billing & reports" },
        desc: {
          ar: "فواتير منظمة وتقارير أداء تساعدك على المتابعة.",
          en: "Structured billing and performance reports for better tracking.",
        },
      },
    ],
    partners: [
      {
        title: { ar: "NovaCare Clinic", en: "NovaCare Clinic" },
        subtitle: { ar: "عيادات — شريك رعاية", en: "Clinic — Care Partner" },
        imageSrc: "/placeholder.svg",
      },
      {
        title: { ar: "Al Shifa Medical", en: "Al Shifa Medical" },
        subtitle: { ar: "مجمع طبي — شريك تقني", en: "Medical Center — Tech Partner" },
        imageSrc: "/placeholder.svg",
      },
      {
        title: { ar: "Royal Pharma", en: "Royal Pharma" },
        subtitle: { ar: "صيدليات — شريك حلول", en: "Pharmacy — Solutions Partner" },
        imageSrc: "/placeholder.svg",
      },
      {
        title: { ar: "MediCare", en: "MediCare" },
        subtitle: { ar: "مستشفى — شريك نجاح", en: "Hospital — Success Partner" },
        imageSrc: "/placeholder.svg",
      },
    ],
    success: [
      {
        name: { ar: "د. محمد", en: "Dr. Mohamed" },
        title: { ar: "طبيب", en: "Physician" },
        quote: {
          ar: "المواعيد والسجل الطبي الإلكتروني بقوا أسرع وواضحين للطاقم كله.",
          en: "Appointments and EMR became faster and clearer for the whole staff.",
        },
      },
      {
        name: { ar: "إدارة العيادة", en: "Clinic Management" },
        quote: {
          ar: "التقارير والفواتير ساعدتنا في متابعة الأداء وزيادة الالتزام.",
          en: "Reports and billing helped us monitor performance and improve compliance.",
        },
      },
    ],
    images: [
      {
        src: "/placeholder.svg",
        title: { ar: "لوحة العيادة", en: "Clinic dashboard" },
        subtitle: { ar: "متابعة سريعة للمواعيد والزيارات.", en: "Quick view of appointments and visits." },
      },
      {
        src: "/placeholder.svg",
        title: { ar: "المواعيد", en: "Appointments" },
        subtitle: { ar: "تقويم واضح وإدارة سهلة.", en: "Clear calendar and easy management." },
      },
      {
        src: "/placeholder.svg",
        title: { ar: "ملف المريض", en: "Patient profile" },
        subtitle: { ar: "سجل طبي إلكتروني منظم.", en: "Organized electronic medical record." },
      },
      {
        src: "/placeholder.svg",
        title: { ar: "الفواتير", en: "Billing" },
        subtitle: { ar: "فواتير وتقارير مالية.", en: "Invoices and financial reports." },
      },
    ],
    pricingImage: {
      src: "/placeholder.svg",
      alt: { ar: "قائمة أسعار GoClinic", en: "GoClinic pricing list" },
    },
    faqs: [
      {
        q: { ar: "هل يدعم تذكير المواعيد؟", en: "Does it support appointment reminders?" },
        a: {
          ar: "نعم، يمكن تفعيل تذكيرات تساعد على تقليل الغياب.",
          en: "Yes. Reminders can be enabled to reduce no-shows.",
        },
      },
      {
        q: { ar: "هل يوجد ملف مريض وسجل زيارات؟", en: "Do you have a patient profile and visit history?" },
        a: {
          ar: "نعم، ملف المريض يجمع البيانات والتشخيصات والوصفات وتاريخ الزيارات.",
          en: "Yes. Patient profiles include data, diagnoses, prescriptions, and visit history.",
        },
      },
      {
        q: { ar: "هل يوجد صلاحيات للطاقم؟", en: "Are staff permissions supported?" },
        a: {
          ar: "نعم، صلاحيات حسب الدور للطبيب والاستقبال والمحاسبة.",
          en: "Yes. Role-based permissions for doctors, reception, and billing staff.",
        },
      },
      {
        q: { ar: "هل يدعم أكثر من عيادة/طبيب؟", en: "Does it support multiple doctors/clinics?" },
        a: {
          ar: "نعم، مناسب للعيادة الواحدة أو عدة عيادات وأطباء.",
          en: "Yes. Works for single clinics or multi-doctor setups.",
        },
      },
      {
        q: { ar: "هل يوجد تقارير؟", en: "Are there reports?" },
        a: {
          ar: "نعم، تقارير للمواعيد والإيرادات وأداء العيادة حسب المتاح.",
          en: "Yes. Reports for appointments, revenue, and clinic performance (depending on plan).",
        },
      },
    ],
    trialUrl: "#",
    whatsappNumber: "201111536173",
    whatsappMessage: {
      ar: "مرحباً، أريد معرفة تفاصيل GoClinic وطلب تجربة.",
      en: "Hi, I’d like details about GoClinic and request a trial.",
    },
    facebookUrl: "https://www.facebook.com/golabsys",
  },
  {
    slug: "gohospital",
    type: "hospital",
    icon: Monitor,
    accentClassName: "bg-accent text-accent-foreground",
    name: { ar: "GoHospital", en: "GoHospital" },
    tagline: {
      ar: "نظام متكامل لإدارة عمليات المستشفى",
      en: "A comprehensive hospital operations system",
    },
    description: {
      ar: "من الاستقبال وحتى الخروج: إدارة الأقسام، المرضى، الخدمات، التقارير، ولوحات متابعة للإدارة.",
      en: "From admission to discharge: manage departments, patients, services, reporting, and management dashboards.",
    },
    mainImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800",
    price: { ar: "ابتداءً من ٥٠٠٠ $/سنوياً", en: "Starting from $5,000/year" },
    features: [
      { ar: "إدارة الأقسام والخدمات", en: "Departments & services management" },
      { ar: "لوحات متابعة للإدارة", en: "Management dashboards" },
      { ar: "تقارير شاملة", en: "Comprehensive reporting" },
      { ar: "قابلية توسع عالية", en: "Highly scalable architecture" },
    ],
    howItWorks: [
      {
        title: { ar: "إدخال ومتابعة الحالة", en: "Admission & case tracking" },
        desc: {
          ar: "إجراءات إدخال منظمة مع متابعة الحالة ومراحل الخدمة.",
          en: "Structured admission process with case tracking across services.",
        },
      },
      {
        title: { ar: "إدارة الأقسام", en: "Department operations" },
        desc: {
          ar: "تنسيق بين الأقسام مع صلاحيات وسير عمل واضح.",
          en: "Coordinate departments with clear workflows and permissions.",
        },
      },
      {
        title: { ar: "لوحات وتقارير للإدارة", en: "Dashboards & analytics" },
        desc: {
          ar: "لوحات متابعة وتقارير تساعد الإدارة على اتخاذ قرارات أسرع.",
          en: "Dashboards and analytics to help management make faster decisions.",
        },
      },
    ],
    partners: [
      {
        title: { ar: "MediCare Hospital", en: "MediCare Hospital" },
        subtitle: { ar: "مستشفى — شريك نجاح", en: "Hospital — Success Partner" },
        imageSrc: "/placeholder.svg",
      },
      {
        title: { ar: "HealthPlus", en: "HealthPlus" },
        subtitle: { ar: "مجمع طبي — شريك تشغيل", en: "Medical Center — Operations Partner" },
        imageSrc: "/placeholder.svg",
      },
      {
        title: { ar: "NovaCare", en: "NovaCare" },
        subtitle: { ar: "عيادات — شريك رعاية", en: "Clinic — Care Partner" },
        imageSrc: "/placeholder.svg",
      },
      {
        title: { ar: "Royal Pharma", en: "Royal Pharma" },
        subtitle: { ar: "صيدليات — شريك حلول", en: "Pharmacy — Solutions Partner" },
        imageSrc: "/placeholder.svg",
      },
    ],
    success: [
      {
        name: { ar: "إدارة المستشفى", en: "Hospital Administration" },
        quote: {
          ar: "لوحات المتابعة والتقارير خلت القرارات أسرع وإدارة الأقسام أكثر كفاءة.",
          en: "Dashboards and reports made decisions faster and department management more efficient.",
        },
      },
      {
        name: { ar: "قسم الاستقبال", en: "Reception Team" },
        quote: {
          ar: "تنظيم الإدخال والمتابعة قلل الأخطاء وسرّع الخدمة.",
          en: "Admission and follow-up organization reduced errors and sped up service.",
        },
      },
    ],
    images: [
      {
        src: "/placeholder.svg",
        title: { ar: "لوحة المستشفى", en: "Hospital dashboard" },
        subtitle: { ar: "مؤشرات أساسية في مكان واحد.", en: "Key KPIs in one place." },
      },
      {
        src: "/placeholder.svg",
        title: { ar: "لوحات الإدارة", en: "Admin dashboards" },
        subtitle: { ar: "متابعة الأقسام والضغط التشغيلي.", en: "Monitor departments and workload." },
      },
      {
        src: "/placeholder.svg",
        title: { ar: "الأقسام والخدمات", en: "Departments & services" },
        subtitle: { ar: "تنظيم العمليات بين الأقسام.", en: "Organize cross-department operations." },
      },
      {
        src: "/placeholder.svg",
        title: { ar: "التقارير", en: "Reports" },
        subtitle: { ar: "تقارير تشغيلية وإدارية.", en: "Operational and management reports." },
      },
    ],
    pricingImage: {
      src: "/placeholder.svg",
      alt: { ar: "قائمة أسعار GoHospital", en: "GoHospital pricing list" },
    },
    faqs: [
      {
        q: { ar: "هل مناسب للمستشفيات الكبيرة؟", en: "Is it suitable for large hospitals?" },
        a: {
          ar: "نعم، مصمم ليكون قابل للتوسع حسب عدد الأقسام والمستخدمين.",
          en: "Yes. Designed to scale based on departments and user count.",
        },
      },
      {
        q: { ar: "هل يوجد صلاحيات وتدقيق؟", en: "Does it have permissions and auditing?" },
        a: {
          ar: "نعم، صلاحيات حسب الدور ويمكن إضافة سجلات تدقيق حسب الحاجة.",
          en: "Yes. Role-based access and auditing can be enabled as needed.",
        },
      },
      {
        q: { ar: "هل يوفر لوحات متابعة للإدارة؟", en: "Does it provide management dashboards?" },
        a: {
          ar: "نعم، لوحات مؤشرات وتقارير لمتابعة الأداء.",
          en: "Yes. KPI dashboards and analytics reports are included.",
        },
      },
      {
        q: { ar: "هل يمكن تخصيص سير العمل؟", en: "Can workflows be customized?" },
        a: {
          ar: "نعم، يمكن تهيئة الأقسام والعمليات وفق طبيعة المستشفى.",
          en: "Yes. Departments and processes can be configured to match your operations.",
        },
      },
      {
        q: { ar: "هل يوجد تدريب وتشغيل؟", en: "Do you provide onboarding?" },
        a: {
          ar: "نوفر تدريب وتشغيل مبدئي ودعم مستمر حسب الاتفاق.",
          en: "We provide onboarding and ongoing support based on the agreement.",
        },
      },
    ],
    trialUrl: "#",
    whatsappNumber: "201111536173",
    whatsappMessage: {
      ar: "مرحباً، أريد معرفة تفاصيل GoHospital وطلب تجربة.",
      en: "Hi, I’d like details about GoHospital and request a trial.",
    },
    facebookUrl: "https://www.facebook.com/golabsys",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

