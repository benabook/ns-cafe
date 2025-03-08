import { MenuItem } from '@/types';

// Images will be placeholders until real images are added
export const menuItems: MenuItem[] = [
  // Salads & Bowls
  {
    id: 'steak-salad-bowl',
    name: 'Steak Salad Bowl',
    price: 42,
    category: 'salads-bowls',
    ingredients: ['Ribeye', 'mixed greens', 'caramelized onions', 'cherry tomatoes', 'parmesan cheese', 'balsamic dressing'],
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1'
  },
  {
    id: 'caesar-salad',
    name: 'Caesar Salad',
    price: 26,
    category: 'salads-bowls',
    ingredients: ['Grilled chicken breast', 'parmesan cheese', 'garlic aioli', 'garlic croutons', 'hard-boiled egg'],
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9'
  },
  {
    id: 'prawn-mustard-salad',
    name: 'Prawn & Mustard Salad Bowl',
    price: 28,
    category: 'salads-bowls',
    ingredients: ['Prawn', 'mixed greens', 'avocado', 'cherry tomatoes', 'cucumber', 'whole grain mustard dressing'],
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74'
  },
  {
    id: 'buddha-bowl',
    name: 'Buddha Bowl (V)',
    price: 26,
    category: 'salads-bowls',
    ingredients: ['Bean salsa', 'sweet potato', 'cherry tomatoes', 'broccoli', 'edamame', 'corn', 'guacamole', 'sunflower seeds', 'pumpkin seeds', 'lime wedge'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd'
  },
  {
    id: 'mexican-burrito-bowl',
    name: 'Mexican Burrito Bowl',
    price: 28,
    category: 'salads-bowls',
    ingredients: ['Grilled chicken breast', 'cherry tomatoes', 'corn', 'bean salsa', 'guacamole', 'jalapeño', 'lime wedge'],
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6'
  },
  
  // Mains & Sandwiches
  {
    id: 'quesadilla',
    name: 'Quesadilla with Mixed Greens',
    price: 28,
    category: 'mains-sandwiches',
    ingredients: ['Tortilla wrap', 'mixed greens', 'cherry tomatoes', 'mozzarella cheese'],
    image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f',
    options: [
      { id: 'quesadilla-regular', name: 'Regular', price: 0 },
      { id: 'quesadilla-minced-beef', name: 'Minced Beef', price: 0 },
      { id: 'quesadilla-smoked-salmon', name: 'Smoked Salmon', price: 12 }
    ]
  },
  {
    id: 'steak-greens-plate',
    name: 'Steak & Greens Plate',
    price: 42,
    category: 'mains-sandwiches',
    ingredients: ['Ribeye', 'egg', 'cherry tomatoes', 'mixed greens', 'fresh avocado'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947'
  },
  {
    id: 'spinach-omelette',
    name: 'Spinach Omelette with Mixed Salad',
    price: 32,
    category: 'mains-sandwiches',
    ingredients: ['Spinach', 'egg', 'mozzarella cheese', 'cherry tomatoes', 'mixed greens', 'balsamic glaze'],
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71',
    options: [
      { id: 'omelette-plain', name: 'Plain', price: 0 },
      { id: 'omelette-mushroom', name: 'Mushroom', price: 0 },
      { id: 'omelette-chicken', name: 'Chicken Breast', price: 0 }
    ]
  },
  {
    id: 'avocado-toast',
    name: 'Avocado Toast with Egg (V)',
    price: 28,
    category: 'mains-sandwiches',
    ingredients: ['Sourdough from a local artisan bakery', 'eggs', 'avocado', 'cherry tomatoes'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8'
  },
  {
    id: 'steak-sandwich',
    name: 'Steak Sandwich',
    price: 38,
    category: 'mains-sandwiches',
    ingredients: ['Sourdough from a local artisan bakery', 'ribeye', 'guacamole', 'caramelized onions', 'herb aioli'],
    image: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184'
  },
  
  // Add Ons
  {
    id: 'add-avocado',
    name: 'Avocado',
    price: 10,
    category: 'add-ons',
    ingredients: [],
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578'
  },
  {
    id: 'add-hard-boiled-egg',
    name: 'Hard-Boiled Egg',
    price: 5,
    category: 'add-ons',
    ingredients: [],
    image: 'https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3'
  },
  {
    id: 'add-smoked-salmon',
    name: 'Smoked Salmon',
    price: 16,
    category: 'add-ons',
    ingredients: [],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2'
  },
  {
    id: 'add-sourdough',
    name: 'Sourdough',
    price: 8,
    category: 'add-ons',
    ingredients: [],
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c'
  },
  {
    id: 'add-sunny-side-up',
    name: 'Sunny-Side Up Egg',
    price: 5,
    category: 'add-ons',
    ingredients: [],
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71'
  },
  
  // Espresso-Based Drinks
  {
    id: 'espresso',
    name: 'Espresso',
    price: 10,
    usdPrice: 2.3,
    category: 'espresso-drinks',
    ingredients: ['Freshly ground coffee beans'],
    image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f',
    options: [
      { id: 'iced-espresso', name: 'Iced / Cold', price: 1 },
      { id: 'extra-shot-espresso', name: 'Extra Shot', price: 4 },
      { id: 'almond-milk-espresso', name: 'Almond Milk', price: 3 },
      { id: 'oat-milk-espresso', name: 'Oat Milk', price: 3 }
    ]
  },
  {
    id: 'americano',
    name: 'Americano',
    price: 10,
    usdPrice: 2.3,
    category: 'espresso-drinks',
    ingredients: ['Espresso', 'hot water'],
    image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c',
    options: [
      { id: 'iced-americano', name: 'Iced / Cold', price: 1 },
      { id: 'extra-shot-americano', name: 'Extra Shot', price: 4 },
      { id: 'almond-milk-americano', name: 'Almond Milk', price: 3 },
      { id: 'oat-milk-americano', name: 'Oat Milk', price: 3 }
    ]
  },
  {
    id: 'latte',
    name: 'Latte',
    price: 14,
    usdPrice: 3.2,
    category: 'espresso-drinks',
    ingredients: ['Espresso', 'steamed milk', 'thin layer of foam'],
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772',
    options: [
      { id: 'iced-latte', name: 'Iced / Cold', price: 1 },
      { id: 'extra-shot-latte', name: 'Extra Shot', price: 4 },
      { id: 'almond-milk-latte', name: 'Almond Milk', price: 3 },
      { id: 'oat-milk-latte', name: 'Oat Milk', price: 3 }
    ]
  },
  {
    id: 'mocha',
    name: 'Mocha',
    price: 16,
    usdPrice: 3.6,
    category: 'espresso-drinks',
    ingredients: ['Espresso', 'steamed milk', 'chocolate'],
    image: 'https://images.unsplash.com/photo-1510215047363-ac7d704c4e7b',
    options: [
      { id: 'iced-mocha', name: 'Iced / Cold', price: 1 },
      { id: 'extra-shot-mocha', name: 'Extra Shot', price: 4 },
      { id: 'almond-milk-mocha', name: 'Almond Milk', price: 3 },
      { id: 'oat-milk-mocha', name: 'Oat Milk', price: 3 }
    ]
  },
  
  // Non-Coffee Blends
  {
    id: 'matcha',
    name: 'Matcha',
    price: 14,
    usdPrice: 3.2,
    category: 'non-coffee',
    ingredients: ['Premium matcha powder', 'milk'],
    image: 'https://images.unsplash.com/photo-1536257104079-aa99c6460a5a',
    options: [
      { id: 'iced-matcha', name: 'Iced / Cold', price: 1 },
      { id: 'almond-milk-matcha', name: 'Almond Milk', price: 3 },
      { id: 'oat-milk-matcha', name: 'Oat Milk', price: 3 }
    ]
  },
  {
    id: 'chocolate',
    name: 'Chocolate',
    price: 12,
    usdPrice: 2.7,
    category: 'non-coffee',
    ingredients: ['Premium cocoa powder', 'milk'],
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed',
    options: [
      { id: 'iced-chocolate', name: 'Iced / Cold', price: 1 },
      { id: 'almond-milk-chocolate', name: 'Almond Milk', price: 3 },
      { id: 'oat-milk-chocolate', name: 'Oat Milk', price: 3 }
    ]
  },
  {
    id: 'fresh-milk',
    name: 'Fresh Milk',
    price: 8,
    usdPrice: 1.8,
    category: 'non-coffee',
    ingredients: ['Fresh milk'],
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150',
    options: [
      { id: 'iced-fresh-milk', name: 'Iced / Cold', price: 1 }
    ]
  },
  {
    id: 'almond-milk',
    name: 'Almond Milk',
    price: 11,
    usdPrice: 2.5,
    category: 'non-coffee',
    ingredients: ['Almond milk'],
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721',
    options: [
      { id: 'iced-almond-milk', name: 'Iced / Cold', price: 1 }
    ]
  },
  {
    id: 'oat-milk',
    name: 'Oat Milk',
    price: 11,
    usdPrice: 2.5,
    category: 'non-coffee',
    ingredients: ['Oat milk'],
    image: 'https://images.unsplash.com/photo-1576186726158-458e97861c6a',
    options: [
      { id: 'iced-oat-milk', name: 'Iced / Cold', price: 1 }
    ]
  },
  
  // Smoothies
  {
    id: 'green-power-smoothie',
    name: 'Green Power Smoothie',
    price: 22,
    usdPrice: 5.0,
    category: 'smoothies',
    ingredients: ['Chopped spinach', 'avocado', 'banana', 'almond milk (unsweetened)', 'whey protein'],
    image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec'
  },
  {
    id: 'peanut-butter-banana-smoothie',
    name: 'Peanut Butter Banana Smoothie',
    price: 22,
    usdPrice: 5.0,
    category: 'smoothies',
    ingredients: ['Peanut butter', 'banana', 'almond milk (unsweetened)', 'whey protein'],
    image: 'https://images.unsplash.com/photo-1588929473475-beb2c59c8f92'
  },
  {
    id: 'mixed-berries-smoothie',
    name: 'Mixed Berries Smoothie',
    price: 22,
    usdPrice: 5.0,
    category: 'smoothies',
    ingredients: ['Blueberries', 'strawberries', 'almond milk (unsweetened)', 'whey protein'],
    image: 'https://images.unsplash.com/photo-1553530666-ba11a90fe8b7'
  },
  
  // Cold-Pressed Juices
  {
    id: 'vital-glow-juice',
    name: 'Vital Glow Juice',
    price: 14,
    usdPrice: 3.2,
    category: 'cold-pressed',
    ingredients: ['Beetroot', 'carrot', 'green apple'],
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423'
  },
  {
    id: 'green-detox-juice',
    name: 'Green Detox Juice',
    price: 14,
    usdPrice: 3.2,
    category: 'cold-pressed',
    ingredients: ['Celery', 'cucumber', 'ginger', 'green apple', 'spinach'],
    image: 'https://images.unsplash.com/photo-1622597459447-7c95b700e554'
  },
  {
    id: 'immune-booster-juice',
    name: 'Immune Booster Juice',
    price: 14,
    usdPrice: 3.2,
    category: 'cold-pressed',
    ingredients: ['Carrot', 'ginger', 'orange'],
    image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd'
  }
];

export const getMenuItemById = (id: string): MenuItem | undefined => {
  return menuItems.find(item => item.id === id);
};

export const getMenuItemsByCategory = (category: MenuItem['category']): MenuItem[] => {
  return menuItems.filter(item => item.category === category);
};
