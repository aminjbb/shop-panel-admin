import type {
  Order,
  OrderCounts,
  OrderFilterParams,
  OrderListResponse,
  OrderStats,
  PaymentStatus,
  UpdateFulfillmentPayload,
  CourierOption,
} from "@/types/order";

const STORAGE_KEY = "dynova_mock_orders_v1";
const NETWORK_LATENCY_MS = 500;

export const AVAILABLE_COURIERS: CourierOption[] = [
  { id: "pishtaz", name: "پست پیشتاز جمهوری اسلامی", logoColor: "#f59e0b" },
  { id: "tipax", name: "تیپاکس (اکسپرس بین‌شهری)", logoColor: "#ef4444" },
  { id: "chapar", name: "کالارسان چاپار", logoColor: "#3b82f6" },
  { id: "dynova_express", name: "پیک اختصاصی فوری دینووا", logoColor: "#6366f1" },
  { id: "mahex", name: "ماهکس اکسپرس", logoColor: "#10b981" },
  { id: "snappbox", name: "اسنپ‌باکس (تحویل سریع)", logoColor: "#059669" },
];

export const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: "ord-001",
    orderNumber: "ORD-9482",
    createdAt: "2026-08-17T08:45:00.000Z",
    customer: {
      name: "سارا ابراهیمی",
      phone: "09123456789",
      email: "sara.ebrahimi@gmail.com",
      address: {
        province: "تهران",
        city: "تهران",
        street: "خیابان ولیعصر، بالاتر از پارک ساعی، برج سروستان",
        plaque: "۲۴",
        unit: "۵",
        postalCode: "1433895123",
      },
    },
    items: [
      {
        productId: "prod-001",
        title: "هدفون بی‌سیم نویز کنسلینگ داینوا پرو",
        variant: "رنگ: مشکی مات • گارانتی ۱۸ ماهه",
        unitPrice: 4850000,
        quantity: 1,
        thumbnail:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
      },
      {
        productId: "prod-003",
        title: "پاوربانک ۲۰۰۰۰ میلی‌آمپر فست شارژ ۶۵ وات",
        variant: "رنگ: خاکستری فضایی",
        unitPrice: 1950000,
        quantity: 1,
        thumbnail:
          "https://images.unsplash.com/photo-1609592424368-80e9222fa159?w=500&auto=format&fit=crop&q=80",
      },
    ],
    payment: {
      method: "online",
      status: "paid",
      transactionId: "TXN-98421045",
      paidAt: "2026-08-17T08:46:12.000Z",
      gateway: "درگاه پرداخت سامان کیش",
    },
    fulfillment: {
      status: "processing",
      notes: "ارسال سریع در بازه عصر درخواست شده است.",
    },
    totalAmount: 6800000,
    discountAmount: 300000,
    shippingFee: 65000,
    finalPayable: 6565000,
  },
  {
    id: "ord-002",
    orderNumber: "ORD-9481",
    createdAt: "2026-08-17T07:15:00.000Z",
    customer: {
      name: "علی محمودی",
      phone: "09351122334",
      email: "ali.mahmoudi@yahoo.com",
      address: {
        province: "اصفهان",
        city: "اصفهان",
        street: "خیابان چهارباغ بالا، کوچه هدایت، پلاک ۱۸",
        plaque: "۱۸",
        unit: "۲",
        postalCode: "8164789012",
      },
    },
    items: [
      {
        productId: "prod-002",
        title: "ساعت هوشمند داینوا واچ الترا ۲",
        variant: "رنگ: نقره‌ای تیتانیوم • بند آلپاین",
        unitPrice: 8900000,
        quantity: 1,
        thumbnail:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
      },
    ],
    payment: {
      method: "online",
      status: "paid",
      transactionId: "TXN-98418902",
      paidAt: "2026-08-17T07:16:40.000Z",
      gateway: "به‌پرداخت ملت",
    },
    fulfillment: {
      status: "ready_to_ship",
      notes: "بسته‌بندی حباب‌دار و ضدضربه انجام شد.",
    },
    totalAmount: 8900000,
    discountAmount: 400000,
    shippingFee: 0,
    finalPayable: 8500000,
  },
  {
    id: "ord-003",
    orderNumber: "ORD-9479",
    createdAt: "2026-08-16T18:30:00.000Z",
    customer: {
      name: "فاطمه رضایی",
      phone: "09198765432",
      email: "f.rezaei@chmail.ir",
      address: {
        province: "فارس",
        city: "شیراز",
        street: "بلوار ارم، کوچه ۱۲، مجتمع ارغوان",
        plaque: "۱۲",
        unit: "۷",
        postalCode: "7145896321",
      },
    },
    items: [
      {
        productId: "prod-004",
        title: "کوله پشتی مسافرتی ارگونومیک ۴۵ لیتری",
        variant: "رنگ: سورمه‌ای مات • ضدآب",
        unitPrice: 3200000,
        quantity: 2,
        thumbnail:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
      },
    ],
    payment: {
      method: "online",
      status: "paid",
      transactionId: "TXN-98394120",
      paidAt: "2026-08-16T18:32:10.000Z",
      gateway: "زرین‌پال",
    },
    fulfillment: {
      status: "shipped",
      courierName: "تیپاکس (اکسپرس بین‌شهری)",
      trackingCode: "TPX-8472910482",
      dispatchedAt: "2026-08-17T06:30:00.000Z",
      estimatedDelivery: "2026-08-18",
    },
    totalAmount: 6400000,
    discountAmount: 0,
    shippingFee: 85000,
    finalPayable: 6485000,
  },
  {
    id: "ord-004",
    orderNumber: "ORD-9475",
    createdAt: "2026-08-16T14:10:00.000Z",
    customer: {
      name: "امیرحسین کریمی",
      phone: "09132223344",
      email: "amir.karimi@gmail.com",
      address: {
        province: "خراسان رضوی",
        city: "مشهد",
        street: "بلوار احمدآباد، خیابان راهنمایی، پلاک ۴۴",
        plaque: "۴۴",
        unit: "۱",
        postalCode: "9183746520",
      },
    },
    items: [
      {
        productId: "prod-001",
        title: "هدفون بی‌سیم نویز کنسلینگ داینوا پرو",
        variant: "رنگ: نقره‌ای تیتانیوم",
        unitPrice: 4850000,
        quantity: 1,
        thumbnail:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
      },
    ],
    payment: {
      method: "online",
      status: "paid",
      transactionId: "TXN-98350129",
      paidAt: "2026-08-16T14:11:05.000Z",
      gateway: "آپ (آسان پرداخت)",
    },
    fulfillment: {
      status: "delivered",
      courierName: "پست پیشتاز جمهوری اسلامی",
      trackingCode: "PST-194820394857",
      dispatchedAt: "2026-08-16T16:00:00.000Z",
      deliveredAt: "2026-08-17T09:30:00.000Z",
    },
    totalAmount: 4850000,
    discountAmount: 200000,
    shippingFee: 50000,
    finalPayable: 4700000,
  },
  {
    id: "ord-005",
    orderNumber: "ORD-9471",
    createdAt: "2026-08-16T11:20:00.000Z",
    customer: {
      name: "نیلوفر کاظمی",
      phone: "09367778899",
      email: "n.kazemi@outlook.com",
      address: {
        province: "آذربایجان شرقی",
        city: "تبریز",
        street: "خیابان ولیعصر، خیابان فروغی، مجتمع سهند",
        plaque: "۹",
        unit: "۴",
        postalCode: "5156789123",
      },
    },
    items: [
      {
        productId: "prod-006",
        title: "اسپیکر ضدآب پرتابل داینوا بوم",
        variant: "رنگ: قرمز مات • توان ۳۰ وات",
        unitPrice: 2450000,
        quantity: 1,
        thumbnail:
          "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80",
      },
    ],
    payment: {
      method: "card_to_card",
      status: "pending",
      transactionId: "CARD-748291",
    },
    fulfillment: {
      status: "processing",
      notes: "در انتظار بررسی رسید فیش کارت به کارت حسابداری.",
    },
    totalAmount: 2450000,
    discountAmount: 0,
    shippingFee: 65000,
    finalPayable: 2515000,
  },
  {
    id: "ord-006",
    orderNumber: "ORD-9468",
    createdAt: "2026-08-15T20:15:00.000Z",
    customer: {
      name: "حسین صادقی",
      phone: "09121112233",
      email: "h.sadeghi@gmail.com",
      address: {
        province: "گیلان",
        city: "رشت",
        street: "بلوار گلسار، خیابان ۱۰۸، ساختمان پامچال",
        plaque: "۱۴",
        unit: "۳",
        postalCode: "4163897451",
      },
    },
    items: [
      {
        productId: "prod-005",
        title: "ماوس بی‌سیم ارگونومیک داینوا مستر",
        variant: "رنگ: خاکستری گرافیتی",
        unitPrice: 1650000,
        quantity: 1,
        thumbnail:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80",
      },
      {
        productId: "prod-003",
        title: "پاوربانک ۲۰۰۰۰ میلی‌آمپر فست شارژ ۶۵ وات",
        variant: "رنگ: سفید مات",
        unitPrice: 1950000,
        quantity: 2,
        thumbnail:
          "https://images.unsplash.com/photo-1609592424368-80e9222fa159?w=500&auto=format&fit=crop&q=80",
      },
    ],
    payment: {
      method: "online",
      status: "paid",
      transactionId: "TXN-98299104",
      paidAt: "2026-08-15T20:16:30.000Z",
      gateway: "درگاه پاسارگاد",
    },
    fulfillment: {
      status: "shipped",
      courierName: "کالارسان چاپار",
      trackingCode: "CHP-9948201",
      dispatchedAt: "2026-08-16T09:00:00.000Z",
      estimatedDelivery: "2026-08-17",
    },
    totalAmount: 5550000,
    discountAmount: 250000,
    shippingFee: 65000,
    finalPayable: 5365000,
  },
  {
    id: "ord-007",
    orderNumber: "ORD-9464",
    createdAt: "2026-08-15T15:40:00.000Z",
    customer: {
      name: "مهسا انصاری",
      phone: "09384445566",
      email: "mahsa.ansari@gmail.com",
      address: {
        province: "تهران",
        city: "تهران",
        street: "سعادت‌آباد، میدان کاج، خیابان مروارید، کوچه دوم",
        plaque: "۷",
        unit: "۸",
        postalCode: "1997845120",
      },
    },
    items: [
      {
        productId: "prod-002",
        title: "ساعت هوشمند داینوا واچ الترا ۲",
        variant: "رنگ: مشکی متالیک",
        unitPrice: 8900000,
        quantity: 1,
        thumbnail:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
      },
    ],
    payment: {
      method: "online",
      status: "failed",
      transactionId: "TXN-ERR-98214",
    },
    fulfillment: {
      status: "canceled",
      notes: "تراکنش بانکی ناموفق به علت خطای شبکه شتاب کاربر.",
    },
    totalAmount: 8900000,
    discountAmount: 0,
    shippingFee: 65000,
    finalPayable: 8965000,
  },
  {
    id: "ord-008",
    orderNumber: "ORD-9460",
    createdAt: "2026-08-15T10:00:00.000Z",
    customer: {
      name: "پویا قاسمی",
      phone: "09159990011",
      email: "pouya.gh@yahoo.com",
      address: {
        province: "البرز",
        city: "کرج",
        street: "جهانشهر، بلوار مولانا، کوچه نیلوفر، پلاک ۵",
        plaque: "۵",
        unit: "۲",
        postalCode: "3145890123",
      },
    },
    items: [
      {
        productId: "prod-001",
        title: "هدفون بی‌سیم نویز کنسلینگ داینوا پرو",
        variant: "رنگ: مشکی مات",
        unitPrice: 4850000,
        quantity: 1,
        thumbnail:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
      },
    ],
    payment: {
      method: "cash_on_delivery",
      status: "pending",
    },
    fulfillment: {
      status: "ready_to_ship",
      notes: "تسویه نقدی / دستگاه پوز هنگام تحویل کالا.",
    },
    totalAmount: 4850000,
    discountAmount: 150000,
    shippingFee: 65000,
    finalPayable: 4765000,
  },
  {
    id: "ord-009",
    orderNumber: "ORD-9456",
    createdAt: "2026-08-14T19:20:00.000Z",
    customer: {
      name: "مریم کمالی",
      phone: "09176543210",
      email: "m.kamali@gmail.com",
      address: {
        province: "یزد",
        city: "یزد",
        street: "بلوار جمهوری اسلامی، کوچه ۲۴، پلاک ۸",
        plaque: "۸",
        unit: "۱",
        postalCode: "8917894561",
      },
    },
    items: [
      {
        productId: "prod-003",
        title: "پاوربانک ۲۰۰۰۰ میلی‌آمپر فست شارژ ۶۵ وات",
        variant: "رنگ: مشکی مات",
        unitPrice: 1950000,
        quantity: 1,
        thumbnail:
          "https://images.unsplash.com/photo-1609592424368-80e9222fa159?w=500&auto=format&fit=crop&q=80",
      },
    ],
    payment: {
      method: "online",
      status: "refunded",
      transactionId: "REF-98104928",
      paidAt: "2026-08-14T19:21:00.000Z",
      gateway: "زرین‌پال",
    },
    fulfillment: {
      status: "canceled",
      notes: "سفارش به درخواست مشتری لغو و مبلغ کامل مسترد گردید.",
    },
    totalAmount: 1950000,
    discountAmount: 0,
    shippingFee: 50000,
    finalPayable: 2000000,
  },
  {
    id: "ord-010",
    orderNumber: "ORD-9452",
    createdAt: "2026-08-14T16:00:00.000Z",
    customer: {
      name: "رضا بختیاری",
      phone: "09163334455",
      email: "reza.bakhtiari@gmail.com",
      address: {
        province: "خوزستان",
        city: "اهواز",
        street: "کیانپارس، خیابان ۵ غربی، پلاک ۲۹",
        plaque: "۲۹",
        unit: "۴",
        postalCode: "6133890145",
      },
    },
    items: [
      {
        productId: "prod-004",
        title: "کوله پشتی مسافرتی ارگونومیک ۴۵ لیتری",
        variant: "رنگ: طوسی تیره",
        unitPrice: 3200000,
        quantity: 1,
        thumbnail:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
      },
      {
        productId: "prod-005",
        title: "ماوس بی‌سیم ارگونومیک داینوا مستر",
        variant: "رنگ: مشکی",
        unitPrice: 1650000,
        quantity: 1,
        thumbnail:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80",
      },
    ],
    payment: {
      method: "online",
      status: "paid",
      transactionId: "TXN-98075412",
      paidAt: "2026-08-14T16:02:15.000Z",
      gateway: "به‌پرداخت ملت",
    },
    fulfillment: {
      status: "delivered",
      courierName: "ماهکس اکسپرس",
      trackingCode: "MHX-748920194",
      dispatchedAt: "2026-08-15T08:00:00.000Z",
      deliveredAt: "2026-08-16T12:00:00.000Z",
    },
    totalAmount: 4850000,
    discountAmount: 200000,
    shippingFee: 75000,
    finalPayable: 4725000,
  },
  {
    id: "ord-011",
    orderNumber: "ORD-9448",
    createdAt: "2026-08-14T11:45:00.000Z",
    customer: {
      name: "الهام شریفی",
      phone: "09127776655",
      email: "elham.sharifi@gmail.com",
      address: {
        province: "تهران",
        city: "تهران",
        street: "پاسداران، بوستان دوم، انتهای خیابان افشاری، پلاک ۱۵",
        plaque: "۱۵",
        unit: "۶",
        postalCode: "1665891234",
      },
    },
    items: [
      {
        productId: "prod-002",
        title: "ساعت هوشمند داینوا واچ الترا ۲",
        variant: "رنگ: نقره‌ای تیتانیوم",
        unitPrice: 8900000,
        quantity: 1,
        thumbnail:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
      },
    ],
    payment: {
      method: "online",
      status: "paid",
      transactionId: "TXN-98011239",
      paidAt: "2026-08-14T11:46:50.000Z",
      gateway: "سامان کیش",
    },
    fulfillment: {
      status: "delivered",
      courierName: "پیک اختصاصی فوری دینووا",
      trackingCode: "DYN-EXP-1049",
      dispatchedAt: "2026-08-14T13:00:00.000Z",
      deliveredAt: "2026-08-14T15:30:00.000Z",
    },
    totalAmount: 8900000,
    discountAmount: 500000,
    shippingFee: 0,
    finalPayable: 8400000,
  },
  {
    id: "ord-012",
    orderNumber: "ORD-9445",
    createdAt: "2026-08-13T21:10:00.000Z",
    customer: {
      name: "نوید طاهری",
      phone: "09378889900",
      email: "navid.taheri@yahoo.com",
      address: {
        province: "قم",
        city: "قم",
        street: "بلوار امین، کوچه ۲۱، مجتمع بهارستان",
        plaque: "۳",
        unit: "۱",
        postalCode: "3715894321",
      },
    },
    items: [
      {
        productId: "prod-006",
        title: "اسپیکر ضدآب پرتابل داینوا بوم",
        variant: "رنگ: مشکی مات",
        unitPrice: 2450000,
        quantity: 2,
        thumbnail:
          "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80",
      },
    ],
    payment: {
      method: "online",
      status: "paid",
      transactionId: "TXN-97940192",
      paidAt: "2026-08-13T21:11:30.000Z",
      gateway: "به‌پرداخت ملت",
    },
    fulfillment: {
      status: "shipped",
      courierName: "پست پیشتاز جمهوری اسلامی",
      trackingCode: "PST-789012345678",
      dispatchedAt: "2026-08-14T10:00:00.000Z",
      estimatedDelivery: "2026-08-16",
    },
    totalAmount: 4900000,
    discountAmount: 200000,
    shippingFee: 65000,
    finalPayable: 4765000,
  },
  {
    id: "ord-013",
    orderNumber: "ORD-9440",
    createdAt: "2026-08-13T14:30:00.000Z",
    customer: {
      name: "نگار مرادی",
      phone: "09120001122",
      email: "negar.moradi@gmail.com",
      address: {
        province: "مازندران",
        city: "ساری",
        street: "بلوار فرهنگ، کوچه پیوندی، پلاک ۱۱",
        plaque: "۱۱",
        unit: "۵",
        postalCode: "4815890123",
      },
    },
    items: [
      {
        productId: "prod-001",
        title: "هدفون بی‌سیم نویز کنسلینگ داینوا پرو",
        variant: "رنگ: مشکی مات",
        unitPrice: 4850000,
        quantity: 1,
        thumbnail:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
      },
      {
        productId: "prod-005",
        title: "ماوس بی‌سیم ارگونومیک داینوا مستر",
        variant: "رنگ: خاکستری گرافیتی",
        unitPrice: 1650000,
        quantity: 1,
        thumbnail:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80",
      },
    ],
    payment: {
      method: "online",
      status: "paid",
      transactionId: "TXN-97881024",
      paidAt: "2026-08-13T14:32:00.000Z",
      gateway: "آپ (آسان پرداخت)",
    },
    fulfillment: {
      status: "delivered",
      courierName: "تیپاکس (اکسپرس بین‌شهری)",
      trackingCode: "TPX-1029384756",
      dispatchedAt: "2026-08-14T08:30:00.000Z",
      deliveredAt: "2026-08-15T14:00:00.000Z",
    },
    totalAmount: 6500000,
    discountAmount: 350000,
    shippingFee: 85000,
    finalPayable: 6235000,
  },
  {
    id: "ord-014",
    orderNumber: "ORD-9436",
    createdAt: "2026-08-13T09:15:00.000Z",
    customer: {
      name: "مهدی اکبری",
      phone: "09395556677",
      email: "mehdi.akbari@chmail.ir",
      address: {
        province: "همدان",
        city: "همدان",
        street: "خیابان بوعلی، کوچه پزشکان، پلاک ۶",
        plaque: "۶",
        unit: "۲",
        postalCode: "6514897210",
      },
    },
    items: [
      {
        productId: "prod-003",
        title: "پاوربانک ۲۰۰۰۰ میلی‌آمپر فست شارژ ۶۵ وات",
        variant: "رنگ: خاکستری فضایی",
        unitPrice: 1950000,
        quantity: 1,
        thumbnail:
          "https://images.unsplash.com/photo-1609592424368-80e9222fa159?w=500&auto=format&fit=crop&q=80",
      },
    ],
    payment: {
      method: "online",
      status: "paid",
      transactionId: "TXN-97745109",
      paidAt: "2026-08-13T09:16:20.000Z",
      gateway: "سامان کیش",
    },
    fulfillment: {
      status: "delivered",
      courierName: "پست پیشتاز جمهوری اسلامی",
      trackingCode: "PST-657483920194",
      dispatchedAt: "2026-08-13T12:00:00.000Z",
      deliveredAt: "2026-08-14T11:00:00.000Z",
    },
    totalAmount: 1950000,
    discountAmount: 0,
    shippingFee: 50000,
    finalPayable: 2000000,
  },
  {
    id: "ord-015",
    orderNumber: "ORD-9431",
    createdAt: "2026-08-12T18:00:00.000Z",
    customer: {
      name: "زهرا نوری",
      phone: "09128884433",
      email: "zahra.nouri@gmail.com",
      address: {
        province: "تهران",
        city: "تهران",
        street: "نیاوران، خیابان جماران، کوچه لادن، پلاک ۲",
        plaque: "۲",
        unit: "۱۰",
        postalCode: "1978954321",
      },
    },
    items: [
      {
        productId: "prod-002",
        title: "ساعت هوشمند داینوا واچ الترا ۲",
        variant: "رنگ: نقره‌ای تیتانیوم",
        unitPrice: 8900000,
        quantity: 2,
        thumbnail:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
      },
    ],
    payment: {
      method: "online",
      status: "paid",
      transactionId: "TXN-97689104",
      paidAt: "2026-08-12T18:01:45.000Z",
      gateway: "به‌پرداخت ملت",
    },
    fulfillment: {
      status: "delivered",
      courierName: "پیک اختصاصی فوری دینووا",
      trackingCode: "DYN-EXP-0994",
      dispatchedAt: "2026-08-12T19:00:00.000Z",
      deliveredAt: "2026-08-12T20:30:00.000Z",
    },
    totalAmount: 17800000,
    discountAmount: 1000000,
    shippingFee: 0,
    finalPayable: 16800000,
  },
  {
    id: "ord-016",
    orderNumber: "ORD-9428",
    createdAt: "2026-08-12T12:30:00.000Z",
    customer: {
      name: "فرزاد رستمی",
      phone: "09352229988",
      email: "farzad.rostami@gmail.com",
      address: {
        province: "کرمانشاه",
        city: "کرمانشاه",
        street: "خیابان نوبهار، کوچه ۱۱۴، پلاک ۷",
        plaque: "۷",
        unit: "۱",
        postalCode: "6714890123",
      },
    },
    items: [
      {
        productId: "prod-004",
        title: "کوله پشتی مسافرتی ارگونومیک ۴۵ لیتری",
        variant: "رنگ: مشکی زغالی",
        unitPrice: 3200000,
        quantity: 1,
        thumbnail:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
      },
    ],
    payment: {
      method: "card_to_card",
      status: "pending",
      transactionId: "CARD-109283",
    },
    fulfillment: {
      status: "processing",
      notes: "در نوبت صدور فاکتور و تخصیص به بسته‌بندی انبار.",
    },
    totalAmount: 3200000,
    discountAmount: 0,
    shippingFee: 65000,
    finalPayable: 3265000,
  },
];

