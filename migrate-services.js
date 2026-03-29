import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost', user: 'root',
  password: 'ENGali1234!@#$', database: 'goclick_db'
});

// Create table
await pool.query(`
  CREATE TABLE IF NOT EXISTS custom_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('website','desktop','mobile') NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    tagline_ar VARCHAR(500),
    tagline_en VARCHAR(500),
    description_ar TEXT,
    description_en TEXT,
    price_ar VARCHAR(255),
    price_en VARCHAR(255),
    features_ar JSON,
    features_en JSON,
    tech_stack_ar JSON,
    tech_stack_en JSON,
    mainImage TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log('✅ custom_services table ready');

// Check if already seeded
const [[{ cnt }]] = await pool.query('SELECT COUNT(*) AS cnt FROM custom_services');
if (cnt > 0) {
  console.log('ℹ️  Already seeded, skipping');
  await pool.end();
  process.exit(0);
}

// Seed data
const services = [
  {
    type: 'website',
    name_ar: 'تطوير مواقع الويب',
    name_en: 'Website Development',
    tagline_ar: 'مواقع احترافية تعكس هويتك وتجذب عملاءك',
    tagline_en: 'Professional websites that reflect your brand and attract clients',
    description_ar: 'نبني مواقع ويب عصرية وسريعة ومتوافقة مع جميع الأجهزة. من المواقع التعريفية إلى المتاجر الإلكترونية والمنصات الضخمة — نصمم ونطور حسب احتياجاتك.',
    description_en: 'We build modern, fast, fully responsive websites. From landing pages to e-commerce platforms and enterprise portals — designed and developed to your exact needs.',
    price_ar: 'ابتداءً من ٥٠٠ $',
    price_en: 'Starting from $500',
    features_ar: JSON.stringify(['تصميم UI/UX احترافي', 'متوافق مع جميع الأجهزة', 'سرعة تحميل فائقة', 'لوحة تحكم سهلة', 'تحسين محركات البحث SEO', 'شهادة SSL مجانية']),
    features_en: JSON.stringify(['Professional UI/UX Design', 'Fully Responsive', 'Lightning Fast Loading', 'Easy Admin Panel', 'SEO Optimization', 'Free SSL Certificate']),
    tech_stack_ar: JSON.stringify(['React.js', 'Next.js', 'Node.js', 'MySQL', 'TailwindCSS']),
    tech_stack_en: JSON.stringify(['React.js', 'Next.js', 'Node.js', 'MySQL', 'TailwindCSS']),
    mainImage: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=800',
    sort_order: 1,
  },
  {
    type: 'desktop',
    name_ar: 'تطوير تطبيقات سطح المكتب',
    name_en: 'Desktop App Development',
    tagline_ar: 'برامج قوية تعمل على Windows وmacOS وLinux',
    tagline_en: 'Powerful apps running on Windows, macOS and Linux',
    description_ar: 'نطور تطبيقات سطح المكتب بأداء عالٍ وواجهات مستخدم سلسة. من أنظمة إدارة الأعمال إلى الأدوات التقنية المتخصصة، نبني ما تحتاجه بأحدث التقنيات.',
    description_en: 'We develop high-performance desktop applications with smooth UIs. From business management systems to specialized tools — we build what you need with modern technology.',
    price_ar: 'ابتداءً من ٢٠٠٠ $',
    price_en: 'Starting from $2,000',
    features_ar: JSON.stringify(['أداء عالٍ وسرعة فائقة', 'يعمل بدون إنترنت', 'تكامل مع قواعد البيانات', 'واجهة مستخدم احترافية', 'تحديثات تلقائية', 'دعم فني مستمر']),
    features_en: JSON.stringify(['High Performance', 'Works Offline', 'Database Integration', 'Professional UI', 'Auto Updates', 'Ongoing Support']),
    tech_stack_ar: JSON.stringify(['Electron.js', 'C# / .NET', 'WPF', 'SQLite', 'Tauri']),
    tech_stack_en: JSON.stringify(['Electron.js', 'C# / .NET', 'WPF', 'SQLite', 'Tauri']),
    mainImage: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=800',
    sort_order: 2,
  },
  {
    type: 'mobile',
    name_ar: 'تطوير تطبيقات الجوال',
    name_en: 'Mobile App Development',
    tagline_ar: 'تطبيقات iOS وAndroid تصل لعملائك في أي مكان',
    tagline_en: 'iOS & Android apps that reach your customers anywhere',
    description_ar: 'نصنع تطبيقات موبايل ذكية وجميلة لنظامي iOS وAndroid. من فكرتك الأولى حتى النشر على المتاجر — فريقنا يرافقك في كل خطوة.',
    description_en: 'We craft smart, beautiful mobile apps for iOS and Android. From your first idea to App Store launch — our team is with you every step of the way.',
    price_ar: 'ابتداءً من ٣٠٠٠ $',
    price_en: 'Starting from $3,000',
    features_ar: JSON.stringify(['تصميم UI/UX مخصص', 'يعمل على iOS وAndroid', 'إشعارات فورية', 'تكامل مع APIs', 'نشر على المتاجر', 'تحليلات وتقارير']),
    features_en: JSON.stringify(['Custom UI/UX Design', 'iOS & Android', 'Push Notifications', 'API Integration', 'Store Deployment', 'Analytics & Reports']),
    tech_stack_ar: JSON.stringify(['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase']),
    tech_stack_en: JSON.stringify(['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase']),
    mainImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800',
    sort_order: 3,
  },
];

for (const s of services) {
  await pool.query(`
    INSERT INTO custom_services
      (type, name_ar, name_en, tagline_ar, tagline_en, description_ar, description_en,
       price_ar, price_en, features_ar, features_en, tech_stack_ar, tech_stack_en,
       mainImage, sort_order)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `, [
    s.type, s.name_ar, s.name_en, s.tagline_ar, s.tagline_en,
    s.description_ar, s.description_en, s.price_ar, s.price_en,
    s.features_ar, s.features_en, s.tech_stack_ar, s.tech_stack_en,
    s.mainImage, s.sort_order
  ]);
}

console.log(`✅ Seeded ${services.length} services`);
await pool.end();
process.exit(0);
