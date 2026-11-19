export type PatternId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7' | 'p8' | 'p9';

export type CarpetSchool = 'همه' | 'تبریز' | 'هریس' | 'اردبیل' | 'آذربایجان';

export type SortOption = 'popular' | 'cheap' | 'expensive' | 'rate';

export type PriceBucket = 'all' | 'under30' | '30to50' | 'over50' | 'discounted';

export interface CarpetProduct {
  id: number;
  name: string;
  code: string;
  cat: Exclude<CarpetSchool, 'همه'>;
  origin: string;
  size: string;
  areaSqm: number;
  material: string;
  knotDensity: string;
  price: number;
  old: number;
  rating: number;
  reviews: number;
  pattern: PatternId;
  badge: string;
  desc: string;
}

export interface CartItem {
  id: number;
  qty: number;
}

export interface SchoolMeta {
  id: Exclude<CarpetSchool, 'همه'>;
  title: string;
  subtitle: string;
  pattern: PatternId;
}

export interface TestimonialItem {
  id: number;
  initial: string;
  name: string;
  location: string;
  purchasedItem: string;
  rating: number;
  quote: string;
}

export const FREE_SHIPPING_THRESHOLD = 20_000_000;
export const STANDARD_SHIPPING_COST = 450_000;
export const ACTIVE_COUPON = { code: 'HOME10', pct: 10 };

export const PRODUCTS: CarpetProduct[] = [
  {
    id: 1,
    name: 'فرش دستباف تبریز؛ ترنج لاکی',
    code: 'KH-001',
    cat: 'تبریز',
    origin: 'تبریز',
    size: '۳ × ۲ متر',
    areaSqm: 6,
    material: 'پشم و ابریشم',
    knotDensity: '۵۰ رج',
    price: 48_500_000,
    old: 55_000_000,
    rating: 4.9,
    reviews: 38,
    pattern: 'p1',
    badge: 'پرفروش',
    desc: 'ترکیبی از نقش اصیل ترنج، رنگ‌های لاکی گرم و حاشیه‌های ظریف؛ نمونه‌ای درخشان از هنر بافت آذربایجان با ریشه‌های تمام‌ابریشم.',
  },
  {
    id: 2,
    name: 'فرش لاکی شاه‌عباسی',
    code: 'KH-002',
    cat: 'تبریز',
    origin: 'تبریز',
    size: '۲٫۵ × ۱٫۷ متر',
    areaSqm: 4.25,
    material: 'پشم دست‌ریس',
    knotDensity: '۴۵ رج',
    price: 32_900_000,
    old: 0,
    rating: 4.8,
    reviews: 24,
    pattern: 'p2',
    badge: '',
    desc: 'گل‌وبوته‌های شاه‌عباسی با رنگ لاکی گرم و جزئیات الهام‌گرفته از نقوش کلاسیک مکتب تبریز.',
  },
  {
    id: 3,
    name: 'فرش هریس؛ هندسه ماندگار',
    code: 'KH-003',
    cat: 'هریس',
    origin: 'هریس',
    size: '۳ × ۲ متر',
    areaSqm: 6,
    material: 'پشم',
    knotDensity: '۳۰ رج',
    price: 27_400_000,
    old: 31_000_000,
    rating: 4.7,
    reviews: 41,
    pattern: 'p3',
    badge: 'تخفیف ویژه',
    desc: 'هندسه جسورانه و رنگ‌های خاکی؛ انتخابی اصیل با هویت روستایی آذربایجان و دوام بالا برای فضاهای پرتردد.',
  },
  {
    id: 4,
    name: 'فرش افشان کرم',
    code: 'KH-004',
    cat: 'تبریز',
    origin: 'تبریز',
    size: '۲ × ۱٫۵ متر',
    areaSqm: 3,
    material: 'پشم و ابریشم',
    knotDensity: '۵۰ رج',
    price: 18_900_000,
    old: 0,
    rating: 4.6,
    reviews: 19,
    pattern: 'p4',
    badge: '',
    desc: 'زمینه روشن و نقش‌های پراکنده برای فضایی آرام، روشن و معاصر؛ مناسب اتاق نشیمن کوچک یا اتاق خواب.',
  },
  {
    id: 5,
    name: 'فرش سرمه‌ای لچک ترنج',
    code: 'KH-005',
    cat: 'تبریز',
    origin: 'تبریز',
    size: '۳٫۵ × ۲٫۵ متر',
    areaSqm: 8.75,
    material: 'پشم و ابریشم',
    knotDensity: '۵۵ رج',
    price: 76_000_000,
    old: 84_000_000,
    rating: 5.0,
    reviews: 52,
    pattern: 'p5',
    badge: 'کلکسیونی',
    desc: 'زمینه سرمه‌ای عمیق با ترنج مرکزی و حاشیه‌های متوازن؛ فرشی باوقار و چشمگیر برای پذیرایی‌های بزرگ.',
  },
  {
    id: 6,
    name: 'فرش نقش شکارگاه',
    code: 'KH-006',
    cat: 'آذربایجان',
    origin: 'آذربایجان',
    size: '۳ × ۲ متر',
    areaSqm: 6,
    material: 'پشم',
    knotDensity: '۴۰ رج',
    price: 41_200_000,
    old: 0,
    rating: 4.8,
    reviews: 16,
    pattern: 'p6',
    badge: 'جدید',
    desc: 'روایتی تصویری از نقش‌های سنتی و طبیعت در قالب یک اثر دستباف؛ مناسب کلکسیونرها و علاقه‌مندان فرش تصویری.',
  },
  {
    id: 7,
    name: 'فرش بته‌جقه اردبیل',
    code: 'KH-007',
    cat: 'اردبیل',
    origin: 'اردبیل',
    size: '۲ × ۱٫۵ متر',
    areaSqm: 3,
    material: 'پشم',
    knotDensity: '۳۵ رج',
    price: 22_800_000,
    old: 0,
    rating: 4.5,
    reviews: 12,
    pattern: 'p7',
    badge: '',
    desc: 'نقش بته‌جقه با ترکیب رنگ گرم و قاب‌بندی سنتی؛ انتخابی دلنشین با قیمت مناسب.',
  },
  {
    id: 8,
    name: 'فرش گنبد کبود تبریز',
    code: 'KH-008',
    cat: 'تبریز',
    origin: 'تبریز',
    size: '۲ × ۱٫۵ متر',
    areaSqm: 3,
    material: 'ابریشم',
    knotDensity: '۶۰ رج',
    price: 34_500_000,
    old: 39_000_000,
    rating: 4.9,
    reviews: 29,
    pattern: 'p8',
    badge: 'پرفروش',
    desc: 'الهام‌گرفته از کاشی‌کاری گنبدهای آبی آذربایجان؛ درخشش ابریشم در نور روز و شب.',
  },
  {
    id: 9,
    name: 'فرش گل فرنگ',
    code: 'KH-009',
    cat: 'اردبیل',
    origin: 'اردبیل',
    size: '۳ × ۲ متر',
    areaSqm: 6,
    material: 'پشم',
    knotDensity: '۴۰ رج',
    price: 29_900_000,
    old: 0,
    rating: 4.6,
    reviews: 22,
    pattern: 'p9',
    badge: '',
    desc: 'گل‌های فرنگی درخشان روی زمینه قرمز آجری؛ ترکیبی از سنت و سلیقه امروزی.',
  },
];

