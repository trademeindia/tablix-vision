
// Function to ensure the demo user has a profile
export async function ensureUserProfile(supabase: any, userId: string) {
  console.log('Ensuring profile exists for user:', userId);
  
  try {
    // Check if user has a profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, restaurant_id')
      .eq('id', userId)
      .maybeSingle();
    
    // Create profile if it doesn't exist
    if (!profile) {
      await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: 'Demo User',
          role: 'owner',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      console.log('Created profile for demo user');
    }
    
    return profile;
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    throw error;
  }
}

// Function to ensure the demo user has a restaurant
export async function ensureUserRestaurant(supabase: any, userId: string, profile: any, demoEmail: string) {
  console.log('Ensuring restaurant exists for user:', userId);
  
  try {
    let restaurantId = profile?.restaurant_id;
    
    if (!restaurantId) {
      // Create restaurant if it doesn't exist
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .insert({
          name: 'Demo Restaurant',
          description: 'A sample restaurant for demonstration purposes',
          address: '123 Main Street, Anytown, USA',
          phone: '555-123-4567',
          email: demoEmail,
          owner_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();
      
      if (restaurantError) {
        throw new Error(`Failed to create restaurant: ${restaurantError.message}`);
      }
      
      restaurantId = restaurant.id;
      
      // Update profile with restaurant ID
      await supabase
        .from('profiles')
        .update({ restaurant_id: restaurantId })
        .eq('id', userId);
      
      console.log('Created restaurant for demo user:', restaurantId);
    }
    
    return restaurantId;
  } catch (error) {
    console.error('Error ensuring user restaurant:', error);
    throw error;
  }
}

// Add sample items to a category
export async function addSampleItemsForCategory(supabase: any, categoryId: string, categoryName: string) {
  console.log(`Adding sample items to category "${categoryName}"`);
  
  // Sample items based on category
  let items = [];
  
  if (categoryName === 'Appetizers') {
    items = [
      { name: 'Garlic Bread', price: 5.99, description: 'Freshly baked bread with garlic butter' },
      { name: 'Mozzarella Sticks', price: 7.99, description: 'Crispy fried mozzarella with marinara sauce' },
      { name: 'Spring Rolls', price: 6.99, description: 'Vegetable spring rolls with sweet chili sauce' }
    ];
  } else if (categoryName === 'Main Courses') {
    items = [
      { name: 'Margherita Pizza', price: 12.99, description: 'Classic pizza with tomato, mozzarella, and basil' },
      { name: 'Grilled Salmon', price: 18.99, description: 'Fresh salmon with lemon butter sauce' },
      { name: 'Spaghetti Carbonara', price: 14.99, description: 'Creamy pasta with bacon and parmesan' }
    ];
  } else if (categoryName === 'Desserts') {
    items = [
      { name: 'Chocolate Cake', price: 6.99, description: 'Rich chocolate cake with icing' },
      { name: 'Cheesecake', price: 7.99, description: 'New York style cheesecake with berry compote' },
      { name: 'Ice Cream Sundae', price: 5.99, description: 'Vanilla ice cream with chocolate sauce' }
    ];
  } else if (categoryName === 'Beverages') {
    items = [
      { name: 'Iced Tea', price: 2.99, description: 'Freshly brewed tea with lemon' },
      { name: 'Mango Smoothie', price: 4.99, description: 'Fresh mango blended with yogurt' },
      { name: 'Coffee', price: 3.99, description: 'Premium blend coffee' }
    ];
  }
  
  // Insert sample items
  for (const item of items) {
    await supabase
      .from('menu_items')
      .insert({
        category_id: categoryId,
        name: item.name,
        description: item.description,
        price: item.price,
        vegetarian: Math.random() > 0.5,
        vegan: Math.random() > 0.7,
        gluten_free: Math.random() > 0.6,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
  }
  
  console.log(`Added ${items.length} sample items to category "${categoryName}"`);
}

// Ensure sample menu data exists
export async function ensureSampleMenuData(supabase: any, restaurantId: string) {
  console.log('Ensuring sample menu data for restaurant:', restaurantId);
  
  try {
    // Check if menu categories exist
    const { data: categories } = await supabase
      .from('menu_categories')
      .select('id')
      .eq('restaurant_id', restaurantId);
    
    // If no categories exist, create sample categories and items
    if (!categories || categories.length === 0) {
      // Sample categories
      const sampleCategories = [
        { name: 'Appetizers', icon: '🍤' },
        { name: 'Main Courses', icon: '🍱' },
        { name: 'Desserts', icon: '🍰' },
        { name: 'Beverages', icon: '🥤' }
      ];
      
      for (const category of sampleCategories) {
        const { data: newCategory } = await supabase
          .from('menu_categories')
          .insert({
            restaurant_id: restaurantId,
            name: category.name,
            icon: category.icon,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('id')
          .single();
        
        if (newCategory) {
          // Add sample items to each category
          await addSampleItemsForCategory(supabase, newCategory.id, category.name);
        }
      }
      
      console.log('Created sample menu categories and items');
    }
  } catch (error) {
    console.error('Error ensuring sample menu data:', error);
    throw error;
  }
}

// Main function to ensure demo data is set up
export async function ensureDemoData(supabase: any, demoEmail: string) {
  console.log('Setting up demo data for user:', demoEmail);
  
  try {
    // Get demo user ID
    const { data: userData } = await supabase
      .auth.admin.listUsers({ 
        filters: { email: demoEmail }
      });
    
    if (!userData || !userData.users || userData.users.length === 0) {
      console.log('Could not find demo user in auth.users');
      return;
    }
    
    const userId = userData.users[0].id;
    console.log('Found demo user ID:', userId);
    
    // Ensure user has a profile
    const profile = await ensureUserProfile(supabase, userId);
    
    // Ensure user has a restaurant
    const restaurantId = await ensureUserRestaurant(supabase, userId, profile, demoEmail);
    
    // Ensure restaurant has sample menu data
    await ensureSampleMenuData(supabase, restaurantId);
    
    console.log('Demo data setup complete');
    return true;
  } catch (error) {
    console.error('Error setting up demo data:', error);
    throw error;
  }
}
