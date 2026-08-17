import type {
  ProductReview,
  ReviewStatus,
  ReviewFilterParams,
  ReviewListResponse,
  SupportTicket,
  SupportTicketMessage,
  TicketStatus,
  TicketPriority,
  TicketFilterParams,
  TicketListResponse,
  AdminNotification,
} from "@/types/feedback";

const STORAGE_KEY_REVIEWS = "dynova_mock_reviews_v1";
const STORAGE_KEY_TICKETS = "dynova_mock_tickets_v1";
const STORAGE_KEY_NOTIFICATIONS = "dynova_mock_notifications_v1";
const NETWORK_LATENCY_MS = 400;

export const INITIAL_MOCK_REVIEWS: ProductReview[] = [
  {
    id: "rev-101",
    productId: "prod-001",
    productTitle: "گوشی موبایل اپل مدل iPhone 15 Pro Max ظرفیت 256GB",
    productThumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&auto=format&fit=crop&q=80",
    customerName: "سارا ابراهیمی",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "کیفیت ساخت و دوربین تیتانیومی فوق‌العاده است. بسته‌بندی پلمپ و ارسال با پیک ویژه در کمتر از ۳ ساعت به دستم رسید. از پشتیبانی دینووا بسیار ممنونم.",
    adminReply: "درود بر شما خانم ابراهیمی عزیز، خوشحالیم که از خرید و سرعت ارسال رضایت کامل دارید. گارانتی اصالت و سلامت کالا همیشه تضمین دینوواست.",
    adminRepliedAt: "2026-08-16T14:30:00.000Z",
    status: "approved",
    createdAt: "2026-08-16T11:20:00.000Z",
  },
  {
    id: "rev-102",
    productId: "prod-002",
    productTitle: "هدفون بی سیم سونی مدل WH-1000XM5 نویز کنسلینگ",
    productThumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80",
    customerName: "محمدرضا کاظمی",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 4,
    comment: "حذف نویز در محیط‌های شلوغ کاری عالیه. فقط کیف حملش نسبت به مدل XM4 کمی جاگیرتر شده ولی کیفیت صدا و میکروفون بی‌نظیره.",
    adminReply: "سلام محمدرضا عزیز، از اشتراک تجربه تخصصی‌تون سپاسگزاریم. سونی در این مدل ارگونومی فوم‌های کاپ رو برای راحتی ساعات طولانی کار ارتقا داده.",
    adminRepliedAt: "2026-08-16T18:00:00.000Z",
    status: "approved",
    createdAt: "2026-08-16T16:15:00.000Z",
  },
  {
    id: "rev-103",
    productId: "prod-003",
    productTitle: "ساعت هوشمند اپل واچ اولترا ۲ تیتانیوم بند آلپاین",
    productThumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80",
    customerName: "دکتر نیلوفر باقری",
    customerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    rating: 2,
    comment: "باتری ساعت در تست کوهنوردی زودتر از حد انتظار تموم شد. همچنین حسگر اکسیژن خون در نسخه جدید غیرفعاله. لطفا راهنمایی بفرمایید آیا امکان مرجوعی هست؟",
    status: "pending",
    createdAt: "2026-08-17T01:45:00.000Z",
  },
  {
    id: "rev-104",
    productId: "prod-004",
    productTitle: "لپ تاپ اپل مدل MacBook Air M3 رم 16 گیگابایت",
    productThumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80",
    customerName: "امیرحسین رضایی",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "برای کارهای برنامه‌نویسی و کانتینردار عالیه. بدون هیچ صدایی با باتری ۱۸ ساعته کار میکنه. سرعت تحویل دینووا هم عالی بود.",
    status: "approved",
    createdAt: "2026-08-15T09:10:00.000Z",
  },
  {
    id: "rev-105",
    productId: "prod-005",
    productTitle: "ماوس بی‌سیم لاجیتک مدل MX Master 3S ارگونومیک",
    productThumbnail: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&auto=format&fit=crop&q=80",
    customerName: "مریم حسینی",
    customerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    rating: 1,
    comment: "اسکرول ماوس بعد از ۳ روز گیر میکنه و صدای ناهنجار میده. جعبه هم وقتی رسید ضربه‌خورده بود. اصلا راضی نیستم.",
    status: "pending",
    createdAt: "2026-08-17T02:30:00.000Z",
  },
  {
    id: "rev-106",
    productId: "prod-006",
    productTitle: "تبلت سامسونگ مدل Galaxy Tab S9 Ultra حافظه 512GB",
    productThumbnail: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=300&auto=format&fit=crop&q=80",
    customerName: "علی پاکزاد",
    customerAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "صفحه نمایش Dynamic AMOLED 2X غوغا میکنه. قلم S-Pen همراهش برای طراحی معرکه‌ست. سپاس از قیمت مناسب شما.",
    adminReply: "ممنون علی عزیز، قلم و نمایشگر این تبلت انتخابی ایده‌آل برای طراحان حرفه‌ایه. لذت ببرید!",
    adminRepliedAt: "2026-08-14T20:10:00.000Z",
    status: "approved",
    createdAt: "2026-08-14T17:40:00.000Z",
  },
  {
    id: "rev-107",
    productId: "prod-007",
    productTitle: "کیبورد مکانیکی گیمینگ ریزر مدل BlackWidow V4 Pro",
    productThumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80",
    customerName: "پرهام انصاری",
    rating: 3,
    comment: "کلیدهای ماکرو خیلی خوبه ولی سوئیچ‌های زرد کمی برای تایپ سریع سبک و حساس هستن. نورپردازی RGB بی‌نقصه.",
    status: "approved",
    createdAt: "2026-08-13T12:00:00.000Z",
  },
  {
    id: "rev-108",
    productId: "prod-008",
    productTitle: "پاوربانک خورشیدی فست شارژ انکر 24000mAh مدل 737",
    productThumbnail: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&auto=format&fit=crop&q=80",
    customerName: "مهسا کریمی",
    rating: 1,
    comment: "توی سایت دیجیکالا ارزان‌تر از شما میدادن! چرا باید از دینووا بخرم وقتی هیچ مزیتی نداره؟ کلاهبرداریه!!",
    status: "rejected",
    createdAt: "2026-08-12T15:20:00.000Z",
  },
  {
    id: "rev-109",
    productId: "prod-009",
    productTitle: "اسپیکر قابل حمل بلوتوثی جی بی ال مدل Boombox 3",
    productThumbnail: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&auto=format&fit=crop&q=80",
    customerName: "فرزاد نادری",
    rating: 5,
    comment: "بیس کوبنده و تفکیک صدای شاهکار! توی باغ و طبیعت تست کردم و با ولوم ۵۰ درصد جوابگوی کل جمع بود. باتریش واقعا ۲۴ ساعت جواب میده.",
    status: "approved",
    createdAt: "2026-08-11T18:30:00.000Z",
  },
  {
    id: "rev-110",
    productId: "prod-010",
    productTitle: "هارد اکسترنال وسترن دیجیتال مدل My Passport ظرفیت 4TB",
    productThumbnail: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&auto=format&fit=crop&q=80",
    customerName: "رویا یوسفی",
    rating: 4,
    comment: "سرعت انتقال اطلاعات با USB 3.2 حدود ۱۳۰ مگابایت بر ثانیه‌ست. بدنه سبک و جمع‌وجوری داره. برای آرشیو عکس‌های آتلیه خریدم.",
    status: "pending",
    createdAt: "2026-08-17T00:10:00.000Z",
  },
  {
    id: "rev-111",
    productId: "prod-001",
    productTitle: "گوشی موبایل اپل مدل iPhone 15 Pro Max ظرفیت 256GB",
    productThumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&auto=format&fit=crop&q=80",
    customerName: "شایان رستمی",
    rating: 5,
    comment: "رنگ تیتانیوم طبیعی واقعا شیک و باوقاره. انتقال داده از گوشی قبلی به لطف USB-C خیلی سریع شد. ممنون از تیم فروشگاه.",
    status: "approved",
    createdAt: "2026-08-10T11:45:00.000Z",
  },
  {
    id: "rev-112",
    productId: "prod-002",
    productTitle: "هدفون بی سیم سونی مدل WH-1000XM5 نویز کنسلینگ",
    productThumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80",
    customerName: "بهناز صادقی",
    rating: 4,
    comment: "اتصال همزمان به دو دستگاه (Multipoint) خیلی راحت انجام میشه. موقع تماس در خیابان صدای باد رو کامل حذف کرد.",
    status: "pending",
    createdAt: "2026-08-16T22:30:00.000Z",
  },
];