export const SCHOOLS: SchoolMeta[] = [
  {
    id: 'تبریز',
    title: 'مکتب تبریز',
    subtitle: 'ترنج، لچک و ظرافت ابریشم',
    pattern: 'p5',
  },
  {
    id: 'هریس',
    title: 'مکتب هریس',
    subtitle: 'هندسه جسور و رنگ‌های خاکی',
    pattern: 'p3',
  },
  {
    id: 'اردبیل',
    title: 'مکتب اردبیل',
    subtitle: 'بته‌جقه و نقش‌های سنتی',
    pattern: 'p7',
  },
  {
    id: 'آذربایجان',
    title: 'مکتب آذربایجان',
    subtitle: 'نقش‌های تصویری و کلکسیونی',
    pattern: 'p6',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    initial: 'م',
    name: 'مریم احمدی',
    location: 'تهران',
    purchasedItem: 'فرش ترنج لاکی تبریز',
    rating: 5,
    quote:
      'فرش تبریز را دقیقاً مطابق مشخصات و شناسنامه بافت دریافت کردم. بسته‌بندی ایمن و راهنمایی پیش از خرید باعث شد با اطمینان کامل سفارش دهم.',
  },
  {
    id: 2,
    initial: 'ر',
    name: 'رضا کریمی',
    location: 'اصفهان',
    purchasedItem: 'فرش هریس هندسه ماندگار',
    rating: 5,
    quote:
      'پشتیبانی واقعاً دقیق و حرفه‌ای بود. قبل از خرید ابعاد و رنگ‌بندی را متناسب با فضای نشیمن بررسی کردند و ارسال بیمه‌شده در دو روز انجام شد.',
  },
  {
    id: 3,
    initial: 'س',
    name: 'سارا موسوی',
    location: 'شیراز',
    purchasedItem: 'فرش افشان کرم',
    rating: 4,
    quote:
      'کیفیت رنگ طبیعی و بافت بسیار یکدست بود. ارسال به شهرستان با بسته‌بندی مقاوم و بیمه کامل انجام شد و کاملاً رضایت‌بخش بود.',
  },
];

export const SHOWROOM_IDS = [1, 2, 3, 4, 5, 6, 7];

export const byId = (id: number): CarpetProduct | undefined =>
  PRODUCTS.find((p) => p.id === id);

export const formatFaNumber = (n: number): string =>
  Number(n).toLocaleString('fa-IR');

export const toFaDigits = (s: string | number): string =>
  String(s).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

export const toEnDigits = (s: string | number): string =>
  String(s).replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
