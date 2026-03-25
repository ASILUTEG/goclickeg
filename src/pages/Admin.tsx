import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  HeartPulse, 
  Users, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  PackageSearch,
  Activity,
  ArrowUpRight,
  Menu,
  X,
  Lock,
  User,
  ShieldAlert,
  Save,
  Key,
  MessageSquare
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProducts } from "@/contexts/ProductContext";
import { products } from "@/content/products";
import { ProductAdminForm } from "@/components/ProductAdminForm";
import { ReviewAdminPanel } from "@/components/ReviewAdminPanel";
import type { ProductContent } from "@/content/products";

const Admin = () => {
  const { lang } = useLanguage();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductContent | "new" | null>(null);
  
  // Login Engine State
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem("adminAuth") === "true");
  const [storedUsername, setStoredUsername] = useState(() => localStorage.getItem("adminUsername") || "admin");
  const [storedPassword, setStoredPassword] = useState(() => localStorage.getItem("adminPassword") || "admin123");

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  // Settings UI State
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Use a pseudo-RTL logic if 'ar', but mostly standard tailwind rules
  const isAr = lang === "ar";
  
  const stats = [
    { name: isAr ? "إجمالي الزيارات" : "Total Visits", value: "12,431", change: "+14.5%", trend: "up", icon: Activity },
    { name: isAr ? "العملاء المحتملين" : "Active Leads", value: "842", change: "+5.2%", trend: "up", icon: Users },
    { name: isAr ? "المنتجات النشطة" : "Active Products", value: "14", change: "0%", trend: "neutral", icon: PackageSearch },
  ];

  const recentActivity = [
    { user: "Ahmed", action: "Downloaded Lab Demo", time: "2 hours ago", status: "Success" },
    { user: "Dr. Sara", action: "Requested Quote", time: "5 hours ago", status: "Pending" },
    { user: "Kareem", action: "Viewed ERP Info", time: "1 day ago", status: "Completed" },
    { user: "Nour Hospital", action: "Purchased License", time: "2 days ago", status: "Success" },
  ];

  const navItems = [
    { id: "dashboard", label: isAr ? "لوحة القيادة" : "Dashboard", icon: LayoutDashboard },
    { id: "products", label: isAr ? "المنتجات" : "Products", icon: PackageSearch },
    { id: "reviews", label: isAr ? "التقييمات" : "Reviews", icon: MessageSquare },
    { id: "leads", label: isAr ? "العملاء المحتملين" : "Leads", icon: Users },
    { id: "settings", label: isAr ? "الإعدادات" : "Settings", icon: Settings },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === storedUsername && passwordInput === storedPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
      setLoginError(false);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 3000);
    }
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername) {
      localStorage.setItem("adminUsername", newUsername);
      setStoredUsername(newUsername);
    }
    if (newPassword) {
      localStorage.setItem("adminPassword", newPassword);
      setStoredPassword(newPassword);
    }
    setNewUsername("");
    setNewPassword("");
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen bg-background flex flex-col justify-center items-center p-4 ${isAr ? "rtl" : ""}`}>
        <div className="w-full max-w-md bg-card p-8 rounded-[2rem] border border-border/50 shadow-2xl relative overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 shadow-sm border border-primary/20">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-foreground mb-2 tracking-tight">
              {isAr ? "تسجيل الدخول للإدارة" : "Admin Login"}
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              {isAr ? "الرجاء إدخال بيانات الاعتماد الخاصة بك للمتابعة." : "Please enter your credentials to continue."}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-muted-foreground">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={isAr ? "اسم المستخدم" : "Username"}
                  className={`w-full bg-background border text-foreground text-sm rounded-xl focus:ring-primary focus:border-primary block ps-11 p-3 shadow-sm transition-colors ${
                    loginError ? "border-destructive focus:border-destructive ring-destructive/20" : "border-input"
                  }`}
                  autoFocus
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-muted-foreground">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder={isAr ? "كلمة المرور" : "Password"}
                  className={`w-full bg-background border text-foreground text-sm rounded-xl focus:ring-primary focus:border-primary block ps-11 p-3 shadow-sm transition-colors ${
                    loginError ? "border-destructive focus:border-destructive ring-destructive/20" : "border-input"
                  }`}
                />
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 text-destructive text-sm font-semibold bg-destructive/10 p-3 rounded-xl border border-destructive/20 animate-in fade-in slide-in-from-top-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{isAr ? "كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى." : "Incorrect password, please try again."}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full text-primary-foreground bg-primary hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 rounded-xl text-sm font-bold px-5 py-3.5 text-center shadow-lg shadow-primary/30 transition-all hover:scale-[1.02]"
            >
              {isAr ? "دخول آمن" : "Secure Login"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-border pt-6">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:underline">
              {isAr ? "← العودة للموقع الرئيسي" : "← Back to Main Site"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-muted/20 flex flex-col md:flex-row font-sans ${isAr ? "rtl" : ""}`}>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 flex items-center justify-center bg-primary rounded-lg text-primary-foreground shadow-sm">
            <HeartPulse className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Admin cPanel</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-muted-foreground hover:bg-muted rounded-md">
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isMobileMenuOpen ? "flex" : "hidden"} 
        md:flex w-full md:w-64 bg-card border-r border-border shadow-sm flex-col absolute md:relative z-40 min-h-screen h-full
      `}>
        <div className="hidden md:flex p-6 items-center gap-3 border-b border-border">
          <div className="h-10 w-10 flex items-center justify-center bg-primary rounded-xl text-primary-foreground shadow-sm">
            <HeartPulse className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl truncate tracking-tight">Admin cPanel</span>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === item.id 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className={`h-5 w-5 ${activeTab === item.id ? "text-primary-foreground" : "text-muted-foreground"}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border mt-auto space-y-2">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200">
            <LogOut className="h-5 w-5" />
            <span>{isAr ? "تسجيل الخروج" : "Logout"}</span>
          </button>
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/80 transition-all duration-200">
            <ArrowUpRight className="h-5 w-5" />
            <span>{isAr ? "الموقع المباشر" : "Live Site"}</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 lg:p-10 overflow-y-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              {isAr ? "مرحباً بكم في لوحة التحكم" : "Welcome back, Admin"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {isAr ? "إليك نظرة عامة على أداء موقعك اليوم." : "Here's an overview of your site's performance today."}
            </p>
          </div>
          
          <Link to="/" className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
            {isAr ? "رؤية الموقع الحقيقي" : "View Live Site"}
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </header>

        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat, idx) => (
                <div key={idx} className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
                    <stat.icon className="w-20 h-20" />
                  </div>
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">{stat.name}</h3>
                  </div>
                  <div className="flex items-end justify-between relative z-10">
                    <span className="text-3xl font-bold text-foreground tracking-tighter">{stat.value}</span>
                    <span className={`text-sm font-semibold px-2 py-1 rounded-md ${stat.trend === "up" ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity Section */}
            <section className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                <h2 className="text-xl font-bold text-foreground">
                  {isAr ? "النشاطات الأخيرة" : "Recent Activity"}
                </h2>
                <button className="text-sm text-primary font-medium hover:underline">
                  {isAr ? "عرض الكل" : "View All"}
                </button>
              </div>
              <div className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-medium">{isAr ? "المستخدم" : "User"}</th>
                        <th className="px-6 py-4 font-medium">{isAr ? "الإجراء" : "Action"}</th>
                        <th className="px-6 py-4 font-medium">{isAr ? "الوقت" : "Time"}</th>
                        <th className="px-6 py-4 font-medium">{isAr ? "الحالة" : "Status"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((activity, idx) => (
                        <tr key={idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-semibold text-foreground">{activity.user}</td>
                          <td className="px-6 py-4 text-muted-foreground">{activity.action}</td>
                          <td className="px-6 py-4 text-muted-foreground">{activity.time}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              activity.status === "Success" ? "bg-emerald-500/10 text-emerald-500" :
                              activity.status === "Pending" ? "bg-amber-500/10 text-amber-500" :
                              "bg-blue-500/10 text-blue-500"
                            }`}>
                              {activity.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {isAr ? "المنتجات المتاحة" : "Available Products"}
              </h2>
              {!editingProduct && (
                <button onClick={() => setEditingProduct("new")} className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold shadow hover:bg-primary/90 transition-colors">
                  {isAr ? "إضافة منتج" : "Add Product"}
                </button>
              )}
            </div>
            
            {editingProduct ? (
               <ProductAdminForm 
                  product={editingProduct === "new" ? null : editingProduct}
                  onSave={(p) => {
                     if (editingProduct === "new") addProduct(p);
                     else updateProduct(p.slug, p);
                     setEditingProduct(null);
                  }}
                  onCancel={() => setEditingProduct(null)}
               />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <div key={product.slug} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
                    {product.mainImage && (
                      <div className="h-40 w-full overflow-hidden border-b border-border">
                        <img 
                          src={product.mainImage} 
                          alt={product.name[lang as 'ar' | 'en']} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                    )}
                    <div className="p-6 flex items-start gap-4 border-b border-border/50 bg-muted/10 relative overflow-hidden">
                      {/* Background Icon Decoration */}
                      <div className="absolute right-0 top-0 opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 pointer-events-none p-4">
                        <product.icon className="h-24 w-24" />
                      </div>
                      
                      <div className={`h-12 w-12 rounded-xl flex flex-shrink-0 items-center justify-center relative z-10 ${product.accentClassName}`}>
                        <product.icon className="h-6 w-6" />
                      </div>
                      <div className="relative z-10 pr-6">
                        <h3 className="text-lg font-bold text-foreground">{product.name[lang as 'ar' | 'en']}</h3>
                        <p className="text-xs font-semibold tracking-wider text-muted-foreground mt-1">{product.type.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{product.description[lang as 'ar' | 'en']}</p>
                      <div className="text-sm font-bold text-primary px-3 py-1.5 bg-primary/10 inline-block rounded-lg self-start">
                         {product.price[lang as 'ar' | 'en']}
                      </div>
                    </div>
                    <div className="p-4 border-t border-border flex justify-end gap-2 bg-muted/20">
                      <button onClick={() => {
                        if (confirm(isAr ? "هل أنت متأكد من حذف هذا المنتج؟" : "Are you sure you want to delete this product?")) {
                           deleteProduct(product.slug);
                        }
                      }} className="px-3 py-2 text-xs font-bold rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                        {isAr ? "حذف" : "Delete"}
                      </button>
                      <button onClick={() => setEditingProduct(product)} className="px-4 py-2 text-xs font-bold rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors">
                        {isAr ? "تعديل" : "Edit"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {isAr ? "إعدادات الأمان" : "Security Settings"}
            </h2>

            <form onSubmit={handleUpdateSettings} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    {isAr ? "اسم المستخدم الجديد" : "New Username"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-muted-foreground">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={e => setNewUsername(e.target.value)}
                      placeholder={storedUsername}
                      className="w-full bg-background border border-input text-foreground text-sm rounded-xl focus:ring-primary focus:border-primary block ps-11 p-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    {isAr ? "كلمة المرور الجديدة" : "New Password"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-muted-foreground">
                      <Key className="w-5 h-5" />
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-background border border-input text-foreground text-sm rounded-xl focus:ring-primary focus:border-primary block ps-11 p-3"
                    />
                  </div>
                </div>

                {settingsSuccess && (
                  <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl text-sm font-semibold border border-emerald-500/20">
                    {isAr ? "تم تحديث بيانات الدخول بنجاح!" : "Login credentials updated successfully!"}
                  </div>
                )}

                <div className="pt-4 border-t border-border flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    {isAr ? "حفظ الإعدادات" : "Save Settings"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Active Tab Condition checks */}
        {activeTab === "reviews" && <ReviewAdminPanel />}

        {/* Placeholder for other tabs */}
        {activeTab !== "dashboard" && activeTab !== "products" && activeTab !== "settings" && activeTab !== "reviews" && (
          <div className="flex flex-col items-center justify-center h-[50vh] animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 mb-6 text-muted border border-border/50 rounded-full flex items-center justify-center bg-card shadow-sm">
              <Settings className="w-10 h-10 animate-[spin_4s_linear_infinite]" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isAr ? "قريباً" : "Coming Soon"}
            </h2>
            <p className="text-muted-foreground text-center max-w-sm">
              {isAr 
                ? "هذا القسم لا يزال قيد التطوير وسيتم إضافته قريباً." 
                : "This section is currently under construction. Stay tuned for updates!"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
