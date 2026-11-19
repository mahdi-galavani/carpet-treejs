import { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import {
  ACTIVE_COUPON,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
  byId,
  formatFaNumber,
  toEnDigits,
  toFaDigits,
  type CartItem,
} from '../data/carpets';

interface CheckoutModalProps {
  open: boolean;
  cart: CartItem[];
  couponApplied: boolean;
  onClose: () => void;
  onOrderComplete: (trackingCode: string) => void;
}

interface FieldErrors {
  name?: string;
  phone?: string;
  address?: string;
}

export function CheckoutModal({
  open,
  cart,
  couponApplied,
  onClose,
  onOrderComplete,
}: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('تهران');
  const [city, setCity] = useState('تهران');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submittedOrder, setSubmittedOrder] = useState<{
    code: string;
    total: number;
    method: 'online' | 'cod';
  } | null>(null);

  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      setSubmittedOrder(null);
      setErrors({});
      return;
    }
    closeBtnRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const subtotal = cart.reduce((sum, item) => {
    const p = byId(item.id);
    return p ? sum + p.price * item.qty : sum;
  }, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const discount = couponApplied ? Math.round((subtotal * ACTIVE_COUPON.pct) / 100) : 0;
  const shipping =
    subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: FieldErrors = {};
    const cleanPhone = toEnDigits(phone.trim());

    if (name.trim().length < 3) {
      nextErrors.name = 'لطفاً نام و نام خانوادگی کامل را وارد کنید (حداقل ۳ حرف).';
    }
    if (!/^09\d{9}$/.test(cleanPhone)) {
      nextErrors.phone = 'شماره موبایل معتبر نیست؛ باید با ۰۹ شروع شود و ۱۱ رقم باشد.';
    }
    if (address.trim().length < 10) {
      nextErrors.address = 'لطفاً نشانی دقیق محل تحویل را وارد کنید (حداقل ۱۰ حرف).';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const trackingCode = `KF-${toFaDigits(Math.floor(10000 + Math.random() * 90000))}`;
    setSubmittedOrder({
      code: trackingCode,
      total,
      method: paymentMethod,
    });
    onOrderComplete(trackingCode);
  };

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
        aria-labelledby="checkout-modal-title"
        className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[var(--kf-border)] bg-[var(--kf-surface)] p-6 shadow-2xl sm:p-8"
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="بستن پنجره تسویه حساب"
          className="absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] text-[var(--kf-ink)] hover:bg-[var(--kf-dark)] hover:text-white"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {submittedOrder ? (
          <div className="py-6 text-center">
            <span
              aria-hidden="true"
              className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--kf-success-bg)] text-[var(--kf-success)]"
            >
              <CheckCircle2 className="h-9 w-9" />
            </span>
            <h2
              id="checkout-modal-title"
              className="font-display mt-4 text-3xl font-bold text-[var(--kf-ink)]"
            >
              سفارش شما با موفقیت ثبت شد
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[var(--kf-muted)]">
              کارشناسان خانه فرش حداکثر تا ۲۴ ساعت آینده جهت هماهنگی زمان دقیق ارسال با شما تماس
              می‌گیرند.
            </p>

            <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-dashed border-[var(--kf-brass)] bg-[var(--kf-surface-alt)] p-4 text-sm">
              <p className="text-[var(--kf-muted)]">کد پیگیری سفارش</p>
              <p className="mt-1 text-xl font-bold text-[var(--kf-crimson)] tabular-nums">
                {submittedOrder.code}
              </p>
              <div className="mt-3 flex justify-between border-t border-[var(--kf-border)] pt-3 text-xs text-[var(--kf-ink-secondary)]">
                <span>
                  روش تسویه:{' '}
                  {submittedOrder.method === 'online' ? 'پرداخت آنلاین' : 'پرداخت در محل'}
                </span>
                <span className="font-bold tabular-nums">
                  {formatFaNumber(submittedOrder.total)} تومان
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 min-h-[46px] w-full max-w-sm rounded-xl bg-[var(--kf-dark)] px-6 text-sm font-bold text-white hover:bg-[var(--kf-crimson)]"
            >
              بازگشت به فروشگاه
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <h2
              id="checkout-modal-title"
              className="font-display text-2xl font-bold text-[var(--kf-ink)] sm:text-3xl"
            >
              تکمیل اطلاعات ارسال و پرداخت
            </h2>
            <p className="mt-1 text-sm text-[var(--kf-muted)]">
              فیلدهای ستاره‌دار (*) برای هماهنگی ارسال بیمه‌شده ضروری هستند.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="co-name" className="block text-sm font-semibold text-[var(--kf-ink)] mb-1.5">
                  نام و نام خانوادگی *
                </label>
                <input
                  id="co-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'co-name-err' : undefined}
                  placeholder="مثلاً مریم احمدی"
                  className="min-h-[44px] w-full rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] px-3.5 text-sm text-[var(--kf-ink)]"
                />
                {errors.name && (
                  <p id="co-name-err" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-[var(--kf-error)]">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="co-phone" className="block text-sm font-semibold text-[var(--kf-ink)] mb-1.5">
                  شماره موبایل *
                </label>
                <input
                  id="co-phone"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'co-phone-err' : undefined}
                  placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                  className="min-h-[44px] w-full rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] px-3.5 text-sm text-[var(--kf-ink)] tabular-nums"
                />
                {errors.phone && (
                  <p id="co-phone-err" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-[var(--kf-error)]">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="co-province" className="block text-sm font-semibold text-[var(--kf-ink)] mb-1.5">
                  استان
                </label>
                <input
                  id="co-province"
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="min-h-[44px] w-full rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] px-3.5 text-sm text-[var(--kf-ink)]"
                />
              </div>

              <div>
                <label htmlFor="co-city" className="block text-sm font-semibold text-[var(--kf-ink)] mb-1.5">
                  شهر
                </label>
                <input
                  id="co-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="min-h-[44px] w-full rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] px-3.5 text-sm text-[var(--kf-ink)]"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="co-address" className="block text-sm font-semibold text-[var(--kf-ink)] mb-1.5">
                نشانی کامل پستی *
              </label>
              <textarea
                id="co-address"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                aria-invalid={Boolean(errors.address)}
                aria-describedby={errors.address ? 'co-address-err' : undefined}
                placeholder="خیابان، کوچه، پلاک، طبقه و واحد..."
                className="w-full rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] p-3.5 text-sm text-[var(--kf-ink)]"
              />
              {errors.address && (
                <p id="co-address-err" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-[var(--kf-error)]">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.address}</span>
                </p>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="co-zip" className="block text-sm font-semibold text-[var(--kf-ink)] mb-1.5">
                کد پستی (اختیاری)
              </label>
              <input
                id="co-zip"
                type="text"
                inputMode="numeric"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="۱۲۳۴۵۶۷۸۹۰"
                className="min-h-[44px] w-full rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] px-3.5 text-sm text-[var(--kf-ink)] tabular-nums"
              />
            </div>

            <fieldset className="mt-5">
              <legend className="text-sm font-semibold text-[var(--kf-ink)] mb-2">روش پرداخت</legend>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <label className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] px-4 text-sm font-medium text-[var(--kf-ink)] has-[:checked]:border-[var(--kf-crimson)] has-[:checked]:bg-[var(--kf-surface-alt)]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="h-4 w-4 accent-[var(--kf-crimson)]"
                  />
                  <span>پرداخت آنلاین (درگاه امن)</span>
                </label>
                <label className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border border-[var(--kf-border-strong)] bg-[var(--kf-surface)] px-4 text-sm font-medium text-[var(--kf-ink)] has-[:checked]:border-[var(--kf-crimson)] has-[:checked]:bg-[var(--kf-surface-alt)]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="h-4 w-4 accent-[var(--kf-crimson)]"
                  />
                  <span>پرداخت در محل هنگام تحویل</span>
                </label>
              </div>
            </fieldset>

            {/* Summary */}
            <dl className="mt-5 space-y-1.5 rounded-2xl border border-[var(--kf-border)] bg-[var(--kf-surface-alt)] p-4 text-sm">
              <div className="flex justify-between text-[var(--kf-ink-secondary)]">
                <dt>تعداد کل اقلام</dt>
                <dd className="tabular-nums">{formatFaNumber(itemCount)} تخته فرش</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[var(--kf-success)] font-medium">
                  <dt>تخفیف اعمال‌شده</dt>
                  <dd className="tabular-nums">− {formatFaNumber(discount)} تومان</dd>
                </div>
              )}
              <div className="flex justify-between text-[var(--kf-ink-secondary)]">
                <dt>هزینه ارسال</dt>
                <dd className="tabular-nums">
                  {shipping === 0 ? 'رایگان' : `${formatFaNumber(shipping)} تومان`}
                </dd>
              </div>
              <div className="flex justify-between border-t border-[var(--kf-border)] pt-2.5 text-base font-bold text-[var(--kf-ink)]">
                <dt>مبلغ نهایی</dt>
                <dd className="text-[var(--kf-crimson)] tabular-nums">
                  {formatFaNumber(total)} تومان
                </dd>
              </div>
            </dl>

            <button
              type="submit"
              className="mt-5 min-h-[48px] w-full rounded-xl bg-[var(--kf-crimson)] px-6 text-sm font-bold text-white transition-colors hover:bg-[var(--kf-crimson-hover)]"
            >
              ثبت نهایی سفارش
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