class MockOrderService {
  private delay(ms: number = NETWORK_LATENCY_MS): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private loadOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn("Failed to parse orders from localStorage:", e);
    }
    this.saveOrders(INITIAL_MOCK_ORDERS);
    return INITIAL_MOCK_ORDERS;
  }

  private saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to save orders to localStorage:", e);
    }
  }

  async getOrders(params: OrderFilterParams = {}): Promise<OrderListResponse> {
    await this.delay();
    const allOrders = this.loadOrders();

    const counts: OrderCounts = {
      all: allOrders.length,
      processing: allOrders.filter((o) => o.fulfillment.status === "processing").length,
      ready_to_ship: allOrders.filter((o) => o.fulfillment.status === "ready_to_ship").length,
      shipped: allOrders.filter((o) => o.fulfillment.status === "shipped").length,
      delivered: allOrders.filter((o) => o.fulfillment.status === "delivered").length,
      canceled: allOrders.filter((o) => o.fulfillment.status === "canceled").length,
    };

    const paidOrders = allOrders.filter((o) => o.payment.status === "paid");
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.finalPayable, 0);
    const averageOrderValue =
      paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;

    const stats: OrderStats = {
      totalRevenue,
      totalOrdersCount: allOrders.length,
      pendingFulfillmentCount: counts.processing + counts.ready_to_ship,
      shippedCount: counts.shipped,
      deliveredCount: counts.delivered,
      averageOrderValue,
    };

    let filtered = [...allOrders];

    // Filter by fulfillment status
    if (params.status && params.status !== "all") {
      filtered = filtered.filter((o) => o.fulfillment.status === params.status);
    }

    // Filter by payment status
    if (params.paymentStatus && params.paymentStatus !== "all") {
      filtered = filtered.filter((o) => o.payment.status === params.paymentStatus);
    }

    // Search query
    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      filtered = filtered.filter((o) => {
        const matchNumber = o.orderNumber.toLowerCase().includes(q);
        const matchCustomer = o.customer.name.toLowerCase().includes(q);
        const matchPhone = o.customer.phone.includes(q);
        const matchTracking = o.fulfillment.trackingCode?.toLowerCase().includes(q) || false;
        const matchCity = o.customer.address.city.toLowerCase().includes(q);
        const matchItem = o.items.some((it) => it.title.toLowerCase().includes(q));
        return (
          matchNumber ||
          matchCustomer ||
          matchPhone ||
          matchTracking ||
          matchCity ||
          matchItem
        );
      });
    }

    // Sort
    const sortBy = params.sortBy || "createdAt";
    const sortOrder = params.sortOrder || "desc";

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "finalPayable") {
        comparison = a.finalPayable - b.finalPayable;
      } else if (sortBy === "orderNumber") {
        comparison = a.orderNumber.localeCompare(b.orderNumber);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 8;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const startIndex = (page - 1) * limit;
    const paginatedOrders = filtered.slice(startIndex, startIndex + limit);

    return {
      orders: paginatedOrders,
      total,
      page,
      limit,
      totalPages,
      counts,
      stats,
    };
  }

  async getOrderById(id: string): Promise<Order | null> {
    await this.delay(300);
    const allOrders = this.loadOrders();
    return allOrders.find((o) => o.id === id || o.orderNumber === id) || null;
  }

  async updateFulfillmentStatus(
    orderId: string,
    payload: UpdateFulfillmentPayload
  ): Promise<Order> {
    await this.delay(450);
    const allOrders = this.loadOrders();
    const index = allOrders.findIndex((o) => o.id === orderId);

    if (index === -1) {
      throw new Error(`سفارش با شناسه ${orderId} یافت نشد.`);
    }

    const order = allOrders[index];
    const now = new Date().toISOString();

    const updatedFulfillment = {
      ...order.fulfillment,
      status: payload.status,
      courierName: payload.courierName !== undefined ? payload.courierName : order.fulfillment.courierName,
      trackingCode: payload.trackingCode !== undefined ? payload.trackingCode : order.fulfillment.trackingCode,
      notes: payload.notes !== undefined ? payload.notes : order.fulfillment.notes,
      dispatchedAt: payload.status === "shipped" && !order.fulfillment.dispatchedAt ? now : order.fulfillment.dispatchedAt,
      deliveredAt: payload.status === "delivered" && !order.fulfillment.deliveredAt ? now : order.fulfillment.deliveredAt,
    };

    const updatedOrder: Order = {
      ...order,
      fulfillment: updatedFulfillment,
      updatedAt: now,
    };

    allOrders[index] = updatedOrder;
    this.saveOrders(allOrders);
    return updatedOrder;
  }

  async updatePaymentStatus(
    orderId: string,
    newStatus: PaymentStatus
  ): Promise<Order> {
    await this.delay(400);
    const allOrders = this.loadOrders();
    const index = allOrders.findIndex((o) => o.id === orderId);

    if (index === -1) {
      throw new Error(`سفارش با شناسه ${orderId} یافت نشد.`);
    }

    const order = allOrders[index];
    const updatedOrder: Order = {
      ...order,
      payment: {
        ...order.payment,
        status: newStatus,
        paidAt: newStatus === "paid" && !order.payment.paidAt ? new Date().toISOString() : order.payment.paidAt,
      },
      updatedAt: new Date().toISOString(),
    };

    allOrders[index] = updatedOrder;
    this.saveOrders(allOrders);
    return updatedOrder;
  }

  async resetOrdersToMock(): Promise<Order[]> {
    await this.delay(400);
    this.saveOrders(INITIAL_MOCK_ORDERS);
    return INITIAL_MOCK_ORDERS;
  }

  async deleteOrder(id: string): Promise<boolean> {
    await this.delay(400);
    const allOrders = this.loadOrders();
    const filtered = allOrders.filter((o) => o.id !== id);
    this.saveOrders(filtered);
    return true;
  }
}

export const mockOrderService = new MockOrderService();
export default mockOrderService;
