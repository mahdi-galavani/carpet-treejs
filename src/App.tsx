import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  ACTIVE_COUPON,
  byId,
  type CarpetProduct,
  type CarpetSchool,
  type CartItem,
} from './data/carpets';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ShopWorkspace } from './components/ShopWorkspace';
import { ShowroomSection } from './components/ShowroomSection';
import { StoryAndTrustSection } from './components/StoryAndTrustSection';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';

const CART_STORAGE_KEY = 'kf_cart';
const HC_STORAGE_KEY = 'kf_hc';
const LG_STORAGE_KEY = 'kf_lg';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
      if (Array.isArray(raw)) {
        return raw.filter((item) => byId(item.id) && item.qty > 0);
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  });

  const [couponApplied, setCouponApplied] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<CarpetSchool>('همه');
  const [activeProduct, setActiveProduct] = useState<CarpetProduct | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('shop');
  const [announcement, setAnnouncement] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    try {
      return localStorage.getItem(HC_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const [largeText, setLargeText] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LG_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  // Sync accessibility classes onto <html>
  useEffect(() => {
    document.documentElement.classList.toggle('hc-mode', highContrast);
    try {
      localStorage.setItem(HC_STORAGE_KEY, highContrast ? '1' : '0');
    } catch {
      // Ignore
    }
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.classList.toggle('large-text', largeText);
    try {
      localStorage.setItem(LG_STORAGE_KEY, largeText ? '1' : '0');
    } catch {
      // Ignore
    }
  }, [largeText]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  // IntersectionObserver to highlight active section in navigation bar
  useEffect(() => {
    const ids = ['schools', 'shop', 'showroom', 'story'];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const notify = useCallback((msg: string) => {
    setAnnouncement(msg);
    setToastMsg(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMsg(null);
    }, 2800);
  }, []);

  const handleAddToCart = useCallback(
    (product: CarpetProduct) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
        }
        return [...prev, { id: product.id, qty: 1 }];
      });
      notify(`«${product.name}» به سبد خرید اضافه شد.`);
    },
    [notify]
  );

  const handleChangeQty = useCallback((id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  }, []);

  const handleRemoveItem = useCallback((id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleApplyCoupon = useCallback(
    (rawCode: string): boolean => {
      const normalized = rawCode.trim().toUpperCase();
      if (normalized === ACTIVE_COUPON.code) {
        setCouponApplied(true);
        notify(`کد تخفیف ${ACTIVE_COUPON.code} اعمال شد.`);
        return true;
      }
      setCouponApplied(false);
      return false;
    },
    [notify]
  );

  const handleOrderComplete = useCallback(
    (trackingCode: string) => {
      setCart([]);
      setCouponApplied(false);
      notify(`سفارش شما با کد پیگیری ${trackingCode} ثبت شد.`);
    },
    [notify]
  );

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--kf-bg)] text-[var(--kf-ink)]">
      <Header
        cartCount={totalCartCount}
        activeSection={activeSection}
        onOpenCart={() => setCartOpen(true)}
      />

      <main id="main-content" className="flex-1">
        <HeroSection
          onExploreShop={() => {
            document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
            window.setTimeout(() => searchInputRef.current?.focus(), 350);
          }}
        />

        <ShopWorkspace
          selectedSchool={selectedSchool}
          onSelectSchool={setSelectedSchool}
          onOpenProduct={setActiveProduct}
          onAddToCart={handleAddToCart}
          highContrast={highContrast}
          onToggleHighContrast={() => {
            setHighContrast((prev) => {
              const next = !prev;
              notify(next ? 'حالت کنتراست بالا فعال شد.' : 'حالت کنتراست استاندارد فعال شد.');
              return next;
            });
          }}
          largeText={largeText}
          onToggleLargeText={() => {
            setLargeText((prev) => {
              const next = !prev;
              notify(next ? 'اندازه متن به حالت درشت‌تر تغییر یافت.' : 'اندازه متن به حالت استاندارد بازگشت.');
              return next;
            });
          }}
          searchInputRef={searchInputRef}
        />

        <ShowroomSection
          onOpenProduct={setActiveProduct}
          onAddToCart={handleAddToCart}
        />

        <StoryAndTrustSection />
      </main>

      <Footer />

      {/* Product Detail Modal */}
      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={(product) => {
          handleAddToCart(product);
          setCartOpen(true);
        }}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        cart={cart}
        couponApplied={couponApplied}
        onClose={() => setCartOpen(false)}
        onChangeQty={handleChangeQty}
        onRemoveItem={handleRemoveItem}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={() => setCouponApplied(false)}
        onProceedCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        cart={cart}
        couponApplied={couponApplied}
        onClose={() => setCheckoutOpen(false)}
        onOrderComplete={handleOrderComplete}
      />

      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Accessible Non-Blocking Toast Notification */}
      {toastMsg && (
        <div
          role="status"
          className="fixed bottom-5 left-5 z-50 flex items-center gap-2.5 rounded-xl border border-white/15 bg-[var(--kf-dark)] px-4 py-3 text-sm font-medium text-white shadow-xl"
        >
          <CheckCircle2 className="h-4 w-4 text-[var(--kf-brass-bright)] shrink-0" aria-hidden="true" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
