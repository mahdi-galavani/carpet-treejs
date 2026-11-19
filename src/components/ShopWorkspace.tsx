import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  Contrast,
  Eye,
  LayoutGrid,
  List,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star,
  Type,
  X,
} from 'lucide-react';
import {
  PRODUCTS,
  SCHOOLS,
  formatFaNumber,
  toFaDigits,
  type CarpetProduct,
  type CarpetSchool,
  type PriceBucket,
  type SortOption,
} from '../data/carpets';
import { PersianRugVisual } from './PersianRugVisual';

interface ShopWorkspaceProps {
  selectedSchool: CarpetSchool;
  onSelectSchool: (school: CarpetSchool) => void;
  onOpenProduct: (product: CarpetProduct) => void;
  onAddToCart: (product: CarpetProduct) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  largeText: boolean;
  onToggleLargeText: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

const MATERIALS = ['همه', 'پشم و ابریشم', 'پشم دست‌ریس', 'پشم', 'ابریشم'] as const;

const PRICE_BUCKETS: { id: PriceBucket; label: string }[] = [
  { id: 'all', label: 'همه قیمت‌ها' },
  { id: 'under30', label: 'زیر ۳۰ میلیون تومان' },
  { id: '30to50', label: '۳۰ تا ۵۰ میلیون تومان' },
  { id: 'over50', label: 'بالای ۵۰ میلیون تومان' },
  { id: 'discounted', label: 'فقط دارای تخفیف ویژه' },
];

export function ShopWorkspace({
  selectedSchool,
  onSelectSchool,
  onOpenProduct,
  onAddToCart,
  highContrast,
  onToggleHighContrast,
  largeText,
  onToggleLargeText,
  searchInputRef,
}: ShopWorkspaceProps) {
  const [query, setQuery] = useState('');
  const [material, setMaterial] = useState<string>('همه');
  const [priceBucket, setPriceBucket] = useState<PriceBucket>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<number | null>(null);
  const shopSectionRef = useRef<HTMLElement>(null);

  // Keyboard shortcut "/" focuses catalog search cleanly
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (e.key === 'Escape' && mobileFiltersOpen) {
        setMobileFiltersOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileFiltersOpen, searchInputRef]);

