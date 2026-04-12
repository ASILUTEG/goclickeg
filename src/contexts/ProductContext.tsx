import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { products as initialProducts, type ProductContent } from "@/content/products";
import { FlaskConical, Stethoscope, Monitor, Package } from "lucide-react";
import { API_BASE } from "@/lib/api";

type ProductContextType = {
  products: ProductContent[];
  addProduct: (product: ProductContent) => void;
  updateProduct: (slug: string, product: ProductContent) => void;
  deleteProduct: (slug: string) => void;
  addReview: (slug: string, review: { name: string, title?: string, quote: string }) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const ICON_MAP: Record<string, any> = {
  golab: FlaskConical,
  goclinic: Stethoscope,
  gohospital: Monitor,
};

function hydrateProducts(data: any[]): ProductContent[] {
  return data.map((p: any) => ({
    ...p,
    icon: ICON_MAP[p.slug] || Package
  }));
}

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<ProductContent[]>(initialProducts);
  const [mounted, setMounted] = useState(false);

  // Centralized fetch that all mutations call after saving
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(hydrateProducts(data));
          console.log("[ProductContext] Loaded", data.length, "products from API");
          return true;
        }
      } else {
        console.error("[ProductContext] API returned", res.status);
      }
    } catch (e) {
      console.error("[ProductContext] Failed to fetch products:", e);
    }
    return false;
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (p: ProductContent) => {
    // Optimistic update
    const withIcon = { ...p, icon: ICON_MAP[p.slug] || Package };
    setProducts(prev => [...prev, withIcon]);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(p)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("[ProductContext] addProduct failed:", res.status, err);
      }
      // Re-fetch from DB to get the canonical state
      await fetchProducts();
    } catch(e) { console.error("[ProductContext] addProduct error:", e); }
  };

  const updateProduct = async (slug: string, p: ProductContent) => {
    // Optimistic update
    const withIcon = { ...p, icon: ICON_MAP[p.slug] || Package };
    setProducts(prev => prev.map(prod => prod.slug === slug ? withIcon : prod));
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/products/${slug}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(p)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("[ProductContext] updateProduct failed:", res.status, err);
        alert("Failed to save product. Check console for details.");
      } else {
        console.log("[ProductContext] Product updated successfully:", slug);
      }
      // Re-fetch from DB to get the canonical state
      await fetchProducts();
    } catch(e) { 
      console.error("[ProductContext] updateProduct error:", e);
      alert("Network error saving product. Is the backend running?");
    }
  };

  const deleteProduct = async (slug: string) => {
    setProducts(prev => prev.filter(prod => prod.slug !== slug));
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/products/${slug}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) {
        console.error("[ProductContext] deleteProduct failed:", res.status);
      }
      // Re-fetch from DB
      await fetchProducts();
    } catch(e) { console.error("[ProductContext] deleteProduct error:", e); }
  };

  const addReview = async (slug: string, review: { name: string, title?: string, quote: string }) => {
    setProducts(prev => prev.map(p => {
      if (p.slug === slug) {
        return {
          ...p,
          success: [
            ...(p.success || []),
            {
              name: { ar: review.name, en: review.name },
              title: review.title ? { ar: review.title, en: review.title } : undefined,
              quote: { ar: review.quote, en: review.quote }
            }
          ]
        };
      }
      return p;
    }));

    try {
      await fetch(`${API_BASE}/products/${slug}/reviews`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(review)
      });
      // Re-fetch to get canonical state
      await fetchProducts();
    } catch(e) { console.error("[ProductContext] addReview error:", e); }
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch or rendering empty
  }

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, addReview }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within ProductProvider");
  return context;
};
