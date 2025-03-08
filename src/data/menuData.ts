
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
  }
];

export const getMenuItemById = (id: string): MenuItem | undefined => {
  return menuItems.find(item => item.id === id);
};

export const getMenuItemsByCategory = (category: MenuItem['category']): MenuItem[] => {
  return menuItems.filter(item => item.category === category);
};
