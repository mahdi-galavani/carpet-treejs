import { useEffect, useRef } from 'react';
import { MessageCircle, Plus, ShieldCheck, Star, Truck, X } from 'lucide-react';
import { formatFaNumber, toFaDigits, type CarpetProduct } from '../data/carpets';
import { PersianRugVisual } from './PersianRugVisual';

interface ProductModalProps {
  product: CarpetProduct | null;
  onClose: () => void;
  onAddToCart: (product: CarpetProduct) => void;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!product) return;
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const discountPct = product.old ? Math.round((1 - product.price / product.old) * 100) : 0;
  const waHref = `https://wa.me/989121234567?text=${encodeURIComponent(
    `سلام، درباره «${product.name}» با کد ${product.code} مشاوره می‌خواستم.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[var(--kf-border)] bg-[var(--kf-surface)] shadow-2xl"
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="بستن پنجره مشخصات محصول"
          className="absolute left-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] text-[var(--kf-ink)] transition-colors hover:bg-[var(--kf-dark)] hover:text-white"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Rug Artwork Gallery Side */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-[var(--kf-surface-alt)] p-8">
            <div className="w-56 sm:w-64 aspect-[3/4]">
              <PersianRugVisual pattern={product.pattern} className="h-full w-full" />
            </div>
            <p className="mt-4 text-xs font-semibold text-[var(--kf-muted)] tabular-nums">
              کد اثر: {product.code} · دستباف اصیل ایران
            </p>
          </div>

          {/* Contiguous Purchase & Specification Module */}
          <div className="md:col-span-7 flex flex-col p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--kf-brass)]">
              <span>مکتب {product.origin}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 text-[var(--kf-ink)] tabular-nums">
                <Star className="h-3.5 w-3.5 fill-[var(--kf-brass)] text-[var(--kf-brass)]" aria-hidden="true" />
                {toFaDigits(product.rating)} ({formatFaNumber(product.reviews)} دیدگاه)
              </span>
              {discountPct > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[var(--kf-crimson)] font-bold tabular-nums">
                    {formatFaNumber(discountPct)}٪ تخفیف
                  </span>
                </>
              )}
            </div>

            <h2
              id="product-modal-title"
              className="font-display mt-2 text-2xl font-bold text-[var(--kf-ink)] sm:text-3xl"
            >
              {product.name}
            </h2>

            <p className="mt-3 text-sm leading-7 text-[var(--kf-ink-secondary)]">{product.desc}</p>

            {/* Specifications Grid */}
            <dl className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[var(--kf-border)] bg-[var(--kf-bg)] p-3">
                <dt className="text-xs text-[var(--kf-muted)]">منطقه بافت</dt>
                <dd className="mt-0.5 text-sm font-bold text-[var(--kf-ink)]">{product.origin}</dd>
              </div>
              <div className="rounded-xl border border-[var(--kf-border)] bg-[var(--kf-bg)] p-3">
                <dt className="text-xs text-[var(--kf-muted)]">ابعاد دقیق</dt>
                <dd className="mt-0.5 text-sm font-bold text-[var(--kf-ink)] tabular-nums">
                  {product.size}
                </dd>
              </div>
              <div className="rounded-xl border border-[var(--kf-border)] bg-[var(--kf-bg)] p-3">
                <dt className="text-xs text-[var(--kf-muted)]">جنس پرز و تار</dt>
                <dd className="mt-0.5 text-sm font-bold text-[var(--kf-ink)]">{product.material}</dd>
              </div>
              <div className="rounded-xl border border-[var(--kf-border)] bg-[var(--kf-bg)] p-3">
                <dt className="text-xs text-[var(--kf-muted)]">تراکم بافت</dt>
                <dd className="mt-0.5 text-sm font-bold text-[var(--kf-ink)] tabular-nums">
                  دستباف · {product.knotDensity}
                </dd>
              </div>
            </dl>

            {/* Price & Primary Actions */}
            <div className="mt-6 border-t border-[var(--kf-border)] pt-5">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-2xl font-bold text-[var(--kf-crimson)] tabular-nums">
                  {formatFaNumber(product.price)}{' '}
                  <span className="text-sm font-normal text-[var(--kf-muted)]">تومان</span>
                </span>
                {product.old > 0 && (
                  <del className="text-sm text-[var(--kf-muted)] tabular-nums">
                    {formatFaNumber(product.old)} تومان
                  </del>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--kf-crimson)] px-6 text-sm font-bold text-white transition-colors hover:bg-[var(--kf-crimson-hover)]"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>افزودن به سبد خرید</span>
                </button>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] px-5 text-sm font-semibold text-[var(--kf-ink)] transition-colors hover:bg-[var(--kf-surface-alt)]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>مشاوره پیش از خرید</span>
                </a>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[var(--kf-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[var(--kf-success)]" aria-hidden="true" />
                  ضمانت اصالت و شناسنامه بافت
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-[var(--kf-brass)]" aria-hidden="true" />
                  ارسال بیمه‌شده + ۷ روز مهلت بازگشت
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
