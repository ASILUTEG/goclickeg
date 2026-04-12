import { useState, useEffect, useCallback } from "react";
import { API_BASE } from "@/lib/api";
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
  MessageSquare,
  UserPlus,
  Pencil,
  Trash2,
  Shield,
  CheckCircle2,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Plus,
  Youtube,
  PlayCircle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProducts } from "@/contexts/ProductContext";
import { products } from "@/content/products";
import { ProductAdminForm } from "@/components/ProductAdminForm";
import { ReviewAdminPanel } from "@/components/ReviewAdminPanel";
import { ServiceAdminForm } from "@/components/ServiceAdminForm";
import type { CustomService } from "@/components/ServiceAdminForm";
import type { ProductContent } from "@/content/products";
import { Globe } from "lucide-react";

const Admin = () => {
  const { lang } = useLanguage();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  // Language flag — declare early so all hooks below can use it
  const isAr = lang === "ar";

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductContent | "new" | null>(null);
  const [loadingEditSlug, setLoadingEditSlug] = useState<string | null>(null);

  // ── Auth State — MUST be declared before any useEffect that depends on isAuthenticated ──
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem("adminAuth") === "true");
  const [storedUsername, setStoredUsername] = useState(() => localStorage.getItem("adminUsername") || "admin");

  // ── Services State ──
  const [services, setServices] = useState<CustomService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [editingService, setEditingService] = useState<CustomService | 'new' | null>(null);
  const [serviceSaving, setServiceSaving] = useState(false);
  const [loadingServiceId, setLoadingServiceId] = useState<number | null>(null);

  const fetchServices = async () => {
    setServicesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/services`);
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch(e) { console.error(e); }
    finally { setServicesLoading(false); }
  };

  useEffect(() => { if (isAuthenticated && activeTab === 'services') fetchServices(); }, [isAuthenticated, activeTab]);

  const fetchAndEditService = async (id: number) => {
    setLoadingServiceId(id);
    try {
      const res = await fetch(`${API_BASE}/services`);
      const data: CustomService[] = await res.json();
      const found = data.find(s => s.id === id);
      if (found) setEditingService(found);
    } catch(e) { console.error(e); }
    finally { setLoadingServiceId(null); }
  };

  const handleSaveService = async (s: CustomService) => {
    setServiceSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const isNew = !s.id;
      const res = await fetch(
        isNew ? `${API_BASE}/services` : `${API_BASE}/services/${s.id}`,
        { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(s) }
      );
      if (!res.ok) throw new Error('Save failed');
      await fetchServices();
      setEditingService(null);
    } catch(e) { console.error(e); alert(isAr ? 'فشل الحفظ' : 'Save failed'); }
    finally { setServiceSaving(false); }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذه الخدمة؟' : 'Delete this service?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${API_BASE}/services/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      setServices(prev => prev.filter(s => s.id !== id));
    } catch(e) { console.error(e); }
  };

  // Fetch a single product fresh from DB before opening the edit form
  const fetchAndEdit = async (slug: string) => {
    setLoadingEditSlug(slug);
    try {
      const res = await fetch(`${API_BASE}/products/${slug}`);
      if (!res.ok) throw new Error('Failed to load product');
      const data = await res.json();
      const ICON_MAP: Record<string, any> = {
        golab: (await import('lucide-react')).FlaskConical,
        goclinic: (await import('lucide-react')).Stethoscope,
        gohospital: (await import('lucide-react')).Monitor,
      };
      const { Package } = await import('lucide-react');
      setEditingProduct({ ...data, icon: ICON_MAP[data.slug] || Package });
    } catch (e) {
      console.error(e);
      alert(isAr ? 'فشل تحميل بيانات المنتج' : 'Failed to load product data');
    } finally {
      setLoadingEditSlug(null);
    }
  };

  // Move a product up or down and persist the new order to DB
  const reorderProducts = async (slug: string, direction: 'up' | 'down') => {
    const sorted = [...products].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    const idx = sorted.findIndex(p => p.slug === slug);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    // Swap sort_order values
    const aOrder = sorted[idx].sort_order ?? idx + 1;
    const bOrder = sorted[swapIdx].sort_order ?? swapIdx + 1;
    sorted[idx] = { ...sorted[idx], sort_order: bOrder };
    sorted[swapIdx] = { ...sorted[swapIdx], sort_order: aOrder };

    // Optimistically update local state via updateProduct (order field only)
    updateProduct(sorted[idx].slug, sorted[idx]);
    updateProduct(sorted[swapIdx].slug, sorted[swapIdx]);

    // Persist to DB
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${API_BASE}/products/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          items: [
            { slug: sorted[idx].slug, sort_order: bOrder },
            { slug: sorted[swapIdx].slug, sort_order: aOrder }
          ]
        })
      });
    } catch(e) { console.error('Reorder save failed', e); }
  };
  
  // Login Engine State — moved to top (above services useEffect) to avoid TDZ crash

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  // Settings UI State
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // ── Users State ──
  type AppUser = { id: number; username: string; role: string; created_at: string };
  const [users, setUsers] = useState<AppUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [userModal, setUserModal] = useState<{ mode: 'add' | 'edit'; user?: AppUser } | null>(null);
  const [userFormData, setUserFormData] = useState({ username: '', password: '', role: 'admin' });
  const [userFormError, setUserFormError] = useState("");
  const [userFormSuccess, setUserFormSuccess] = useState("");

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
  });

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError("");
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/users`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setUsers(data);
    } catch (err: any) {
      setUsersError((isAr ? 'فشل تحميل المستخدمين: ' : 'Failed to load users: ') + (err.message || ''));
    }
    finally { setUsersLoading(false); }
  }, [isAr]);

  useEffect(() => { if (isAuthenticated && activeTab === 'users') fetchUsers(); }, [isAuthenticated, activeTab, fetchUsers]);

  const openAddModal = () => {
    setUserFormData({ username: '', password: '', role: 'admin' });
    setUserFormError(''); setUserFormSuccess('');
    setUserModal({ mode: 'add' });
  };
  const openEditModal = (u: AppUser) => {
    setUserFormData({ username: u.username, password: '', role: u.role });
    setUserFormError(''); setUserFormSuccess('');
    setUserModal({ mode: 'edit', user: u });
  };

  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError(''); setUserFormSuccess('');
    try {
      let res: Response;
      if (userModal?.mode === 'add') {
        res = await fetch(`${API_BASE}/users`, {
          method: 'POST', headers: authHeaders(),
          body: JSON.stringify(userFormData)
        });
      } else {
        const payload: Record<string, string> = { role: userFormData.role };
        if (userFormData.username) payload.username = userFormData.username;
        if (userFormData.password) payload.password = userFormData.password;
        res = await fetch(`${API_BASE}/users/${userModal!.user!.id}`, {
          method: 'PUT', headers: authHeaders(),
          body: JSON.stringify(payload)
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setUserFormSuccess(isAr ? 'تم الحفظ بنجاح!' : 'Saved successfully!');
      fetchUsers();
      setTimeout(() => setUserModal(null), 1200);
    } catch (err: any) {
      setUserFormError(err.message || (isAr ? 'حدث خطأ' : 'An error occurred'));
    }
  };

  const handleDeleteUser = async (u: AppUser) => {
    if (!confirm(isAr ? `هل تريد حذف المستخدم "${u.username}"؟` : `Delete user "${u.username}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/users/${u.id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // isAr is declared at top of component (before hooks)
  
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
    { id: "services", label: isAr ? "الخدمات" : "Dev Services", icon: Globe },
    { id: "reviews", label: isAr ? "التقييمات" : "Reviews", icon: MessageSquare },
    { id: "users", label: isAr ? "المستخدمون" : "Users", icon: Users },
    { id: "leads", label: isAr ? "العملاء المحتملين" : "Leads", icon: Shield },
    { id: "settings", label: isAr ? "الإعدادات" : "Settings", icon: Settings },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setIsAuthenticated(true);
        sessionStorage.setItem("adminAuth", "true");
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUsername", usernameInput);
        setStoredUsername(usernameInput);
        setLoginError(false);
      } else {
        throw new Error(data.error);
      }
    } catch(err) {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 3000);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/auth/settings`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ newUsername, newPassword })
      });
      if (res.ok) {
        if (newUsername) {
          localStorage.setItem("adminUsername", newUsername);
          setStoredUsername(newUsername);
        }
        setNewUsername("");
        setNewPassword("");
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
    localStorage.removeItem("adminToken");
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
              <div className="space-y-3">
                {[...products]
                  .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                  .map((product, idx, arr) => (
                  <div key={product.slug} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow flex items-stretch group">
                    {/* Sort Controls */}
                    <div className="flex flex-col items-center justify-center gap-1 px-3 border-r border-border bg-muted/30 py-3">
                      <span className="text-[11px] font-bold text-muted-foreground mb-1">#{product.sort_order ?? idx + 1}</span>
                      <button
                        onClick={() => reorderProducts(product.slug, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded-md hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                        title={isAr ? 'تحريك لأعلى' : 'Move up'}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => reorderProducts(product.slug, 'down')}
                        disabled={idx === arr.length - 1}
                        className="p-1 rounded-md hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                        title={isAr ? 'تحريك لأسفل' : 'Move down'}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Product Image */}
                    <div className="w-28 flex-shrink-0 overflow-hidden border-r border-border">
                      <img
                        src={product.mainImage || "https://placehold.co/200x200/1e293b/94a3b8?text=No+Image"}
                        alt={product.name[lang as 'ar' | 'en']}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/200x200/1e293b/94a3b8?text=No+Image"; }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-4 flex items-center gap-4 min-w-0">
                      <div className={`h-10 w-10 rounded-xl flex-shrink-0 flex items-center justify-center ${product.accentClassName}`}>
                        <product.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-foreground truncate">{product.name[lang as 'ar' | 'en']}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{product.type}</p>
                          {product.youtubePlaylistUrl && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/20">
                              <Youtube className="w-3 h-3" />
                              {isAr ? "قائمة تشغيل" : "Playlist"}
                            </span>
                          )}
                          {product.youtubeId && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-[10px] font-bold border border-blue-500/20">
                              <PlayCircle className="w-3 h-3" />
                              {isAr ? "شرح" : "Demo"}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{product.description[lang as 'ar' | 'en']}</p>
                      </div>
                    </div>

                    {/* Price + Actions */}
                    <div className="flex flex-col items-end justify-between p-4 border-l border-border bg-muted/10 gap-3">
                      <span className="text-sm font-bold text-primary px-2.5 py-1 bg-primary/10 rounded-lg whitespace-nowrap">
                        {product.price[lang as 'ar' | 'en']}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => {
                          if (confirm(isAr ? "هل أنت متأكد من حذف هذا المنتج؟" : "Are you sure you want to delete this product?")) {
                            deleteProduct(product.slug);
                          }
                        }} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                          {isAr ? "حذف" : "Delete"}
                        </button>
                        <button
                          onClick={() => fetchAndEdit(product.slug)}
                          disabled={loadingEditSlug === product.slug}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors disabled:opacity-60 flex items-center gap-1.5"
                        >
                          {loadingEditSlug === product.slug && (
                            <span className="w-3 h-3 border-2 border-foreground/40 border-t-foreground rounded-full animate-spin" />
                          )}
                          {isAr ? "تعديل" : "Edit"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{isAr ? "خدمات التطوير" : "Development Services"}</h2>
                <p className="text-sm text-muted-foreground mt-1">{isAr ? "إدارة خدمات تطوير المواقع والتطبيقات" : "Manage website, desktop and mobile development services"}</p>
              </div>
              {!editingService && (
                <button onClick={() => setEditingService('new')}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold shadow hover:bg-primary/90 transition-colors">
                  <Plus className="w-4 h-4" />
                  {isAr ? "إضافة خدمة" : "Add Service"}
                </button>
              )}
            </div>

            {editingService ? (
              <ServiceAdminForm
                service={editingService === 'new' ? null : editingService}
                saving={serviceSaving}
                onSave={handleSaveService}
                onCancel={() => setEditingService(null)}
              />
            ) : (
              <div className="space-y-3">
                {servicesLoading ? (
                  <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    {isAr ? 'جاري التحميل...' : 'Loading...'}
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">{isAr ? 'لا توجد خدمات بعد' : 'No services yet'}</div>
                ) : (
                  services.map(s => {
                    const TYPE_ICON: Record<string, any> = { website: Globe, desktop: Pencil, mobile: Pencil };
                    const TYPE_COLOR: Record<string, string> = {
                      website: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                      desktop: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
                      mobile: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                    };
                    const TYPE_LABEL: Record<string, string> = {
                      website: isAr ? 'موقع ويب' : 'Website',
                      desktop: isAr ? 'سطح المكتب' : 'Desktop',
                      mobile: isAr ? 'جوال' : 'Mobile',
                    };
                    return (
                      <div key={s.id} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow flex items-stretch group">
                        {/* Image */}
                        <div className="w-28 flex-shrink-0 overflow-hidden border-e border-border">
                          <img
                            src={s.mainImage || 'https://placehold.co/200x200/1e293b/94a3b8?text=Svc'}
                            alt={s.name[lang as 'ar' | 'en']}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/200x200/1e293b/94a3b8?text=Svc'; }}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 p-4 flex items-center gap-4 min-w-0">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${TYPE_COLOR[s.type]}`}>
                                {TYPE_LABEL[s.type]}
                              </span>
                              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                s.is_active ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-muted text-muted-foreground border border-border'
                              }`}>
                                {s.is_active ? (isAr ? 'مفعّل' : 'Active') : (isAr ? 'مخفي' : 'Hidden')}
                              </span>
                              <span className="text-[11px] text-muted-foreground font-mono">#{s.sort_order}</span>
                            </div>
                            <h3 className="font-bold text-foreground truncate">{s.name[lang as 'ar' | 'en']}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{s.description[lang as 'ar' | 'en']}</p>
                          </div>
                        </div>

                        {/* Price + Actions */}
                        <div className="flex flex-col items-end justify-between p-4 border-s border-border bg-muted/10 gap-3">
                          <span className="text-sm font-bold text-primary px-2.5 py-1 bg-primary/10 rounded-lg whitespace-nowrap">
                            {s.price[lang as 'ar' | 'en']}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteService(s.id!)}
                              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                              {isAr ? 'حذف' : 'Delete'}
                            </button>
                            <button
                              onClick={() => fetchAndEditService(s.id!)}
                              disabled={loadingServiceId === s.id}
                              className="px-3 py-1.5 text-xs font-bold rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors disabled:opacity-60 flex items-center gap-1.5">
                              {loadingServiceId === s.id && <span className="w-3 h-3 border-2 border-foreground/40 border-t-foreground rounded-full animate-spin" />}
                              {isAr ? 'تعديل' : 'Edit'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
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

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{isAr ? "إدارة المستخدمين" : "User Management"}</h2>
                <p className="text-sm text-muted-foreground mt-1">{isAr ? "إضافة أو تعديل أو حذف حسابات المستخدمين" : "Add, edit or remove admin accounts"}</p>
              </div>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold shadow hover:bg-primary/90 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                {isAr ? "إضافة مستخدم" : "Add User"}
              </button>
            </div>

            {usersError && (
              <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-xl border border-destructive/20 text-sm font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{usersError}
              </div>
            )}

            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-medium">#</th>
                      <th className="px-6 py-4 font-medium">{isAr ? "اسم المستخدم" : "Username"}</th>
                      <th className="px-6 py-4 font-medium">{isAr ? "الصلاحية" : "Role"}</th>
                      <th className="px-6 py-4 font-medium">{isAr ? "تاريخ الإنشاء" : "Created At"}</th>
                      <th className="px-6 py-4 font-medium text-center">{isAr ? "إجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersLoading ? (
                      <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                        <div className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />{isAr ? 'جاري التحميل...' : 'Loading...'}</div>
                      </td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">{isAr ? 'لا يوجد مستخدمون' : 'No users found'}</td></tr>
                    ) : users.map((u) => (
                      <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{u.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                              {u.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-foreground">{u.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                          }`}>{u.role}</span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(u)}
                              className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                              title={isAr ? 'تعديل' : 'Edit'}
                            ><Pencil className="w-4 h-4" /></button>
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-2 rounded-lg bg-muted hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                              title={isAr ? 'حذف' : 'Delete'}
                            ><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* User Modal */}
        {userModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-foreground">
                  {userModal.mode === 'add'
                    ? (isAr ? 'إضافة مستخدم جديد' : 'Add New User')
                    : (isAr ? 'تعديل المستخدم' : 'Edit User')}
                </h3>
                <button onClick={() => setUserModal(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleUserFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">{isAr ? 'اسم المستخدم' : 'Username'}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={userFormData.username}
                      onChange={e => setUserFormData(p => ({ ...p, username: e.target.value }))}
                      placeholder={userModal.mode === 'edit' ? (isAr ? 'اتركه فارغاً للإبقاء على الحالي' : 'Leave blank to keep current') : ''}
                      required={userModal.mode === 'add'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">{isAr ? 'كلمة المرور' : 'Password'}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="password"
                      value={userFormData.password}
                      onChange={e => setUserFormData(p => ({ ...p, password: e.target.value }))}
                      placeholder={userModal.mode === 'edit' ? (isAr ? 'اتركه فارغاً للإبقاء على الحالي' : 'Leave blank to keep current') : ''}
                      required={userModal.mode === 'add'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">{isAr ? 'الصلاحية' : 'Role'}</label>
                  <select
                    value={userFormData.role}
                    onChange={e => setUserFormData(p => ({ ...p, role: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                  >
                    <option value="admin">admin</option>
                    <option value="viewer">viewer</option>
                    <option value="editor">editor</option>
                  </select>
                </div>

                {userFormError && (
                  <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-2.5 rounded-xl border border-destructive/20 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />{userFormError}
                  </div>
                )}
                {userFormSuccess && (
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />{userFormSuccess}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setUserModal(null)}
                    className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button type="submit"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors shadow">
                    <Save className="w-4 h-4" />{isAr ? 'حفظ' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== "dashboard" && activeTab !== "products" && activeTab !== "services" && activeTab !== "settings" && activeTab !== "reviews" && activeTab !== "users" && (
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
