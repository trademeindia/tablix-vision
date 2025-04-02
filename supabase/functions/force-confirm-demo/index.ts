
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../upload-model/cors.ts'

// Force-confirm demo account email and ensure demo data is set up
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key which has admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Demo account email
    const demoEmail = 'demo@restaurant.com'
    
    // Find demo user by email
    const { data: users, error: userError } = await supabaseAdmin
      .from('auth.users')
      .select('id, email, email_confirmed_at, is_confirmed')
      .eq('email', demoEmail)
      .maybeSingle()
    
    if (userError) {
      console.error('Error finding demo user:', userError)
      throw new Error('Failed to find demo user')
    }
    
    if (!users) {
      console.error('Demo user not found')
      
      // If demo user doesn't exist, we should create it
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: demoEmail,
        password: 'demo123456',
        email_confirm: true,
        user_metadata: { full_name: 'Demo User' }
      })
      
      if (createError) {
        throw new Error(`Failed to create demo user: ${createError.message}`)
      }
      
      console.log('Created new demo user:', newUser)
    } else {
      console.log('Found demo user:', users)
      
      // Force confirm email if not already confirmed
      const now = new Date().toISOString()
      
      // Update directly in auth.users table
      const { error: updateError } = await supabaseAdmin
        .from('auth.users')
        .update({
          email_confirmed_at: now,
          confirmed_at: now,
          is_confirmed: true,
          last_sign_in_at: now,
          raw_user_meta_data: { full_name: 'Demo User' },
          raw_app_meta_data: { provider: 'email', providers: ['email'] }
        })
        .eq('email', demoEmail)
      
      if (updateError) {
        console.error('Error confirming demo user:', updateError)
        throw new Error('Failed to confirm demo user email')
      }
      
      console.log('Successfully confirmed demo user email and updated metadata')
    }
    
    // Ensure demo account has a restaurant and data
    await ensureDemoData(supabaseAdmin, demoEmail)
    
    return new Response(
      JSON.stringify({ 
        data: { success: true, message: 'Demo account email confirmed and data prepared' },
        error: null
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in force-confirm-demo:', error)
    
    return new Response(
      JSON.stringify({ 
        data: null, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

// Helper function to ensure demo account has sample data
async function ensureDemoData(supabase, demoEmail) {
  try {
    // Get demo user ID
    const { data: userData } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', demoEmail)
      .single()
    
    if (!userData) {
      throw new Error('Could not find demo user ID')
    }
    
    const userId = userData.id
    
    // Check if user has a profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, restaurant_id')
      .eq('id', userId)
      .maybeSingle()
    
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
        })
      
      console.log('Created profile for demo user')
    }
    
    // Check if user has a restaurant
    let restaurantId
    
    if (profile?.restaurant_id) {
      restaurantId = profile.restaurant_id
    } else {
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
        .single()
      
      if (restaurantError) {
        throw new Error(`Failed to create restaurant: ${restaurantError.message}`)
      }
      
      restaurantId = restaurant.id
      
      // Update profile with restaurant ID
      await supabase
        .from('profiles')
        .update({ restaurant_id: restaurantId })
        .eq('id', userId)
      
      console.log('Created restaurant for demo user:', restaurantId)
    }
    
    // Ensure restaurant has some sample data (menu categories, items, etc)
    // This is optional but helps provide a better demo experience
    await ensureSampleMenuData(supabase, restaurantId)
    
    console.log('Demo data setup complete')
  } catch (error) {
    console.error('Error setting up demo data:', error)
    throw error
  }
}

// Helper function to ensure sample menu data exists
async function ensureSampleMenuData(supabase, restaurantId) {
  // Check if menu categories exist
  const { data: categories } = await supabase
    .from('menu_categories')
    .select('id')
    .eq('restaurant_id', restaurantId)
  
  // If no categories exist, create sample categories and items
  if (!categories || categories.length === 0) {
    // Sample categories
    const sampleCategories = [
      { name: 'Appetizers', icon: '🍤' },
      { name: 'Main Courses', icon: '🍱' },
      { name: 'Desserts', icon: '🍰' },
      { name: 'Beverages', icon: '🥤' }
    ]
    
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
        .single()
      
      if (newCategory) {
        // Add sample items to each category
        await addSampleItemsForCategory(supabase, newCategory.id, category.name)
      }
    }
    
    console.log('Created sample menu categories and items')
  }
}

// Helper function to add sample items to a category
async function addSampleItemsForCategory(supabase, categoryId, categoryName) {
  // Sample items based on category
  let items = []
  
  if (categoryName === 'Appetizers') {
    items = [
      { name: 'Garlic Bread', price: 5.99, description: 'Freshly baked bread with garlic butter' },
      { name: 'Mozzarella Sticks', price: 7.99, description: 'Crispy fried mozzarella with marinara sauce' },
      { name: 'Spring Rolls', price: 6.99, description: 'Vegetable spring rolls with sweet chili sauce' }
    ]
  } else if (categoryName === 'Main Courses') {
    items = [
      { name: 'Margherita Pizza', price: 12.99, description: 'Classic pizza with tomato, mozzarella, and basil' },
      { name: 'Grilled Salmon', price: 18.99, description: 'Fresh salmon with lemon butter sauce' },
      { name: 'Spaghetti Carbonara', price: 14.99, description: 'Creamy pasta with bacon and parmesan' }
    ]
  } else if (categoryName === 'Desserts') {
    items = [
      { name: 'Chocolate Cake', price: 6.99, description: 'Rich chocolate cake with icing' },
      { name: 'Cheesecake', price: 7.99, description: 'New York style cheesecake with berry compote' },
      { name: 'Ice Cream Sundae', price: 5.99, description: 'Vanilla ice cream with chocolate sauce' }
    ]
  } else if (categoryName === 'Beverages') {
    items = [
      { name: 'Iced Tea', price: 2.99, description: 'Freshly brewed tea with lemon' },
      { name: 'Mango Smoothie', price: 4.99, description: 'Fresh mango blended with yogurt' },
      { name: 'Coffee', price: 3.99, description: 'Premium blend coffee' }
    ]
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
      })
  }
}
