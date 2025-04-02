
export interface DemoTable {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  occupiedSince?: string;
  orderId?: string;
  reservationInfo?: {
    customerName: string;
    contactNumber: string;
    date: string;
    time: string;
    guestCount: number;
    specialInstructions?: string;
  };
  nextReservation?: {
    time: string;
    customerName: string;
  };
  section?: string;
}

// Generate a formatted time string relative to now
const getRelativeTimeString = (minutesAgo: number): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Generate demo table data
export const generateDemoTables = (count = 15): DemoTable[] => {
  const sections = ['Main Dining', 'Patio', 'Bar', 'Private Room'];
  const customerNames = [
    'Smith Family', 'John & Lisa', 'Martinez Party', 'Thompson Group',
    'Brown & Co.', 'Sarah Williams', 'The Jacksons', 'Chen Family', 
    'Rodriguez Party', 'Birthday Group', 'Anniversary Dinner', 'Business Meeting'
  ];
  
  return Array.from({ length: count }).map((_, index) => {
    const number = index + 1;
    const seats = 2 + (index % 8); // Tables with 2-10 seats
    
    // Assign status based on patterns
    let status: 'available' | 'occupied' | 'reserved';
    if (index % 5 === 0) status = 'reserved';
    else if (index % 3 === 0) status = 'occupied';
    else status = 'available';
    
    // Section assignment
    const section = sections[Math.floor(index / 4) % sections.length];
    
    // Create basic table
    const table: DemoTable = {
      id: `table-${number}`,
      number,
      seats,
      status,
      section
    };
    
    // Add status-specific data
    if (status === 'occupied') {
      // Time occupied between 5 and 120 minutes ago
      const minutesAgo = 5 + Math.floor(Math.random() * 115);
      table.occupiedSince = getRelativeTimeString(minutesAgo);
      table.orderId = `ORD-${1000 + Math.floor(Math.random() * 9000)}`;
    }
    
    if (status === 'reserved') {
      const today = new Date();
      const reservationDate = new Date();
      
      // Some reservations for today, some for future days
      if (Math.random() > 0.5) {
        reservationDate.setDate(today.getDate() + Math.floor(Math.random() * 7));
      }
      
      // Reservation time between 5pm and 9pm
      const hour = 17 + Math.floor(Math.random() * 4);
      const minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      
      table.reservationInfo = {
        customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
        contactNumber: `(${100 + Math.floor(Math.random() * 900)}) ${100 + Math.floor(Math.random() * 900)}-${1000 + Math.floor(Math.random() * 9000)}`,
        date: reservationDate.toISOString().split('T')[0],
        time: `${hour}:${minute.toString().padStart(2, '0')}`,
        guestCount: Math.min(1 + Math.floor(Math.random() * seats), seats),
        specialInstructions: Math.random() > 0.7 ? 'Window seat preferred' : undefined
      };
    }
    
    // Add upcoming reservations to some tables
    if (Math.random() > 0.7 && status !== 'reserved') {
      const hour = 17 + Math.floor(Math.random() * 4);
      const minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      
      table.nextReservation = {
        time: `${hour}:${minute.toString().padStart(2, '0')}`,
        customerName: customerNames[Math.floor(Math.random() * customerNames.length)]
      };
    }
    
    return table;
  });
};
