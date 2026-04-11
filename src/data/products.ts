export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  category: string;
  type?: string;
  brand: string;
  price_yer: number;
  price_usd: number;
  unit: string;
  minOrder: number;
  inStock: boolean;
  stockQuantity?: number;
  description: string;
  registrationNo: string;
  image: string;
  rating?: number;
  reviewsCount?: number;
  specs: {
    scientificName: string;
    manufacturer: string;
    origin: string;
    dosageForm: string;
    concentration: string;
    packaging: string;
  };
}

export const productTypes = [
  "أدوية",
  "مستلزمات طبية",
  "أجهزة طبية",
  "معدات طبية"
];

export const manufacturers = [
  "PharmaCare",
  "GlobalMed",
  "YemenPharma",
  "EuroPharma",
  "VitaHealth",
  "SafeMed",
  "HealthTech"
];

export const categories = [
  "المضادات الحيوية",
  "مسكنات الألم",
  "أدوية القلب والضغط",
  "فيتامينات ومكملات",
  "أدوية السكري",
  "مستلزمات طبية",
  "أجهزة طبية",
  "معدات طبية"
];

export const products: Product[] = [
  // المضادات الحيوية (Antibiotics)
  {
    id: "p1",
    nameAr: "أموكسيسيلين 500 ملغ",
    nameEn: "Amoxicillin 500mg",
    category: "المضادات الحيوية",
    brand: "PharmaCare",
    price_yer: 2500,
    price_usd: 4.5,
    unit: "علبة (20 كبسولة)",
    minOrder: 10,
    inStock: true,
    stockQuantity: 150,
    description: "مضاد حيوي واسع الطيف يستخدم لعلاج مجموعة متنوعة من الالتهابات البكتيرية.",
    registrationNo: "YEM-10293",
    image: "https://picsum.photos/seed/amox/400/400",
    specs: {
      scientificName: "Amoxicillin",
      manufacturer: "PharmaCare Industries",
      origin: "اليمن",
      dosageForm: "كبسولات",
      concentration: "500mg",
      packaging: "2 شريط × 10 كبسولات"
    }
  },
  {
    id: "p2",
    nameAr: "أزيثروميسين 250 ملغ",
    nameEn: "Azithromycin 250mg",
    category: "المضادات الحيوية",
    brand: "GlobalMed",
    price_yer: 3200,
    price_usd: 6.0,
    unit: "علبة (6 كبسولات)",
    minOrder: 5,
    inStock: true,
    stockQuantity: 8, // Low stock
    description: "مضاد حيوي من مجموعة الماكروليد يعالج التهابات الجهاز التنفسي والجلد.",
    registrationNo: "YEM-29384",
    image: "https://picsum.photos/seed/azith/400/400",
    specs: {
      scientificName: "Azithromycin",
      manufacturer: "GlobalMed Pharma",
      origin: "الهند",
      dosageForm: "كبسولات",
      concentration: "250mg",
      packaging: "1 شريط × 6 كبسولات"
    }
  },
  {
    id: "p3",
    nameAr: "سيبروفلوكساسين 500 ملغ",
    nameEn: "Ciprofloxacin 500mg",
    category: "المضادات الحيوية",
    brand: "YemenPharma",
    price_yer: 2800,
    price_usd: 5.2,
    unit: "علبة (10 أقراص)",
    minOrder: 10,
    inStock: true,
    stockQuantity: 45,
    description: "مضاد حيوي من الفلوروكينولونات يستخدم لعلاج الالتهابات البكتيرية الشديدة.",
    registrationNo: "YEM-48572",
    image: "https://picsum.photos/seed/cipro/400/400",
    specs: {
      scientificName: "Ciprofloxacin",
      manufacturer: "YemenPharma",
      origin: "اليمن",
      dosageForm: "أقراص مغلفة",
      concentration: "500mg",
      packaging: "1 شريط × 10 أقراص"
    }
  },
  {
    id: "p4",
    nameAr: "سيفيكسيم 400 ملغ",
    nameEn: "Cefixime 400mg",
    category: "المضادات الحيوية",
    brand: "EuroPharma",
    price_yer: 4500,
    price_usd: 8.5,
    unit: "علبة (5 كبسولات)",
    minOrder: 5,
    inStock: false,
    stockQuantity: 0,
    description: "مضاد حيوي من السيفالوسبورينات يعالج التهابات الأذن والحنجرة والمسالك البولية.",
    registrationNo: "YEM-93847",
    image: "https://picsum.photos/seed/cefix/400/400",
    specs: {
      scientificName: "Cefixime",
      manufacturer: "EuroPharma GmbH",
      origin: "ألمانيا",
      dosageForm: "كبسولات",
      concentration: "400mg",
      packaging: "1 شريط × 5 كبسولات"
    }
  },

  // مسكنات الألم (Painkillers)
  {
    id: "p5",
    nameAr: "باراسيتامول 1 غرام",
    nameEn: "Paracetamol 1g",
    category: "مسكنات الألم",
    brand: "PharmaCare",
    price_yer: 1500,
    price_usd: 2.8,
    unit: "علبة (20 قرص)",
    minOrder: 20,
    inStock: true,
    description: "مسكن للألم وخافض للحرارة فعال وآمن.",
    registrationNo: "YEM-11223",
    image: "https://picsum.photos/seed/para/400/400",
    specs: {
      scientificName: "Paracetamol",
      manufacturer: "PharmaCare Industries",
      origin: "اليمن",
      dosageForm: "أقراص",
      concentration: "1g",
      packaging: "2 شريط × 10 أقراص"
    }
  },
  {
    id: "p6",
    nameAr: "إيبوبروفين 400 ملغ",
    nameEn: "Ibuprofen 400mg",
    category: "مسكنات الألم",
    brand: "GlobalMed",
    price_yer: 1800,
    price_usd: 3.2,
    unit: "علبة (20 قرص)",
    minOrder: 15,
    inStock: true,
    description: "مضاد للالتهاب غير ستيرويدي يستخدم لتخفيف الألم والالتهاب.",
    registrationNo: "YEM-33445",
    image: "https://picsum.photos/seed/ibu/400/400",
    specs: {
      scientificName: "Ibuprofen",
      manufacturer: "GlobalMed Pharma",
      origin: "الهند",
      dosageForm: "أقراص مغلفة",
      concentration: "400mg",
      packaging: "2 شريط × 10 أقراص"
    }
  },
  {
    id: "p7",
    nameAr: "ديكلوفيناك صوديوم 50 ملغ",
    nameEn: "Diclofenac Sodium 50mg",
    category: "مسكنات الألم",
    brand: "YemenPharma",
    price_yer: 1200,
    price_usd: 2.0,
    unit: "علبة (20 قرص)",
    minOrder: 20,
    inStock: true,
    description: "مسكن قوي للألم ومضاد للالتهابات الروماتيزمية.",
    registrationNo: "YEM-55667",
    image: "https://picsum.photos/seed/diclo/400/400",
    specs: {
      scientificName: "Diclofenac Sodium",
      manufacturer: "YemenPharma",
      origin: "اليمن",
      dosageForm: "أقراص معوية",
      concentration: "50mg",
      packaging: "2 شريط × 10 أقراص"
    }
  },

  // أدوية القلب والضغط (Cardiology)
  {
    id: "p8",
    nameAr: "أملوديبين 5 ملغ",
    nameEn: "Amlodipine 5mg",
    category: "أدوية القلب والضغط",
    brand: "EuroPharma",
    price_yer: 3500,
    price_usd: 6.5,
    unit: "علبة (30 قرص)",
    minOrder: 10,
    inStock: true,
    description: "يستخدم لعلاج ارتفاع ضغط الدم والذبحة الصدرية.",
    registrationNo: "YEM-77889",
    image: "https://picsum.photos/seed/amlo/400/400",
    specs: {
      scientificName: "Amlodipine Besylate",
      manufacturer: "EuroPharma GmbH",
      origin: "ألمانيا",
      dosageForm: "أقراص",
      concentration: "5mg",
      packaging: "3 شريط × 10 أقراص"
    }
  },
  {
    id: "p9",
    nameAr: "لوسارتان 50 ملغ",
    nameEn: "Losartan 50mg",
    category: "أدوية القلب والضغط",
    brand: "GlobalMed",
    price_yer: 4200,
    price_usd: 7.8,
    unit: "علبة (30 قرص)",
    minOrder: 10,
    inStock: true,
    description: "يساعد في خفض ضغط الدم المرتفع وحماية الكلى لمرضى السكري.",
    registrationNo: "YEM-99001",
    image: "https://picsum.photos/seed/losar/400/400",
    specs: {
      scientificName: "Losartan Potassium",
      manufacturer: "GlobalMed Pharma",
      origin: "الهند",
      dosageForm: "أقراص مغلفة",
      concentration: "50mg",
      packaging: "3 شريط × 10 أقراص"
    }
  },
  {
    id: "p10",
    nameAr: "أتورفاستاتين 20 ملغ",
    nameEn: "Atorvastatin 20mg",
    category: "أدوية القلب والضغط",
    brand: "PharmaCare",
    price_yer: 3800,
    price_usd: 7.0,
    unit: "علبة (30 قرص)",
    minOrder: 10,
    inStock: true,
    description: "يستخدم لخفض مستويات الكوليسترول والدهون الثلاثية في الدم.",
    registrationNo: "YEM-22334",
    image: "https://picsum.photos/seed/ator/400/400",
    specs: {
      scientificName: "Atorvastatin Calcium",
      manufacturer: "PharmaCare Industries",
      origin: "اليمن",
      dosageForm: "أقراص مغلفة",
      concentration: "20mg",
      packaging: "3 شريط × 10 أقراص"
    }
  },

  // فيتامينات ومكملات (Vitamins)
  {
    id: "p11",
    nameAr: "فيتامين سي 1000 ملغ",
    nameEn: "Vitamin C 1000mg",
    category: "فيتامينات ومكملات",
    brand: "VitaHealth",
    price_yer: 2500,
    price_usd: 4.5,
    unit: "علبة (20 قرص فوار)",
    minOrder: 15,
    inStock: true,
    description: "مكمل غذائي لتعزيز المناعة ومضاد للأكسدة.",
    registrationNo: "YEM-44556",
    image: "https://picsum.photos/seed/vitc/400/400",
    specs: {
      scientificName: "Ascorbic Acid",
      manufacturer: "VitaHealth Labs",
      origin: "الولايات المتحدة",
      dosageForm: "أقراص فوارة",
      concentration: "1000mg",
      packaging: "أنبوب × 20 قرص"
    }
  },
  {
    id: "p12",
    nameAr: "أوميغا 3 زيت السمك",
    nameEn: "Omega 3 Fish Oil",
    category: "فيتامينات ومكملات",
    brand: "VitaHealth",
    price_yer: 5500,
    price_usd: 10.0,
    unit: "علبة (60 كبسولة)",
    minOrder: 10,
    inStock: true,
    description: "يدعم صحة القلب والدماغ والمفاصل.",
    registrationNo: "YEM-66778",
    image: "https://picsum.photos/seed/omega/400/400",
    specs: {
      scientificName: "Omega-3 Fatty Acids",
      manufacturer: "VitaHealth Labs",
      origin: "الولايات المتحدة",
      dosageForm: "كبسولات جيلاتينية",
      concentration: "1000mg",
      packaging: "عبوة بلاستيكية × 60 كبسولة"
    }
  },
  {
    id: "p13",
    nameAr: "مركب فيتامين ب",
    nameEn: "Vitamin B Complex",
    category: "فيتامينات ومكملات",
    brand: "EuroPharma",
    price_yer: 3000,
    price_usd: 5.5,
    unit: "علبة (30 قرص)",
    minOrder: 15,
    inStock: true,
    description: "مجموعة فيتامينات ب لدعم صحة الأعصاب والطاقة.",
    registrationNo: "YEM-88990",
    image: "https://picsum.photos/seed/vitb/400/400",
    specs: {
      scientificName: "B-Complex Vitamins",
      manufacturer: "EuroPharma GmbH",
      origin: "ألمانيا",
      dosageForm: "أقراص",
      concentration: "متعدد",
      packaging: "3 شريط × 10 أقراص"
    }
  },

  // أدوية السكري (Diabetes)
  {
    id: "p14",
    nameAr: "ميتفورمين 500 ملغ",
    nameEn: "Metformin 500mg",
    category: "أدوية السكري",
    brand: "YemenPharma",
    price_yer: 2000,
    price_usd: 3.8,
    unit: "علبة (50 قرص)",
    minOrder: 10,
    inStock: true,
    description: "يستخدم للسيطرة على مستويات السكر في الدم لمرضى السكري من النوع الثاني.",
    registrationNo: "YEM-13579",
    image: "https://picsum.photos/seed/metfor/400/400",
    specs: {
      scientificName: "Metformin Hydrochloride",
      manufacturer: "YemenPharma",
      origin: "اليمن",
      dosageForm: "أقراص مغلفة",
      concentration: "500mg",
      packaging: "5 شريط × 10 أقراص"
    }
  },
  {
    id: "p15",
    nameAr: "جليميبيريد 2 ملغ",
    nameEn: "Glimepiride 2mg",
    category: "أدوية السكري",
    brand: "GlobalMed",
    price_yer: 2800,
    price_usd: 5.2,
    unit: "علبة (30 قرص)",
    minOrder: 10,
    inStock: true,
    description: "يحفز البنكرياس لإنتاج المزيد من الأنسولين.",
    registrationNo: "YEM-24680",
    image: "https://picsum.photos/seed/glim/400/400",
    specs: {
      scientificName: "Glimepiride",
      manufacturer: "GlobalMed Pharma",
      origin: "الهند",
      dosageForm: "أقراص",
      concentration: "2mg",
      packaging: "3 شريط × 10 أقراص"
    }
  },
  {
    id: "p16",
    nameAr: "سيتاجليبتين 100 ملغ",
    nameEn: "Sitagliptin 100mg",
    category: "أدوية السكري",
    brand: "EuroPharma",
    price_yer: 8500,
    price_usd: 15.5,
    unit: "علبة (28 قرص)",
    minOrder: 5,
    inStock: false,
    description: "يساعد في تحسين التحكم في نسبة السكر في الدم.",
    registrationNo: "YEM-97531",
    image: "https://picsum.photos/seed/sita/400/400",
    specs: {
      scientificName: "Sitagliptin Phosphate",
      manufacturer: "EuroPharma GmbH",
      origin: "ألمانيا",
      dosageForm: "أقراص مغلفة",
      concentration: "100mg",
      packaging: "2 شريط × 14 قرص"
    }
  },

  // مستلزمات طبية (Medical Supplies)
  {
    id: "p17",
    nameAr: "كمامات طبية 3 طبقات",
    nameEn: "Medical Masks 3-Ply",
    category: "مستلزمات طبية",
    brand: "SafeMed",
    price_yer: 1500,
    price_usd: 2.8,
    unit: "علبة (50 قطعة)",
    minOrder: 50,
    inStock: true,
    description: "كمامات طبية عالية الجودة توفر حماية ممتازة.",
    registrationNo: "N/A",
    image: "https://picsum.photos/seed/mask/400/400",
    specs: {
      scientificName: "N/A",
      manufacturer: "SafeMed Supplies",
      origin: "الصين",
      dosageForm: "N/A",
      concentration: "N/A",
      packaging: "علبة كرتونية"
    }
  },
  {
    id: "p18",
    nameAr: "قفازات فحص لاتكس",
    nameEn: "Latex Examination Gloves",
    category: "مستلزمات طبية",
    brand: "SafeMed",
    price_yer: 3500,
    price_usd: 6.5,
    unit: "علبة (100 قطعة)",
    minOrder: 20,
    inStock: true,
    description: "قفازات لاتكس طبية غير معقمة، خالية من البودرة.",
    registrationNo: "N/A",
    image: "https://picsum.photos/seed/gloves/400/400",
    specs: {
      scientificName: "N/A",
      manufacturer: "SafeMed Supplies",
      origin: "ماليزيا",
      dosageForm: "N/A",
      concentration: "N/A",
      packaging: "علبة كرتونية"
    }
  },
  {
    id: "p19",
    nameAr: "جهاز قياس ضغط الدم",
    nameEn: "Blood Pressure Monitor",
    category: "مستلزمات طبية",
    brand: "HealthTech",
    price_yer: 25000,
    price_usd: 45.0,
    unit: "قطعة واحدة",
    minOrder: 2,
    inStock: true,
    description: "جهاز رقمي دقيق لقياس ضغط الدم من أعلى الذراع.",
    registrationNo: "N/A",
    image: "https://picsum.photos/seed/bp/400/400",
    specs: {
      scientificName: "N/A",
      manufacturer: "HealthTech Devices",
      origin: "اليابان",
      dosageForm: "N/A",
      concentration: "N/A",
      packaging: "علبة تحتوي على الجهاز والكفة والبطاريات"
    }
  },
  {
    id: "p20",
    nameAr: "جهاز قياس السكر في الدم",
    nameEn: "Blood Glucose Meter",
    category: "مستلزمات طبية",
    brand: "HealthTech",
    price_yer: 12000,
    price_usd: 22.0,
    unit: "قطعة واحدة",
    minOrder: 5,
    inStock: true,
    description: "جهاز سريع ودقيق لقياس مستوى الجلوكوز في الدم.",
    registrationNo: "N/A",
    image: "https://picsum.photos/seed/glucose/400/400",
    specs: {
      scientificName: "N/A",
      manufacturer: "HealthTech Devices",
      origin: "كوريا الجنوبية",
      dosageForm: "N/A",
      concentration: "N/A",
      packaging: "علبة تحتوي على الجهاز وقلم الوخز"
    }
  }
];
