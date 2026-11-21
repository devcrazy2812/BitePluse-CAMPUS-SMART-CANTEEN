export const initialMenu = [
  {
    id: 1,
    name: 'Campus Masala Bowl',
    category: 'MEALS',
    price: 85,
    description: 'Steamed basmati, slow-simmered dal makhani, roasted spiced veggies and fresh mint chutney.',
    emoji: '🍛',
    dietaryTag: 'VEG',
    prepTimeMinutes: 12,
    available: true
  },
  {
    id: 2,
    name: 'Paneer Kathi Roll',
    category: 'SNACKS',
    price: 70,
    description: 'Char-grilled cottage cheese cubes, crisp bell peppers, and tangy mint mayo rolled in a flaky paratha.',
    emoji: '🌯',
    dietaryTag: 'VEG',
    prepTimeMinutes: 8,
    available: true
  },
  {
    id: 3,
    name: 'Artisan Cold Brew Coffee',
    category: 'BEVERAGES',
    price: 55,
    description: '14-hour slow steeped Arabica coffee poured over ice with velvety milk and dark chocolate shavings.',
    emoji: '🧋',
    dietaryTag: 'VEG',
    prepTimeMinutes: 3,
    available: true
  },
  {
    id: 4,
    name: 'Alphonso Mango Cheesecake',
    category: 'DESSERTS',
    price: 95,
    description: 'Creamy Philadelphia cheese mousse with real Ratnagiri mango compote on a buttery graham crust.',
    emoji: '🍰',
    dietaryTag: 'VEG',
    prepTimeMinutes: 2,
    available: true
  },
  {
    id: 5,
    name: 'Chilli Garlic Hakka Noodles',
    category: 'MEALS',
    price: 90,
    description: 'Wok-tossed noodles with crunchy scallions, bell peppers, garlic crisps, and toasted sesame oil.',
    emoji: '🍜',
    dietaryTag: 'VEGAN',
    prepTimeMinutes: 10,
    available: true
  },
  {
    id: 6,
    name: 'Spiced Lemon Mint Spritzer',
    category: 'BEVERAGES',
    price: 35,
    description: 'Chilled sparkling soda with freshly squeezed lime, crushed mint leaves, and roasted black cumin salt.',
    emoji: '🍋',
    dietaryTag: 'VEGAN',
    prepTimeMinutes: 3,
    available: true
  },
  {
    id: 7,
    name: 'Crispy Peri-Peri Fries Basket',
    category: 'SNACKS',
    price: 65,
    description: 'Hand-cut golden potato fries tossed in fiery African peri-peri dust, served with garlic herb aioli.',
    emoji: '🍟',
    dietaryTag: 'VEG',
    prepTimeMinutes: 6,
    available: true
  },
  {
    id: 8,
    name: 'Classic Grilled Cheese Melt',
    category: 'SNACKS',
    price: 75,
    description: 'Triple cheddar and mozzarella blend melted between golden-buttered toasted sourdough slices.',
    emoji: '🥪',
    dietaryTag: 'VEG',
    prepTimeMinutes: 7,
    available: true
  },
  {
    id: 9,
    name: 'Warm Double Fudge Brownie',
    category: 'DESSERTS',
    price: 80,
    description: 'Dense dark chocolate brownie with melting fudge center, topped with toasted walnuts.',
    emoji: '🍫',
    dietaryTag: 'VEG',
    prepTimeMinutes: 4,
    available: true
  }
];

export const initialOrders = [
  {
    id: 1041,
    orderNumber: 'BP-1041',
    pickupSlot: '12:30 PM',
    status: 'ON_STOVE',
    total: 155,
    itemSummary: 'Campus Masala Bowl x1, Artisan Cold Brew Coffee x1',
    customerEmail: 'student@campus.test',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString()
  },
  {
    id: 1042,
    orderNumber: 'BP-1042',
    pickupSlot: '1:00 PM',
    status: 'NEW',
    total: 135,
    itemSummary: 'Paneer Kathi Roll x1, Crispy Peri-Peri Fries Basket x1',
    customerEmail: 'student@campus.test',
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString()
  },
  {
    id: 1043,
    orderNumber: 'BP-1043',
    pickupSlot: '1:15 PM',
    status: 'READY',
    total: 175,
    itemSummary: 'Chilli Garlic Hakka Noodles x1, Warm Double Fudge Brownie x1',
    customerEmail: 'student@campus.test',
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString()
  }
];

export const initialAnalytics = {
  ordersToday: 84,
  totalRevenue: 8420,
  avgPrepTimeMinutes: 12,
  peakHours: [
    { hour: '10 AM', orders: 8 },
    { hour: '11 AM', orders: 19 },
    { hour: '12 PM', orders: 38 },
    { hour: '1 PM', orders: 45 },
    { hour: '2 PM', orders: 22 },
    { hour: '3 PM', orders: 14 },
    { hour: '4 PM', orders: 27 },
    { hour: '5 PM', orders: 31 }
  ],
  statuses: [
    { name: 'Ready', status: 'READY', value: 42 },
    { name: 'Cooking', status: 'ON_STOVE', value: 28 },
    { name: 'New Orders', status: 'NEW', value: 30 }
  ]
};