  const schoolCounts = useMemo(() => {
    const counts: Record<string, number> = { همه: PRODUCTS.length };
    for (const p of PRODUCTS) {
      counts[p.cat] = (counts[p.cat] || 0) + 1;
    }
    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => {
      if (selectedSchool !== 'همه' && p.cat !== selectedSchool) return false;
      if (material !== 'همه' && p.material !== material) return false;
      if (priceBucket === 'under30' && p.price >= 30_000_000) return false;
      if (priceBucket === '30to50' && (p.price < 30_000_000 || p.price > 50_000_000)) return false;
      if (priceBucket === 'over50' && p.price <= 50_000_000) return false;
      if (priceBucket === 'discounted' && !p.old) return false;
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.cat.toLowerCase().includes(q) &&
        !p.code.toLowerCase().includes(q) &&
        !p.material.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });

    switch (sortBy) {
      case 'cheap':
        return [...list].sort((a, b) => a.price - b.price);
      case 'expensive':
        return [...list].sort((a, b) => b.price - a.price);
      case 'rate':
        return [...list].sort((a, b) => b.rating - a.rating);
      default:
        return [...list].sort((a, b) => b.reviews - a.reviews);
    }
  }, [selectedSchool, material, priceBucket, query, sortBy]);

  const activeFilterCount =
    (selectedSchool !== 'همه' ? 1 : 0) +
    (material !== 'همه' ? 1 : 0) +
    (priceBucket !== 'all' ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const resetAllFilters = () => {
    onSelectSchool('همه');
    setMaterial('همه');
    setPriceBucket('all');
    setQuery('');
    setSortBy('popular');
  };

  const handleQuickAdd = (product: CarpetProduct) => {
    onAddToCart(product);
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId((cur) => (cur === product.id ? null : cur));
    }, 1200);
  };

  const handleSchoolCardClick = (schoolId: CarpetSchool) => {
    onSelectSchool(schoolId);
    shopSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const filterSidebarContent = (
    <div className="space-y-6">
      {/* Search Input */}
      <div>
        <label
          htmlFor="catalog-search"
          className="block text-sm font-bold text-[var(--kf-ink)] mb-2"
        >
          جستجو در مجموعه
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--kf-muted)]"
            aria-hidden="true"
          />
          <input
            ref={searchInputRef}
            id="catalog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="نام فرش، مکتب یا کد (مثلاً KH-001)"
            className="min-h-[44px] w-full rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] pr-10 pl-10 text-sm text-[var(--kf-ink)] placeholder:text-[var(--kf-muted)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="پاک کردن متن جستجو"
              className="absolute left-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--kf-muted)] hover:bg-[var(--kf-surface-alt)] hover:text-[var(--kf-ink)]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <p className="mt-1.5 text-xs text-[var(--kf-muted)]">
          میانبر صفحه‌کلید: کلید <kbd className="rounded border border-[var(--kf-border)] px-1.5 py-0.5 font-mono text-[11px]">/</kbd>
        </p>
      </div>

      {/* School Filter */}
      <fieldset className="border-t border-[var(--kf-border)] pt-5">
        <legend className="text-sm font-bold text-[var(--kf-ink)] mb-3">مکتب بافت</legend>
        <div className="space-y-1.5">
          {(['همه', 'تبریز', 'هریس', 'اردبیل', 'آذربایجان'] as CarpetSchool[]).map((school) => {
            const active = selectedSchool === school;
            return (
              <button
                key={school}
                type="button"
                onClick={() => onSelectSchool(school)}
                aria-pressed={active}
                className={`flex min-h-[42px] w-full items-center justify-between rounded-xl px-3.5 text-sm transition-colors ${
                  active
                    ? 'bg-[var(--kf-dark)] text-white font-semibold'
                    : 'text-[var(--kf-ink-secondary)] hover:bg-[var(--kf-surface-alt)]'
                }`}
              >
                <span>{school === 'همه' ? 'همه مکاتب بافت' : `فرش ${school}`}</span>
                <span
                  className={`tabular-nums text-xs ${
                    active ? 'text-[#E6D6BC]' : 'text-[var(--kf-muted)]'
                  }`}
                >
                  {formatFaNumber(schoolCounts[school] || 0)}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Material Filter */}
      <fieldset className="border-t border-[var(--kf-border)] pt-5">
        <legend className="text-sm font-bold text-[var(--kf-ink)] mb-3">جنس الیاف</legend>
        <div className="space-y-1.5">
          {MATERIALS.map((mat) => {
            const active = material === mat;
            return (
              <button
                key={mat}
                type="button"
                onClick={() => setMaterial(mat)}
                aria-pressed={active}
                className={`flex min-h-[42px] w-full items-center justify-between rounded-xl px-3.5 text-sm transition-colors ${
                  active
                    ? 'bg-[var(--kf-surface-alt)] border border-[var(--kf-crimson)] text-[var(--kf-crimson)] font-semibold'
                    : 'text-[var(--kf-ink-secondary)] hover:bg-[var(--kf-surface-alt)]'
                }`}
              >
                <span>{mat === 'همه' ? 'همه الیاف' : mat}</span>
                {active && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Price Bucket Filter */}
      <fieldset className="border-t border-[var(--kf-border)] pt-5">
        <legend className="text-sm font-bold text-[var(--kf-ink)] mb-3">محدوده قیمت</legend>
        <div className="space-y-1.5">
          {PRICE_BUCKETS.map((bucket) => {
            const active = priceBucket === bucket.id;
            return (
              <button
                key={bucket.id}
                type="button"
                onClick={() => setPriceBucket(bucket.id)}
                aria-pressed={active}
                className={`flex min-h-[42px] w-full items-center justify-between rounded-xl px-3.5 text-sm text-right transition-colors ${
                  active
                    ? 'bg-[var(--kf-surface-alt)] border border-[var(--kf-crimson)] text-[var(--kf-crimson)] font-semibold'
                    : 'text-[var(--kf-ink-secondary)] hover:bg-[var(--kf-surface-alt)]'
                }`}
              >
                <span>{bucket.label}</span>
                {active && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </fieldset>

      {activeFilterCount > 0 && (
        <div className="border-t border-[var(--kf-border)] pt-5">
          <button
            type="button"
            onClick={resetAllFilters}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] px-4 text-sm font-semibold text-[var(--kf-ink)] hover:bg-[var(--kf-surface-alt)]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>پاک کردن همه فیلترها</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Weaving Schools Quick-Access Strip */}
      <section
        id="schools"
        aria-labelledby="schools-heading"
        className="mx-auto max-w-[1280px] px-4 pt-12 pb-6 sm:px-6 lg:pt-16"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-bold text-[var(--kf-brass)]">دسته‌بندی تخصصی</p>
            <h2
              id="schools-heading"
              className="font-display mt-1 text-3xl font-bold text-[var(--kf-ink)] sm:text-4xl"
            >
              مکاتب بافت فرش دستباف
            </h2>
          </div>
          {selectedSchool !== 'همه' && (
            <button
              type="button"
              onClick={() => onSelectSchool('همه')}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] px-4 text-sm font-semibold text-[var(--kf-ink)] hover:bg-[var(--kf-surface-alt)]"
            >
              <span>نمایش همه مکاتب</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SCHOOLS.map((school) => {
            const isSelected = selectedSchool === school.id;
            const count = schoolCounts[school.id] || 0;
            return (
              <button
                key={school.id}
                type="button"
                onClick={() => handleSchoolCardClick(school.id)}
                aria-pressed={isSelected}
                className={`group flex items-center gap-4 rounded-2xl border p-4 text-right transition-all ${
                  isSelected
                    ? 'border-[var(--kf-crimson)] bg-[var(--kf-surface)] ring-2 ring-[var(--kf-crimson)]/20'
                    : 'border-[var(--kf-border)] bg-[var(--kf-surface)] hover:border-[var(--kf-border-strong)] hover:-translate-y-0.5'
                }`}
              >
                <div className="h-20 w-16 shrink-0 rounded-lg bg-[var(--kf-surface-alt)] p-1.5">
                  <PersianRugVisual pattern={school.pattern} showFringe={false} className="h-full w-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-[var(--kf-ink)] truncate">
                      {school.title}
                    </h3>
                    <span className="text-xs font-semibold text-[var(--kf-crimson)] tabular-nums shrink-0">
                      {formatFaNumber(count)} تخته
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-6 text-[var(--kf-muted)]">{school.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Catalog & Filter Workspace */}
      <section
        id="shop"
        ref={shopSectionRef}
        aria-labelledby="shop-heading"
        className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:py-14"
      >
        {/* Workspace Header + Display Accessibility Toolbar */}
        <div className="flex flex-col gap-5 border-b border-[var(--kf-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold text-[var(--kf-brass)]">کاتالوگ و مقایسه</p>
            <h2
              id="shop-heading"
              className="font-display mt-1 text-3xl font-bold text-[var(--kf-ink)] sm:text-4xl"
            >
              فروشگاه فرش‌های دستباف
            </h2>
            <p className="mt-1.5 text-sm text-[var(--kf-muted)] tabular-nums" aria-live="polite">
              نمایش {formatFaNumber(filteredProducts.length)} فرش از {formatFaNumber(PRODUCTS.length)} اثر موجود
              {selectedSchool !== 'همه' ? ` · مکتب ${selectedSchool}` : ''}
            </p>
          </div>

          {/* Controls: Accessibility toggles, View switcher, Sort */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* High Contrast Toggle */}
            <button
              type="button"
              onClick={onToggleHighContrast}
              aria-pressed={highContrast}
              className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-3.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                highContrast
                  ? 'border-[var(--kf-ink)] bg-[var(--kf-ink)] text-white'
                  : 'border-[var(--kf-border-strong)] bg-[var(--kf-surface)] text-[var(--kf-ink)] hover:bg-[var(--kf-surface-alt)]'
              }`}
            >
              <Contrast className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>کنتراست بالا</span>
            </button>

            {/* Large Text Toggle */}
            <button
              type="button"
              onClick={onToggleLargeText}
              aria-pressed={largeText}
              className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-3.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                largeText
                  ? 'border-[var(--kf-ink)] bg-[var(--kf-ink)] text-white'
                  : 'border-[var(--kf-border-strong)] bg-[var(--kf-surface)] text-[var(--kf-ink)] hover:bg-[var(--kf-surface-alt)]'
              }`}
            >
              <Type className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>متن درشت‌تر</span>
            </button>

            {/* View Switcher (Grid vs Comparison Table) */}
            <div
              role="group"
              aria-label="حالت نمایش محصولات"
              className="inline-flex rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] p-1"
            >
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors whitespace-nowrap ${
                  viewMode === 'grid'
                    ? 'bg-[var(--kf-dark)] text-white'
                    : 'text-[var(--kf-ink-secondary)] hover:bg-[var(--kf-surface-alt)]'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
                <span>نمای کارتی</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                aria-pressed={viewMode === 'table'}
                className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors whitespace-nowrap ${
                  viewMode === 'table'
                    ? 'bg-[var(--kf-dark)] text-white'
                    : 'text-[var(--kf-ink-secondary)] hover:bg-[var(--kf-surface-alt)]'
                }`}
              >
                <List className="h-3.5 w-3.5" aria-hidden="true" />
                <span>جدول مقایسه</span>
              </button>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="sr-only">
                مرتب‌سازی محصولات
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="min-h-[42px] rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] px-3.5 text-sm font-medium text-[var(--kf-ink)] cursor-pointer"
              >
                <option value="popular">مرتب‌سازی: پرفروش‌ترین</option>
                <option value="cheap">مرتب‌سازی: ارزان‌‌ترین</option>
                <option value="expensive">مرتب‌سازی: گران‌ترین</option>
                <option value="rate">مرتب‌سازی: بیشترین امتیاز</option>
              </select>
            </div>

            {/* Mobile Filter Drawer Trigger */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[var(--kf-crimson)] px-4 text-sm font-semibold text-white lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              <span>فیلترها</span>
              {activeFilterCount > 0 && (
                <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-xs tabular-nums">
                  {formatFaNumber(activeFilterCount)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 2-Column Workspace Layout: Sidebar Filter Panel + Results */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Desktop Sidebar Filter Panel */}
          <aside
            aria-label="فیلترهای فروشگاه"
            className="hidden lg:col-span-3 lg:block rounded-2xl border border-[var(--kf-border)] bg-[var(--kf-surface)] p-5"
          >
            {filterSidebarContent}
          </aside>

          {/* Product Results Area */}
          <div className="lg:col-span-9">
            {/* Active Filters Bar */}
            {activeFilterCount > 0 && (
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--kf-border)] bg-[var(--kf-surface)] px-4 py-3 text-sm">
                <div className="flex flex-wrap items-center gap-2 text-[var(--kf-ink-secondary)]">
                  <span className="font-semibold text-[var(--kf-ink)]">فیلترهای فعال:</span>
                  {selectedSchool !== 'همه' && (
                    <button
                      type="button"
                      onClick={() => onSelectSchool('همه')}
                      className="inline-flex min-h-[32px] items-center gap-1.5 rounded-lg bg-[var(--kf-surface-alt)] px-2.5 text-xs font-medium text-[var(--kf-ink)] hover:bg-[var(--kf-border)]"
                    >
                      <span>مکتب: {selectedSchool}</span>
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                  {material !== 'همه' && (
                    <button
                      type="button"
                      onClick={() => setMaterial('همه')}
                      className="inline-flex min-h-[32px] items-center gap-1.5 rounded-lg bg-[var(--kf-surface-alt)] px-2.5 text-xs font-medium text-[var(--kf-ink)] hover:bg-[var(--kf-border)]"
                    >
                      <span>الیاف: {material}</span>
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                  {priceBucket !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setPriceBucket('all')}
                      className="inline-flex min-h-[32px] items-center gap-1.5 rounded-lg bg-[var(--kf-surface-alt)] px-2.5 text-xs font-medium text-[var(--kf-ink)] hover:bg-[var(--kf-border)]"
                    >
                      <span>{PRICE_BUCKETS.find((b) => b.id === priceBucket)?.label}</span>
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                  {query.trim() && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="inline-flex min-h-[32px] items-center gap-1.5 rounded-lg bg-[var(--kf-surface-alt)] px-2.5 text-xs font-medium text-[var(--kf-ink)] hover:bg-[var(--kf-border)]"
                    >
                      <span>جستجو: «{query.trim()}»</span>
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-semibold text-[var(--kf-crimson)] underline underline-offset-4 hover:text-[var(--kf-crimson-hover)]"
                >
                  حذف همه فیلترها
                </button>
              </div>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-[var(--kf-border)] bg-[var(--kf-surface)] px-6 py-16 text-center">
                <h3 className="font-display text-2xl font-bold text-[var(--kf-ink)]">
                  فرشی با این مشخصات یافت نشد
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-[var(--kf-muted)]">
                  می‌توانید عبارت جستجو را تغییر دهید یا با پاک کردن فیلترها تمامی فرش‌های مجموعه را ببینید.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[var(--kf-dark)] px-6 text-sm font-semibold text-white hover:bg-[var(--kf-crimson)]"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  <span>نمایش همه فرش‌ها</span>
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* Accessible Product Card Grid (3 columns desktop, 2 tablet, 1 mobile) */
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => {
                  const discountPct = product.old
                    ? Math.round((1 - product.price / product.old) * 100)
                    : 0;
                  const isAdded = recentlyAddedId === product.id;

                  return (
                    <article
                      key={product.id}
                      className="flex flex-col rounded-2xl border border-[var(--kf-border)] bg-[var(--kf-surface)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-[var(--kf-border-strong)]"
                    >
                      {/* Carpet Artwork Backdrop */}
                      <button
                        type="button"
                        onClick={() => onOpenProduct(product)}
                        aria-label={`مشاهده جزئیات ${product.name}`}
                        className="relative flex aspect-[4/3] w-full items-center justify-center rounded-t-2xl bg-[var(--kf-surface-alt)] p-6 transition-colors hover:bg-[#EAE1D3]"
                      >
                        <div className="h-full w-40">
                          <PersianRugVisual pattern={product.pattern} className="h-full w-full" />
                        </div>
                      </button>

                      {/* Card Body: Uniform field order, clean unboxed metadata */}
                      <div className="flex flex-1 flex-col p-5">
                        {/* Quiet 1-line kicker + optional single status text */}
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-semibold text-[var(--kf-brass)]">
                            مکتب {product.cat} · {product.code}
                          </span>
                          {(discountPct > 0 || product.badge) && (
                            <span className="font-bold text-[var(--kf-crimson)] tabular-nums">
                              {discountPct > 0 ? `${formatFaNumber(discountPct)}٪ تخفیف` : product.badge}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-2 text-base font-bold leading-7 text-[var(--kf-ink)]">
                          <button
                            type="button"
                            onClick={() => onOpenProduct(product)}
                            className="text-right hover:text-[var(--kf-crimson)] hover:underline underline-offset-4"
                          >
                            {product.name}
                          </button>
                        </h3>

                        <p className="mt-1.5 text-xs text-[var(--kf-muted)] tabular-nums">
                          {product.size} · {product.material} · {product.knotDensity}
                        </p>

                        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[var(--kf-ink-secondary)] tabular-nums">
                          <Star
                            className="h-3.5 w-3.5 fill-[var(--kf-brass)] text-[var(--kf-brass)]"
                            aria-hidden="true"
                          />
                          <span className="font-bold">{toFaDigits(product.rating)}</span>
                          <span className="text-[var(--kf-muted)]">
                            ({formatFaNumber(product.reviews)} دیدگاه)
                          </span>
                        </div>

                        {/* Price & Always-Accessible Actions */}
                        <div className="mt-auto border-t border-[var(--kf-border)] pt-4">
                          <div className="flex items-baseline justify-between gap-2">
                            <div>
                              {product.old > 0 && (
                                <del className="block text-xs text-[var(--kf-muted)] tabular-nums">
                                  {formatFaNumber(product.old)} تومان
                                </del>
                              )}
                              <span className="text-lg font-bold text-[var(--kf-crimson)] tabular-nums">
                                {formatFaNumber(product.price)}{' '}
                                <span className="text-xs font-normal text-[var(--kf-muted)]">
                                  تومان
                                </span>
                              </span>
                            </div>
                          </div>

                          <div className="mt-3.5 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onOpenProduct(product)}
                              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] px-3 text-xs font-semibold text-[var(--kf-ink)] transition-colors hover:bg-[var(--kf-surface-alt)] whitespace-nowrap"
                            >
                              <Eye className="h-4 w-4 shrink-0" aria-hidden="true" />
                              <span>مشاهده جزئیات</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickAdd(product)}
                              aria-label={`افزودن ${product.name} به سبد خرید`}
                              className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl px-4 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0 ${
                                isAdded
                                  ? 'bg-[var(--kf-success)]'
                                  : 'bg-[var(--kf-dark)] hover:bg-[var(--kf-crimson)]'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                                  <span>اضافه شد</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
                                  <span>افزودن</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Accessible Comparison Table View */
              <div className="overflow-x-auto rounded-2xl border border-[var(--kf-border)] bg-[var(--kf-surface)]">
                <table className="w-full min-w-[740px] border-collapse text-right text-sm">
                  <thead className="border-b border-[var(--kf-border)] bg-[var(--kf-surface-alt)] text-xs font-bold text-[var(--kf-ink)]">
                    <tr>
                      <th scope="col" className="px-4 py-3.5">محصول و کد</th>
                      <th scope="col" className="px-4 py-3.5">مکتب</th>
                      <th scope="col" className="px-4 py-3.5">ابعاد و رج</th>
                      <th scope="col" className="px-4 py-3.5">الیاف</th>
                      <th scope="col" className="px-4 py-3.5">امتیاز</th>
                      <th scope="col" className="px-4 py-3.5">قیمت (تومان)</th>
                      <th scope="col" className="px-4 py-3.5">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--kf-border)]">
                    {filteredProducts.map((product) => {
                      const isAdded = recentlyAddedId === product.id;
                      return (
                        <tr
                          key={product.id}
                          className="transition-colors hover:bg-[var(--kf-surface-alt)]/60"
                        >
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="h-14 w-11 shrink-0 rounded-md bg-[var(--kf-surface-alt)] p-1">
                                <PersianRugVisual
                                  pattern={product.pattern}
                                  showFringe={false}
                                  className="h-full w-full"
                                />
                              </div>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => onOpenProduct(product)}
                                  className="font-bold text-[var(--kf-ink)] hover:text-[var(--kf-crimson)] hover:underline"
                                >
                                  {product.name}
                                </button>
                                <div className="text-xs text-[var(--kf-muted)] tabular-nums">
                                  {product.code}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-[var(--kf-ink-secondary)]">{product.cat}</td>
                          <td className="px-4 py-3.5 text-[var(--kf-ink-secondary)] tabular-nums">
                            {product.size} · {product.knotDensity}
                          </td>
                          <td className="px-4 py-3.5 text-[var(--kf-ink-secondary)]">
                            {product.material}
                          </td>
                          <td className="px-4 py-3.5 tabular-nums font-semibold text-[var(--kf-ink)]">
                            ★ {toFaDigits(product.rating)}
                          </td>
                          <td className="px-4 py-3.5 tabular-nums">
                            <span className="font-bold text-[var(--kf-crimson)]">
                              {formatFaNumber(product.price)}
                            </span>
                            {product.old > 0 && (
                              <del className="block text-xs text-[var(--kf-muted)]">
                                {formatFaNumber(product.old)}
                              </del>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => onOpenProduct(product)}
                                className="inline-flex min-h-[40px] items-center rounded-lg border border-[var(--kf-border-strong)] px-3 text-xs font-semibold text-[var(--kf-ink)] hover:bg-[var(--kf-surface-alt)]"
                              >
                                جزئیات
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickAdd(product)}
                                className={`inline-flex min-h-[40px] items-center rounded-lg px-3 text-xs font-semibold text-white ${
                                  isAdded
                                    ? 'bg-[var(--kf-success)]'
                                    : 'bg-[var(--kf-dark)] hover:bg-[var(--kf-crimson)]'
                                }`}
                              >
                                {isAdded ? 'اضافه شد' : 'خرید'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="فیلترهای فروشگاه"
            className="fixed inset-y-0 right-0 flex w-80 max-w-[90vw] flex-col bg-[var(--kf-surface)] shadow-2xl border-l border-[var(--kf-border)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--kf-border)] px-5 py-4">
              <span className="text-base font-bold text-[var(--kf-ink)]">فیلتر و جستجو</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="بستن فیلترها"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--kf-border)] text-[var(--kf-ink)]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{filterSidebarContent}</div>
            <div className="border-t border-[var(--kf-border)] p-4">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="min-h-[46px] w-full rounded-xl bg-[var(--kf-crimson)] text-sm font-bold text-white"
              >
                مشاهده {formatFaNumber(filteredProducts.length)} نتیجه
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
