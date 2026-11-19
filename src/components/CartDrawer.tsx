import { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import {
  ACTIVE_COUPON,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
  byId,
  formatFaNumber,
  type CartItem,
} from '../data/carpets';
import { PersianRugVisual } from './PersianRugVisual';

interface CartDrawerProps {
  open: boolean;
  cart: CartItem[];
  couponApplied: boolean;
  onClose: () => void;
  onChangeQty: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  onProceedCheckout: () => void;
}

export function CartDrawer({
  open,
  cart,
  couponApplied,
  onClose,
  onChangeQty,
  onRemoveItem,
  onApplyCoupon,
  onRemoveCoupon,
  onProceedCheckout,
}: CartDrawerProps) {
  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const subtotal = cart.reduce((sum, item) => {
    const product = byId(item.id);
    return product ? sum + product.price * item.qty : sum;
  }, 0);

  const discount = couponApplied ? Math.round((subtotal * ACTIVE_COUPON.pct) / 100) : 0;
  const shipping =
    subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const total = Math.max(0, subtotal - discount + shipping);
  const remainingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onApplyCoupon(couponInput);
    if (ok) {
      setCouponStatus({
        type: 'success',
        message: `کد تخفیف ${ACTIVE_COUPON.code} (${formatFaNumber(ACTIVE_COUPON.pct)}٪) اعمال شد.`,
      });
    } else {
      setCouponStatus({
        type: 'error',
        message: 'کد تخفیف واردشده معتبر نیست. (نمونه: HOME10)',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="fixed inset-y-0 left-0 flex w-full max-w-[440px] flex-col bg-[var(--kf-surface)] shadow-2xl border-r border-[var(--kf-border)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--kf-border)] px-5 py-4">
          <h2 id="cart-drawer-title" className="text-base font-bold text-[var(--kf-ink)]">
            سبد خرید شما
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="بستن سبد خرید"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--kf-border)] text-[var(--kf-ink)] hover:bg-[var(--kf-surface-alt)]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Free Shipping Indicator */}
        {subtotal > 0 && (
          <div className="border-b border-[var(--kf-border)] bg-[var(--kf-surface-alt)] px-5 py-3 text-xs font-medium text-[var(--kf-ink-secondary)]">
            {remainingForFreeShip === 0 ? (
              <span className="flex items-center gap-1.5 font-semibold text-[var(--kf-success)]">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                ارسال این سفارش به‌صورت رایگان و بیمه‌شده انجام می‌شود.
              </span>
            ) : (
              <span className="tabular-nums">
                با افزودن{' '}
                <strong className="text-[var(--kf-crimson)]">
                  {formatFaNumber(remainingForFreeShip)} تومان
                </strong>{' '}
                دیگر، ارسال شما رایگان می‌شود.
              </span>
            )}
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span
                aria-hidden="true"
                className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--kf-surface-alt)] text-[var(--kf-muted)]"
              >
                <ShoppingBag className="h-7 w-7" />
              </span>
              <p className="mt-4 text-base font-bold text-[var(--kf-ink)]">
                سبد خرید شما خالی است
              </p>
              <p className="mt-1.5 max-w-xs text-sm text-[var(--kf-muted)]">
                از بخش فروشگاه یا نمایشگاه مجازی، فرش دستباف دلخواهتان را انتخاب کنید.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--kf-border)]">
              {cart.map((item) => {
                const product = byId(item.id);
                if (!product) return null;
                return (
                  <li key={product.id} className="flex gap-4 py-4">
                    <div className="h-24 w-18 shrink-0 rounded-lg bg-[var(--kf-surface-alt)] p-1.5">
                      <PersianRugVisual
                        pattern={product.pattern}
                        showFringe={false}
                        className="h-full w-full"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold leading-6 text-[var(--kf-ink)]">
                          {product.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id)}
                          aria-label={`حذف ${product.name} از سبد خرید`}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[var(--kf-muted)] hover:bg-[var(--kf-error-bg)] hover:text-[var(--kf-error)]"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>

                      <p className="text-xs text-[var(--kf-muted)] tabular-nums">
                        {product.size} · {product.material}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="inline-flex items-center rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)]">
                          <button
                            type="button"
                            onClick={() => onChangeQty(product.id, -1)}
                            aria-label={`کاهش تعداد ${product.name}`}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-r-xl text-[var(--kf-ink)] hover:bg-[var(--kf-surface-alt)]"
                          >
                            <Minus className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <span
                            className="min-w-[32px] text-center text-sm font-bold text-[var(--kf-ink)] tabular-nums"
                            aria-label={`تعداد: ${formatFaNumber(item.qty)}`}
                          >
                            {formatFaNumber(item.qty)}
                          </span>
                          <button
                            type="button"
                            onClick={() => onChangeQty(product.id, 1)}
                            aria-label={`افزودن تعداد ${product.name}`}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-l-xl text-[var(--kf-ink)] hover:bg-[var(--kf-surface-alt)]"
                          >
                            <Plus className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-[var(--kf-crimson)] tabular-nums">
                          {formatFaNumber(product.price * item.qty)} تومان
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer Totals & Coupon */}
        <div className="border-t border-[var(--kf-border)] bg-[var(--kf-bg)] p-5">
          <form onSubmit={handleCouponSubmit} className="mb-3">
            <label htmlFor="coupon-code" className="sr-only">
              کد تخفیف
            </label>
            <div className="flex gap-2">
              <input
                id="coupon-code"
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="کد تخفیف (مثلاً HOME10)"
                className="min-h-[44px] flex-1 rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] px-3.5 text-sm text-[var(--kf-ink)] placeholder:text-[var(--kf-muted)]"
              />
              {couponApplied ? (
                <button
                  type="button"
                  onClick={() => {
                    onRemoveCoupon();
                    setCouponInput('');
                    setCouponStatus(null);
                  }}
                  className="min-h-[44px] rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] px-4 text-xs font-semibold text-[var(--kf-ink)] hover:bg-[var(--kf-surface-alt)]"
                >
                  حذف کد
                </button>
              ) : (
                <button
                  type="submit"
                  className="min-h-[44px] rounded-xl bg-[var(--kf-dark)] px-4 text-xs font-semibold text-white hover:bg-[var(--kf-crimson)]"
                >
                  اعمال کد
                </button>
              )}
            </div>
            {couponStatus && (
              <p
                role="status"
                aria-live="polite"
                className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${
                  couponStatus.type === 'success'
                    ? 'text-[var(--kf-success)]'
                    : 'text-[var(--kf-error)]'
                }`}
              >
                {couponStatus.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                )}
                <span>{couponStatus.message}</span>
              </p>
            )}
          </form>

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between text-[var(--kf-ink-secondary)]">
              <dt>جمع کالاها</dt>
              <dd className="tabular-nums font-medium">{formatFaNumber(subtotal)} تومان</dd>
            </div>
            <div className="flex justify-between text-[var(--kf-ink-secondary)]">
              <dt>هزینه ارسال بیمه‌شده</dt>
              <dd className="tabular-nums font-medium">
                {subtotal === 0
                  ? '—'
                  : shipping === 0
                    ? 'رایگان'
                    : `${formatFaNumber(shipping)} تومان`}
              </dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between font-medium text-[var(--kf-success)]">
                <dt>تخفیف کد ({ACTIVE_COUPON.code})</dt>
                <dd className="tabular-nums">− {formatFaNumber(discount)} تومان</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-dashed border-[var(--kf-border-strong)] pt-3 text-base font-bold text-[var(--kf-ink)]">
              <dt>مبلغ قابل پرداخت</dt>
              <dd className="text-lg text-[var(--kf-crimson)] tabular-nums">
                {formatFaNumber(total)} تومان
              </dd>
            </div>
          </dl>

          <button
            type="button"
            disabled={cart.length === 0}
            onClick={onProceedCheckout}
            className="mt-4 min-h-[48px] w-full rounded-xl bg-[var(--kf-crimson)] px-6 text-sm font-bold text-white transition-colors hover:bg-[var(--kf-crimson-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            تکمیل خرید و ثبت اطلاعات ارسال
          </button>
        </div>
      </aside>
    </div>
  );
}
