export function Footer() {
  return (
    <footer className="bg-[var(--kf-dark)] text-[#DFD5C7] border-t border-white/10">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-bold text-white">خانه فرش</p>
            <p className="mt-3 text-sm leading-7 text-[#CFC3B4]">
              فروشگاه تخصصی فرش دستباف ایرانی با ضمانت اصالت، شناسنامه بافت و ارسال بیمه‌شده به
              سراسر کشور.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">دسترسی سریع</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#shop" className="dark-focus inline-block py-1 hover:text-[var(--kf-brass-bright)]">
                  فروشگاه و فیلترها
                </a>
              </li>
              <li>
                <a href="#schools" className="dark-focus inline-block py-1 hover:text-[var(--kf-brass-bright)]">
                  مکاتب بافت
                </a>
              </li>
              <li>
                <a href="#showroom" className="dark-focus inline-block py-1 hover:text-[var(--kf-brass-bright)]">
                  نمایشگاه مجازی طاقه‌ها
                </a>
              </li>
              <li>
                <a href="#story" className="dark-focus inline-block py-1 hover:text-[var(--kf-brass-bright)]">
                  داستان و اصالت
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">خدمات مشتریان</h3>
            <ul className="mt-3 space-y-2 text-sm text-[#CFC3B4]">
              <li>ضمانت اصالت و شناسنامه بافت</li>
              <li>ارسال رایگان بالای ۲۰ میلیون تومان</li>
              <li>۷ روز مهلت بازگشت کالا</li>
              <li>امکان پرداخت آنلاین و در محل</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">تماس و پشتیبانی</h3>
            <ul className="mt-3 space-y-2 text-sm text-[#CFC3B4]">
              <li>تهران، خیابان ولیعصر، پلاک ۱۲۰۴</li>
              <li>
                <a
                  href="tel:02112345678"
                  className="dark-focus inline-block py-1 font-semibold text-[var(--kf-brass-bright)] tabular-nums hover:underline"
                >
                  ۰۲۱-۱۲۳۴۵۶۷۸
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/989121234567"
                  target="_blank"
                  rel="noreferrer"
                  className="dark-focus inline-block py-1 hover:text-[var(--kf-brass-bright)] tabular-nums"
                >
                  واتساپ: ۰۹۱۲۱۲۳۴۵۶۷
                </a>
              </li>
              <li>شنبه تا پنجشنبه، ۹ تا ۱۹</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[#CFC3B4]">
          <p>© ۱۴۰۵ خانه فرش · تمامی حقوق محفوظ است.</p>
          <p>پرداخت امن شاپرک · ارسال بیمه‌شده</p>
        </div>
      </div>
    </footer>
  );
}
