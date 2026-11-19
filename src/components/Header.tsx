import { useEffect, useRef, useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { formatFaNumber } from '../data/carpets';

interface HeaderProps {
  cartCount: number;
  activeSection: string;
  onOpenCart: () => void;
}

const NAV_LINKS = [
  { id: 'shop', label: 'فروشگاه', href: '#shop' },
  { id: 'showroom', label: 'نمایشگاه مجازی', href: '#showroom' },
  { id: 'schools', label: 'مکاتب بافت', href: '#schools' },
  { id: 'story', label: 'داستان و اصالت', href: '#story' },
];

export function Header({ cartCount, activeSection, onOpenCart }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mobileMenuOpen]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        پرش به محتوای اصلی
      </a>

      <header className="sticky top-0 z-40 border-b border-[var(--kf-border)] bg-[var(--kf-bg)]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-8 px-4 sm:px-6">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#top"
            className="font-display text-2xl sm:text-[1.7rem] font-bold tracking-tight text-[var(--kf-ink)] whitespace-nowrap shrink-0 rounded-md px-1 py-0.5 transition-colors hover:text-[var(--kf-crimson)]"
          >
            خانه فرش
          </a>

          {/* Zone 2: 4 Clean Single-Line Navigation Links */}
          <nav aria-label="ناوبری اصلی" className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  aria-current={isActive ? 'location' : undefined}
                  className={`relative py-2 text-[14px] font-medium whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-[var(--kf-crimson)] font-semibold'
                      : 'text-[var(--kf-ink-secondary)] hover:text-[var(--kf-crimson)]'
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 right-0 h-0.5 rounded-full bg-[var(--kf-crimson)] transition-all duration-200 ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action (Cart) + Mobile Drawer Trigger */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`باز کردن سبد خرید، ${formatFaNumber(cartCount)} کالا`}
              className="inline-flex h-11 items-center gap-2.5 rounded-xl bg-[var(--kf-dark)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--kf-crimson)] whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>سبد خرید</span>
              <span className="inline-flex min-w-[24px] items-center justify-center rounded-md bg-white/15 px-1.5 py-0.5 text-xs font-bold tabular-nums">
                {formatFaNumber(cartCount)}
              </span>
            </button>

            <button
              ref={menuBtnRef}
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="باز کردن منوی ناوبری"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] text-[var(--kf-ink)] md:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="منوی ناوبری موبایل"
            className="fixed inset-y-0 right-0 flex w-72 max-w-[85vw] flex-col bg-[var(--kf-surface)] p-6 shadow-2xl border-l border-[var(--kf-border)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--kf-border)] pb-4">
              <span className="font-display text-2xl font-bold text-[var(--kf-ink)]">
                خانه فرش
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="بستن منو"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--kf-border)] text-[var(--kf-ink)] hover:bg-[var(--kf-surface-alt)]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <ul className="mt-6 flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive ? 'location' : undefined}
                      className={`flex min-h-[44px] items-center rounded-xl px-4 text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-[var(--kf-surface-alt)] text-[var(--kf-crimson)] font-semibold border border-[var(--kf-border)]'
                          : 'text-[var(--kf-ink-secondary)] hover:bg-[var(--kf-surface-alt)]'
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="mt-auto border-t border-[var(--kf-border)] pt-4 text-sm text-[var(--kf-muted)]">
              <p className="font-medium text-[var(--kf-ink)]">پشتیبانی و مشاوره خرید</p>
              <a
                href="tel:02112345678"
                className="mt-1 inline-flex min-h-[40px] items-center font-semibold text-[var(--kf-crimson)] tabular-nums"
              >
                ۰۲۱-۱۲۳۴۵۶۷۸
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
