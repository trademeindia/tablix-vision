
interface DemoMenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

interface DemoOrderItem {
  id: string;
  menuItem: DemoMenuItem;
  quantity: number;
  notes?: string;
}

export interface DemoOrder {
  id: string;
  tableNumber: string;
  customerName: string;
  items: DemoOrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed';
  createdAt: string;
  paymentStatus: 'pending' | 'paid';
}

// Enhanced menu items with images
const menuItems: DemoMenuItem[] = [
  { 
    id: 'item-1', 
    name: 'Classic Burger', 
    price: 12.99, 
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format'
  },
  { 
    id: 'item-2', 
    name: 'Margherita Pizza', 
    price: 14.99, 
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format'
  },
  { 
    id: 'item-3', 
    name: 'Caesar Salad', 
    price: 9.99, 
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&auto=format'
  },
  { 
    id: 'item-4', 
    name: 'Garlic Bread', 
    price: 5.99, 
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=600&auto=format'
  },
  { 
    id: 'item-5', 
    name: 'Grilled Salmon', 
    price: 18.99, 
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format'
  },
  { 
    id: 'item-6', 
    name: 'Spaghetti Carbonara', 
    price: 13.99, 
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1608756687911-aa1599ab3bd9?w=600&auto=format'
  },
  { 
    id: 'item-7', 
    name: 'Tiramisu', 
    price: 7.99, 
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format'
  },
  { 
    id: 'item-8', 
    name: 'Cheesecake', 
    price: 6.99, 
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format'
  },
  { 
    id: 'item-9', 
    name: 'Cappuccino', 
    price: 3.99, 
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format'
  },
  { 
    id: 'item-10', 
    name: 'Fresh Orange Juice', 
    price: 4.99, 
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format'
  },
  { 
    id: 'item-11', 
    name: 'Chicken Wings', 
    price: 10.99, 
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format'
  },
  { 
    id: 'item-12', 
    name: 'Chocolate Brownie', 
    price: 6.99, 
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format'
  },
];

// More realistic customer names
const customerNames = [
  'Smith Family', 'John & Lisa', 'Martinez Party', 'Thompson Group',
  'Brown & Co.', 'Sarah Williams', 'The Jacksons', 'Chen Family', 
  'Rodriguez Party', 'Birthday Group', 'Anniversary Dinner', 'Business Meeting',
  'Patel Family', 'Kim & Friends', 'Taylor Wedding', 'Johnson Reunion'
];

// Generate a random time in the past few hours
const getRandomRecentTime = (hoursAgo = 4) => {
  const date = new Date();
  date.setHours(date.getHours() - Math.random() * hoursAgo);
  return date.toISOString();
};

// Generate random order items
const generateOrderItems = (count: number): DemoOrderItem[] => {
  // Ensure we have a good variety of items by selecting from different parts of the array
  const selectedItems = new Set<number>();
  while (selectedItems.size < Math.min(count, menuItems.length)) {
    selectedItems.add(Math.floor(Math.random() * menuItems.length));
  }
  
  return Array.from(selectedItems).map((itemIndex, index) => {
    const randomMenuItem = menuItems[itemIndex];
    return {
      id: `order-item-${index}`,
      menuItem: randomMenuItem,
      quantity: 1 + Math.floor(Math.random() * 3),
      notes: Math.random() > 0.7 ? 'Extra sauce please' : undefined
    };
  });
};

// Calculate order total
const calculateOrderTotal = (items: DemoOrderItem[]): number => {
  return items.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
};

// Generate active orders
export const generateActiveOrders = (count = 8): DemoOrder[] => {
  return Array.from({ length: count }).map((_, index) => {
    const items = generateOrderItems(1 + Math.floor(Math.random() * 5));
    const total = calculateOrderTotal(items);
    
    // Determine order status based on creation time
    let status: DemoOrder['status'];
    const randomValue = Math.random();
    if (randomValue < 0.3) status = 'pending';
    else if (randomValue < 0.6) status = 'preparing';
    else if (randomValue < 0.9) status = 'ready';
    else status = 'served';
    
    return {
      id: `order-${1000 + index}`,
      tableNumber: `Table ${1 + Math.floor(Math.random() * 15)}`,
      customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
      items,
      total,
      status,
      createdAt: getRandomRecentTime(2), // Within last 2 hours
      paymentStatus: 'pending'
    };
  });
};

// Generate completed orders
export const generateCompletedOrders = (count = 12): DemoOrder[] => {
  return Array.from({ length: count }).map((_, index) => {
    const items = generateOrderItems(1 + Math.floor(Math.random() * 6));
    const total = calculateOrderTotal(items);
    
    return {
      id: `order-past-${1000 + index}`,
      tableNumber: `Table ${1 + Math.floor(Math.random() * 15)}`,
      customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
      items,
      total,
      status: 'completed',
      createdAt: getRandomRecentTime(24), // Within last 24 hours
      paymentStatus: 'paid'
    };
  });
};

export const getDemoMenuItems = (): DemoMenuItem[] => {
  return menuItems;
};
