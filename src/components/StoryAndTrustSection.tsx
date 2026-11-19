import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Star } from 'lucide-react';
import { TESTIMONIALS, toFaDigits } from '../data/carpets';
import { PersianRugVisual } from './PersianRugVisual';

export function StoryAndTrustSection() {
  const [email, setEmail] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setStatusMsg('لطفاً یک نشانی ایمیل معتبر وارد کنید.');
      return;
    }
    setStatusMsg('عضویت شما در خبرنامه خانه فرش با موفقیت ثبت شد.');
    setEmail('');
  };

  return (
    <>
      {/* Craftsmanship Story */}
      <section
        id="story"
        aria-labelledby="story-heading"
        className="border-y border-[var(--kf-border)] bg-[var(--kf-surface)]"
      >
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-64 sm:w-72 rounded-2xl border border-[var(--kf-border)] bg-[var(--kf-surface-alt)] p-6">
              <div className="aspect-[3/4]">
                <PersianRugVisual pattern="p2" className="h-full w-full" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="text-xs font-bold text-[var(--kf-brass)]">داستان و اصالت</p>
            <h2
              id="story-heading"
              className="font-display mt-2 text-3xl font-bold leading-snug text-[var(--kf-ink)] text-balance sm:text-4xl"
            >
              فرش فقط یک زیرانداز نیست؛{' '}
              <span className="text-[var(--kf-crimson)]">روایتی‌ست که بافته می‌شود.</span>
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--kf-ink-secondary)]">
              از سال ۱۳۶۷، با خرید مستقیم از استادکاران بافنده در تبریز، هریس و اردبیل، اصالت
              رنگ‌های گیاهی و گره‌های ظریف دستباف را بدون واسطه به خانه‌ها آورده‌ایم. تا امروز
              بیش از ۲٬۴۰۰ سفارش با شناسنامه بافت و بیمه کامل ارسال شده است.
            </p>
            <p className="mt-3 text-base leading-8 text-[var(--kf-ink-secondary)]">
              پیش از خرید هر تخته فرش، می‌توانید مشخصات دقیق رج‌شمار، ابعاد، الیاف و تجربه
              خریداران پیشین را بررسی کنید و با ۷ روز ضمانت بازگشت در منزل مطمئن تصمیم بگیرید.
            </p>

            <div className="mt-7">
              <a
                href="#shop"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-[var(--kf-dark)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--kf-crimson)]"
              >
                <span>کشف مجموعه فرش‌ها</span>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section
        aria-labelledby="testimonials-heading"
        className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6"
      >
        <div className="mb-8">
          <p className="text-xs font-bold text-[var(--kf-brass)]">تجربه خریداران</p>
          <h2
            id="testimonials-heading"
            className="font-display mt-1 text-3xl font-bold text-[var(--kf-ink)] sm:text-4xl"
          >
            دیدگاه مشتریان خانه فرش
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-[var(--kf-border)] bg-[var(--kf-surface)] p-6"
            >
              <div>
                <div
                  className="flex items-center gap-1 text-[var(--kf-brass)]"
                  aria-label={`امتیاز ${toFaDigits(item.rating)} از ۵`}
                >
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      aria-hidden="true"
                      className={`h-4 w-4 ${
                        idx < item.rating
                          ? 'fill-[var(--kf-brass)] text-[var(--kf-brass)]'
                          : 'text-[var(--kf-border-strong)]'
                      }`}
                    />
                  ))}
                  <span className="mr-2 text-xs font-semibold text-[var(--kf-ink-secondary)] tabular-nums">
                    {toFaDigits(item.rating)} از ۵
                  </span>
                </div>
                <blockquote className="mt-4 text-sm leading-7 text-[var(--kf-ink-secondary)]">
                  «{item.quote}»
                </blockquote>
              </div>

              <footer className="mt-6 flex items-center gap-3 border-t border-[var(--kf-border)] pt-4">
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--kf-dark)] text-sm font-bold text-[#F3E6D0]"
                >
                  {item.initial}
                </span>
                <div>
                  <p className="text-sm font-bold text-[var(--kf-ink)]">{item.name}</p>
                  <p className="text-xs text-[var(--kf-muted)]">
                    {item.location} · {item.purchasedItem}
                  </p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter Callout */}
      <section
        aria-labelledby="newsletter-heading"
        className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6"
      >
        <div className="grid grid-cols-1 items-center gap-8 rounded-3xl bg-[var(--kf-crimson)] p-8 text-white lg:grid-cols-12 lg:p-10">
          <div className="lg:col-span-7">
            <h2
              id="newsletter-heading"
              className="font-display text-2xl font-bold text-white sm:text-3xl"
            >
              اطلاع‌رسانی فرش‌های تازه و کد تخفیف
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-[#FBECEF]">
              با ثبت ایمیل، هنگام اضافه‌شدن آثار جدید تبریز و هریس باخبر شوید. همچنین کد{' '}
              <strong className="font-mono text-[#FFE8B5]">HOME10</strong> برای ۱۰٪ تخفیف در سبد
              خرید فعال است.
            </p>
          </div>

          <div className="lg:col-span-5">
            <form onSubmit={handleSubscribe} noValidate className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                نشانی ایمیل
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                dir="ltr"
                className="dark-focus min-h-[46px] flex-1 rounded-xl border border-white/30 bg-white px-4 text-sm text-[#1A1512] placeholder:text-[#6B5D53] text-left"
              />
              <button
                type="submit"
                className="dark-focus min-h-[46px] rounded-xl bg-[var(--kf-dark)] px-6 text-sm font-bold text-white transition-colors hover:bg-black whitespace-nowrap shrink-0"
              >
                عضویت در خبرنامه
              </button>
            </form>
            {statusMsg && (
              <p
                role="status"
                aria-live="polite"
                className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-[#FFF4DC]"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{statusMsg}</span>
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