export const INITIAL_MOCK_TICKETS: SupportTicket[] = [
  {
    id: "tck-001",
    ticketNumber: "TCK-4081",
    customerName: "سارا ابراهیمی",
    customerPhone: "09123456789",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    subject: "درخواست تغییر آدرس تحویل سفارش اکسپرس",
    priority: "urgent",
    status: "in_progress",
    relatedOrderId: "ORD-9821",
    messages: [
      {
        id: "msg-101",
        sender: "customer",
        senderName: "سارا ابراهیمی",
        message: "سلام وقت بخیر، من سفارش شماره ORD-9821 رو برای آدرس منزل ثبت کردم اما تا ساعت ۱۸ در محل کار (ونک، خیابان ملاصدرا) هستم. امکانش هست به پیک بفرمایید مرسوله رو به این آدرس تحویل بده؟",
        sentAt: "2026-08-17T02:10:00.000Z",
      },
      {
        id: "msg-102",
        sender: "support",
        senderName: "پشتیبانی دینووا (علیرضا)",
        message: "سلام خانم ابراهیمی عزیز، درخواست شما ثبت شد. با سفیر توزیع هماهنگ کردیم و مرسوله ساعت ۱۵ به آدرس ونک، ملاصدرا تحویل خواهد شد.",
        sentAt: "2026-08-17T02:25:00.000Z",
      },
      {
        id: "msg-103",
        sender: "customer",
        senderName: "سارا ابراهیمی",
        message: "بسیار عالی، سپاسگزارم از پیگیری سریع و حرفه‌ای شما.",
        sentAt: "2026-08-17T02:32:00.000Z",
      },
    ],
    createdAt: "2026-08-17T02:10:00.000Z",
    updatedAt: "2026-08-17T02:32:00.000Z",
  },
  {
    id: "tck-002",
    ticketNumber: "TCK-4082",
    customerName: "محمدرضا کاظمی",
    customerPhone: "09351112233",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    subject: "عدم اعمال کد تخفیف جشنواره تابستانه در سبد خرید",
    priority: "high",
    status: "open",
    relatedOrderId: "ORD-9824",
    messages: [
      {
        id: "msg-201",
        sender: "customer",
        senderName: "محمدرضا کاظمی",
        message: "سلام، کد تخفیف SUMMER2026 رو وارد می‌کنم ولی خطای «کد تخفیف معتبر نمی‌باشد» نشون میده. مبلغ سبد خریدم بالای ۵ میلیون تومانه. لطفا بررسی بفرمایید.",
        sentAt: "2026-08-17T01:50:00.000Z",
      },
    ],
    createdAt: "2026-08-17T01:50:00.000Z",
    updatedAt: "2026-08-17T01:50:00.000Z",
  },
  {
    id: "tck-003",
    ticketNumber: "TCK-4083",
    customerName: "دکتر نیلوفر باقری",
    customerPhone: "09139876543",
    customerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    subject: "درخواست فاکتور رسمی و گواهی ارزش افزوده شرکتی",
    priority: "medium",
    status: "waiting_customer",
    relatedOrderId: "ORD-9750",
    messages: [
      {
        id: "msg-301",
        sender: "customer",
        senderName: "دکتر نیلوفر باقری",
        message: "با سلام، ما برای خرید لپ‌تاپ‌های بخش تحقیق و توسعه نیاز به فاکتور رسمی با شناسه ملی و کد اقتصادی شرکت داریم.",
        sentAt: "2026-08-16T11:00:00.000Z",
      },
      {
        id: "msg-302",
        sender: "support",
        senderName: "واحد حسابداری دینووا",
        message: "سلام خانم دکتر باقری، لطفا روزنامه رسمی و شناسه ملی معتبر شرکت را در پاسخ به همین پیام ارسال فرمایید تا فاکتور مهرشده صادر گردد.",
        sentAt: "2026-08-16T13:40:00.000Z",
      },
    ],
    createdAt: "2026-08-16T11:00:00.000Z",
    updatedAt: "2026-08-16T13:40:00.000Z",
  },
  {
    id: "tck-004",
    ticketNumber: "TCK-4084",
    customerName: "امیرحسین رضایی",
    customerPhone: "09127778899",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    subject: "پیگیری وضعیت گارانتی تعویض ۷ روزه کالا",
    priority: "low",
    status: "closed",
    relatedOrderId: "ORD-9610",
    messages: [
      {
        id: "msg-401",
        sender: "customer",
        senderName: "امیرحسین رضایی",
        message: "سلام، می‌خواستم بدونم شرایط گارانتی ۷ روزه برای هارد اکسترنال چطوره؟ در صورتی که تست سرعت پایین باشه تعویض میشه؟",
        sentAt: "2026-08-14T08:15:00.000Z",
      },
      {
        id: "msg-402",
        sender: "support",
        senderName: "کارشناس گارانتی دینووا",
        message: "سلام امیرحسین عزیز، بله در صورت تایید کارشناسان فنی مبنی بر نقص سخت‌افزاری یا افت سرعت نامتعارف، کالا ظرف ۴۸ ساعت با نمونه نو جایگزین خواهد شد.",
        sentAt: "2026-08-14T09:30:00.000Z",
      },
      {
        id: "msg-403",
        sender: "customer",
        senderName: "امیرحسین رضایی",
        message: "ممنون، تست کردم و مشکلی نداشت. تیکت رو می‌تونید ببندید.",
        sentAt: "2026-08-14T10:05:00.000Z",
      },
    ],
    createdAt: "2026-08-14T08:15:00.000Z",
    updatedAt: "2026-08-14T10:05:00.000Z",
  },
  {
    id: "tck-005",
    ticketNumber: "TCK-4085",
    customerName: "مریم حسینی",
    customerPhone: "09192223344",
    customerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    subject: "نقص فنی و خط‌افتادگی در بدنه ماوس لاجیتک",
    priority: "urgent",
    status: "open",
    relatedOrderId: "ORD-9829",
    messages: [
      {
        id: "msg-501",
        sender: "customer",
        senderName: "مریم حسینی",
        message: "سلام، ماوس مدل MX Master 3S به دستم رسید ولی اسکرولش گیر داره و زیر بدنه خط افتاده. خواهش می‌کنم فوری مرجوعی رو ثبت کنید.",
        sentAt: "2026-08-17T02:40:00.000Z",
      },
    ],
    createdAt: "2026-08-17T02:40:00.000Z",
    updatedAt: "2026-08-17T02:40:00.000Z",
  },
  {
    id: "tck-006",
    ticketNumber: "TCK-4086",
    customerName: "علی پاکزاد",
    customerPhone: "09128889900",
    customerAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    subject: "استعلام موجودی و خرید عمده تبلت برای آموزشگاه",
    priority: "medium",
    status: "in_progress",
    messages: [
      {
        id: "msg-601",
        sender: "customer",
        senderName: "علی پاکزاد",
        message: "درود، برای تجهیز لابراتوار طراحی نیاز به ۱۰ دستگاه Galaxy Tab S9 Ultra داریم. آیا امکان صدور پیش‌فاکتور با تخفیف همکاری سازمانی وجود دارد؟",
        sentAt: "2026-08-15T15:10:00.000Z",
      },
      {
        id: "msg-602",
        sender: "support",
        senderName: "واحد فروش B2B دینووا",
        message: "سلام جناب پاکزاد، پیش‌فاکتور با ۱۰٪ تخفیف سازمانی به ایمیل شما ارسال شد. جهت نهایی‌سازی هماهنگی با شما انجام خواهد شد.",
        sentAt: "2026-08-15T17:00:00.000Z",
      },
    ],
    createdAt: "2026-08-15T15:10:00.000Z",
    updatedAt: "2026-08-15T17:00:00.000Z",
  },
];

