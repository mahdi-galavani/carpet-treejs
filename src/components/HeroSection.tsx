import { ArrowLeft, ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';
import { PersianRugVisual } from './PersianRugVisual';

interface HeroSectionProps {
  onExploreShop: () => void;
}

const GUARANTEES = [
  {
    icon: ShieldCheck,
    title: 'ضمانت اصالت دستباف',
    desc: 'همراه با شناسنامه رسمی و مشخصات رج‌شمار',
  },
  {
    icon: Truck,
    title: 'ارسال بیمه‌شده رایگان',
    desc: 'برای سفارش‌های بالای ۲۰ میلیون تومان در سراسر کشور',
  },
  {
    icon: RotateCcw,
    title: '۷ روز مهلت بازگشت',
    desc: 'بررسی در فضای خانه و امکان مرجوعی آسان',
  },
  {
    icon: Lock,
    title: 'پرداخت امن و در محل',
    desc: 'درگاه بانکی معتبر یا تسویه هنگام تحویل',
  },
];

export function HeroSection({ onExploreShop }: HeroSectionProps) {
  return (
    <section id="top" className="border-b border-[var(--kf-border)]">
      <div className="bg-[var(--kf-dark)] text-[#FAF6EF]">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:py-16">
          {/* Editorial Copy & Primary Route */}
          <div className="lg:col-span-7">
            <p className="text-sm font-medium text-[var(--kf-brass-bright)]">
              مجموعه برگزیده فرش دستباف ایرانی · پاییز ۱۴۰۵
            </p>
            <h1 className="font-display mt-3 text-4xl font-bold leading-[1.2] text-white text-balance sm:text-5xl lg:text-[3.6rem]">
              فرش دستباف ایرانی،{' '}
              <span className="text-[var(--kf-brass-bright)]">به بلندای تاریخ.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#E2D9CC]">
              از گره‌های ظریف تبریز تا هندسه ماندگار هریس؛ هر تخته فرش با شناسنامه اصالت و
              امکان بررسی کامل ابعاد، الیاف و قیمت آماده سفارش است.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onExploreShop}
                className="dark-focus inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-[var(--kf-brass-bright)] px-6 py-3 text-sm font-bold text-[#191411] transition-colors hover:bg-[#E3C282] whitespace-nowrap shrink-0"
              >
                <span>ورود به فروشگاه و فیلترها</span>
                <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>

              <a
                href="#showroom"
                className="dark-focus inline-flex min-h-[46px] items-center rounded-xl border border-[#8E7D69] px-6 py-3 text-sm font-semibold text-[#FAF6EF] transition-colors hover:border-[var(--kf-brass-bright)] hover:bg-white/5 whitespace-nowrap shrink-0"
              >
                تماشای نمایشگاه طاقه‌ها
              </a>
            </div>

            {/* Unboxed inline proof metrics */}
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/15 pt-7 max-w-lg">
              <div>
                <dt className="text-xs font-medium text-[#CEC2B3]">سابقه تخصصی</dt>
                <dd className="font-display mt-1 text-2xl font-bold text-[var(--kf-brass-bright)] tabular-nums">
                  ۳۸ سال
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#CEC2B3]">سفارش تحویل‌شده</dt>
                <dd className="font-display mt-1 text-2xl font-bold text-[var(--kf-brass-bright)] tabular-nums">
                  +۲٬۴۰۰
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#CEC2B3]">ضمانت اصالت</dt>
                <dd className="font-display mt-1 text-2xl font-bold text-[var(--kf-brass-bright)] tabular-nums">
                  ۱۰۰٪
                </dd>
              </div>
            </dl>
          </div>

          {/* Centerpiece Woven Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[300px] sm:max-w-[330px] rounded-2xl border border-white/15 bg-[#231B16] p-6 shadow-2xl">
              <div className="aspect-[3/4] w-full">
                <PersianRugVisual pattern="p5" className="h-full w-full" />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-[#DFD5C7]">
                <span>فرش سرمه‌ای لچک ترنج تبریز</span>
                <span className="tabular-nums text-[var(--kf-brass-bright)] font-semibold">
                  ۵۵ رج
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column Trust & Service Strip */}
      <div className="bg-[var(--kf-surface)]">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {GUARANTEES.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--kf-surface-alt)] text-[var(--kf-crimson)] border border-[var(--kf-border)]"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[var(--kf-ink)]">{item.title}</h2>
                  <p className="mt-0.5 text-xs leading-6 text-[var(--kf-muted)]">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
