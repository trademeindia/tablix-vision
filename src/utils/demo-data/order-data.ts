
interface DemoMenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
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

// Sample menu items
const menuItems: DemoMenuItem[] = [
  { id: 'item-1', name: 'Classic Burger', price: 12.99, category: 'Main Courses' },
  { id: 'item-2', name: 'Margherita Pizza', price: 14.99, category: 'Main Courses' },
  { id: 'item-3', name: 'Caesar Salad', price: 9.99, category: 'Starters' },
  { id: 'item-4', name: 'Garlic Bread', price: 5.99, category: 'Starters' },
  { id: 'item-5', name: 'Grilled Salmon', price: 18.99, category: 'Main Courses' },
  { id: 'item-6', name: 'Spaghetti Carbonara', price: 13.99, category: 'Main Courses' },
  { id: 'item-7', name: 'Tiramisu', price: 7.99, category: 'Desserts' },
  { id: 'item-8', name: 'Cheesecake', price: 6.99, category: 'Desserts' },
  { id: 'item-9', name: 'Cappuccino', price: 3.99, category: 'Drinks' },
  { id: 'item-10', name: 'Fresh Orange Juice', price: 4.99, category: 'Drinks' },
  { id: 'item-11', name: 'Chicken Wings', price: 10.99, category: 'Starters' },
  { id: 'item-12', name: 'Chocolate Brownie', price: 6.99, category: 'Desserts' },
];

// Customer names
const customerNames = [
  'Smith Family', 'John & Lisa', 'Martinez Party', 'Thompson Group',
  'Brown & Co.', 'Sarah Williams', 'The Jacksons', 'Chen Family', 
  'Rodriguez Party', 'Birthday Group', 'Anniversary Dinner', 'Business Meeting'
];

// Generate a random time in the past few hours
const getRandomRecentTime = (hoursAgo = 4) => {
  const date = new Date();
  date.setHours(date.getHours() - Math.random() * hoursAgo);
  return date.toISOString();
};

// Generate random order items
const generateOrderItems = (count: number): DemoOrderItem[] => {
  return Array.from({ length: count }).map((_, index) => {
    const randomMenuItem = menuItems[Math.floor(Math.random() * menuItems.length)];
    return {
      id: `order-item-${index}`,
      menuItem: randomMenuItem,
      quantity: 1 + Math.floor(Math.random() * 3),
      notes: Math.random() > 0.8 ? 'Extra sauce please' : undefined
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