export const INITIAL_MOCK_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "notif-001",
    type: "ticket",
    title: "تیکت فوری جدید (#TCK-4085)",
    message: "مشتری مریم حسینی درخواست مرجوعی فوری ماوس لاجیتک را ثبت کرد.",
    isRead: false,
    targetUrl: "support",
    createdAt: "2026-08-17T02:40:00.000Z",
  },
  {
    id: "notif-002",
    type: "review",
    title: "نظر نیازمند بررسی و تایید",
    message: "نظر جدید ۲ ستاره از دکتر باقری روی محصول ساعت هوشمند اپل واچ ثبت شد.",
    isRead: false,
    targetUrl: "feedback",
    createdAt: "2026-08-17T01:45:00.000Z",
  },
  {
    id: "notif-003",
    type: "order",
    title: "سفارش جدید پرداخت‌شده (ORD-9830)",
    message: "سفارش به مبلغ ۵۸,۲۰۰,۰۰۰ تومان با روش ارسال پیک اکسپرس ثبت گردید.",
    isRead: false,
    targetUrl: "orders",
    createdAt: "2026-08-17T01:10:00.000Z",
  },
  {
    id: "notif-004",
    type: "low_stock",
    title: "هشدار کسری موجودی انبار",
    message: "موجودی کالای «هدفون سونی WH-1000XM5» به کمتر از ۳ عدد رسیده است.",
    isRead: false,
    targetUrl: "products",
    createdAt: "2026-08-16T21:30:00.000Z",
  },
  {
    id: "notif-005",
    type: "ticket",
    title: "پاسخ مشتری در تیکت (#TCK-4081)",
    message: "سارا ابراهیمی پاسخ جدیدی در خصوص تغییر آدرس سفارش ارسال نمود.",
    isRead: true,
    targetUrl: "support",
    createdAt: "2026-08-17T02:32:00.000Z",
  },
  {
    id: "notif-006",
    type: "order",
    title: "تغییر وضعیت مرسوله به تحویل‌شده",
    message: "مرسوله ORD-9815 توسط تیپاکس به مشتری تحویل داده شد.",
    isRead: true,
    targetUrl: "orders",
    createdAt: "2026-08-16T16:00:00.000Z",
  },
  {
    id: "notif-007",
    type: "low_stock",
    title: "اتمام موجودی رنگ تیتانیوم مشکی",
    message: "گوشی iPhone 15 Pro Max 256GB در انبار مرکزی ناموجود شد.",
    isRead: true,
    targetUrl: "products",
    createdAt: "2026-08-15T19:40:00.000Z",
  },
];

// Helper to delay
const delay = (ms: number = NETWORK_LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

class MockFeedbackService {
  // -------------------------------------------------------------
  // REVIEWS METHODS (PBI-6.1 / PBI-6.2)
  // -------------------------------------------------------------
  private getStoredReviews(): ProductReview[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REVIEWS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback on parse error
    }
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(INITIAL_MOCK_REVIEWS));
    return [...INITIAL_MOCK_REVIEWS];
  }

  private saveStoredReviews(reviews: ProductReview[]): void {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
  }

  async getReviews(params: ReviewFilterParams = {}): Promise<ReviewListResponse> {
    await delay();
    const all = this.getStoredReviews();

    let filtered = [...all];

    if (params.status && params.status !== "all") {
      filtered = filtered.filter((r) => r.status === params.status);
    }

    if (params.rating && params.rating !== "all") {
      filtered = filtered.filter((r) => r.rating === params.rating);
    }

    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.productTitle.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q) ||
          (r.adminReply && r.adminReply.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (params.sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "highest_rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest_rating":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 8);
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    // Calculate aggregate metrics
    const totalReviews = all.length;
    const pendingCount = all.filter((r) => r.status === "pending").length;
    const approvedCount = all.filter((r) => r.status === "approved").length;
    const rejectedCount = all.filter((r) => r.status === "rejected").length;
    const avgRating =
      totalReviews > 0
        ? Number((all.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1))
        : 5.0;

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      counts: {
        all: totalReviews,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        averageRating: avgRating,
      },
    };
  }

  async updateReviewStatus(id: string, status: ReviewStatus): Promise<ProductReview> {
    await delay();
    const reviews = this.getStoredReviews();
    const index = reviews.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`نظر با شناسه ${id} یافت نشد.`);
    }

    reviews[index] = {
      ...reviews[index],
      status,
    };

    this.saveStoredReviews(reviews);
    return reviews[index];
  }

  async replyToReview(id: string, replyText: string): Promise<ProductReview> {
    await delay();
    const reviews = this.getStoredReviews();
    const index = reviews.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`نظر با شناسه ${id} یافت نشد.`);
    }

    reviews[index] = {
      ...reviews[index],
      adminReply: replyText.trim(),
      adminRepliedAt: new Date().toISOString(),
      // Automatically approve when replied, or keep current approved status
      status: reviews[index].status === "rejected" ? "rejected" : "approved",
    };

    this.saveStoredReviews(reviews);
    return reviews[index];
  }

  async deleteReview(id: string): Promise<{ success: boolean }> {
    await delay();
    const reviews = this.getStoredReviews();
    const filtered = reviews.filter((r) => r.id !== id);
    this.saveStoredReviews(filtered);
    return { success: true };
  }

  // -------------------------------------------------------------
  // TICKETS & CHAT METHODS (PBI-6.1 / PBI-6.3)
  // -------------------------------------------------------------
  private getStoredTickets(): SupportTicket[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TICKETS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(INITIAL_MOCK_TICKETS));
    return [...INITIAL_MOCK_TICKETS];
  }

  private saveStoredTickets(tickets: SupportTicket[]): void {
    localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(tickets));
  }

  async getTickets(params: TicketFilterParams = {}): Promise<TicketListResponse> {
    await delay();
    const all = this.getStoredTickets();

    let filtered = [...all];

    if (params.status && params.status !== "all") {
      filtered = filtered.filter((t) => t.status === params.status);
    }

    if (params.priority && params.priority !== "all") {
      filtered = filtered.filter((t) => t.priority === params.priority);
    }

    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.ticketNumber.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.customerPhone.includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          (t.relatedOrderId && t.relatedOrderId.toLowerCase().includes(q)) ||
          t.messages.some((m) => m.message.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (params.sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
        break;
      case "urgent_first": {
        const priorityWeight: Record<TicketPriority, number> = {
          urgent: 4,
          high: 3,
          medium: 2,
          low: 1,
        };
        filtered.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
        break;
      }
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
    }

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 8);
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    const allCount = all.length;
    const openCount = all.filter((t) => t.status === "open").length;
    const inProgressCount = all.filter((t) => t.status === "in_progress").length;
    const waitingCustomerCount = all.filter((t) => t.status === "waiting_customer").length;
    const closedCount = all.filter((t) => t.status === "closed").length;
    const urgentCount = all.filter((t) => t.priority === "urgent" && t.status !== "closed").length;

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      counts: {
        all: allCount,
        open: openCount,
        in_progress: inProgressCount,
        waiting_customer: waitingCustomerCount,
        closed: closedCount,
        urgent: urgentCount,
      },
    };
  }

  async getTicketById(id: string): Promise<SupportTicket> {
    await delay();
    const tickets = this.getStoredTickets();
    const found = tickets.find((t) => t.id === id);
    if (!found) {
      throw new Error(`تیکت با شناسه ${id} یافت نشد.`);
    }
    return found;
  }

  async sendTicketReply(
    ticketId: string,
    message: string,
    sender: "support" | "customer" = "support",
    senderName: string = "پشتیبانی دینووا"
  ): Promise<SupportTicket> {
    await delay();
    const tickets = this.getStoredTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) {
      throw new Error(`تیکت با شناسه ${ticketId} یافت نشد.`);
    }

    const newMessage: SupportTicketMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender,
      senderName,
      message: message.trim(),
      sentAt: new Date().toISOString(),
    };

    const targetTicket = tickets[index];
    const updatedMessages = [...targetTicket.messages, newMessage];

    // If support replies, switch to in_progress or waiting_customer if open
    let newStatus = targetTicket.status;
    if (sender === "support" && targetTicket.status === "open") {
      newStatus = "in_progress";
    }

    tickets[index] = {
      ...targetTicket,
      messages: updatedMessages,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    this.saveStoredTickets(tickets);
    return tickets[index];
  }

  async updateTicketStatus(id: string, status: TicketStatus): Promise<SupportTicket> {
    await delay();
    const tickets = this.getStoredTickets();
    const index = tickets.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`تیکت با شناسه ${id} یافت نشد.`);
    }

    tickets[index] = {
      ...tickets[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    this.saveStoredTickets(tickets);
    return tickets[index];
  }

  async updateTicketPriority(id: string, priority: TicketPriority): Promise<SupportTicket> {
    await delay();
    const tickets = this.getStoredTickets();
    const index = tickets.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`تیکت با شناسه ${id} یافت نشد.`);
    }

    tickets[index] = {
      ...tickets[index],
      priority,
      updatedAt: new Date().toISOString(),
    };

    this.saveStoredTickets(tickets);
    return tickets[index];
  }

  // -------------------------------------------------------------
  // NOTIFICATIONS METHODS (PBI-6.1 / PBI-6.4)
  // -------------------------------------------------------------
  private getStoredNotifications(): AdminNotification[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(INITIAL_MOCK_NOTIFICATIONS));
    return [...INITIAL_MOCK_NOTIFICATIONS];
  }

  private saveStoredNotifications(notifications: AdminNotification[]): void {
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
  }

  async getNotifications(): Promise<AdminNotification[]> {
    await delay(250);
    const notifications = this.getStoredNotifications();
    return notifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async markNotificationAsRead(id: string): Promise<AdminNotification> {
    await delay(150);
    const notifications = this.getStoredNotifications();
    const index = notifications.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new Error(`اعلان با شناسه ${id} یافت نشد.`);
    }

    notifications[index] = {
      ...notifications[index],
      isRead: true,
    };

    this.saveStoredNotifications(notifications);
    return notifications[index];
  }

  async markAllNotificationsAsRead(): Promise<AdminNotification[]> {
    await delay(200);
    const notifications = this.getStoredNotifications();
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    this.saveStoredNotifications(updated);
    return updated;
  }

  async deleteNotification(id: string): Promise<{ success: boolean }> {
    await delay(150);
    const notifications = this.getStoredNotifications();
    const filtered = notifications.filter((n) => n.id !== id);
    this.saveStoredNotifications(filtered);
    return { success: true };
  }

  // Reset all Sprint 6 mock data
  async resetAllToDefaults(): Promise<void> {
    await delay(300);
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(INITIAL_MOCK_REVIEWS));
    localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(INITIAL_MOCK_TICKETS));
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(INITIAL_MOCK_NOTIFICATIONS));
  }
}

export const mockFeedbackService = new MockFeedbackService();
export default mockFeedbackService;
