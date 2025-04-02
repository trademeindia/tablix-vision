
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
    console.log('force-confirm-demo function called')
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
    
    // Try to directly sign in the demo user if they exist
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.admin.signInWithEmail(
      demoEmail,
      'demo123456'
    )

    if (signInError) {
      console.log('Could not directly sign in demo user:', signInError.message)
      // Demo user might not exist, create it
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: demoEmail,
        password: 'demo123456',
        email_confirm: true,
        user_metadata: { full_name: 'Demo User' }
      })
      
      if (createError) {
        console.error('Failed to create demo user:', createError.message)
        throw new Error(`Failed to create demo user: ${createError.message}`)
      }
      
      console.log('Created new demo user:', newUser)
    } else {
      console.log('Successfully signed in demo user')
    }
    
    // Force confirm email regardless of sign-in outcome
    const now = new Date().toISOString()
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      signInData?.user?.id || '', 
      { 
        email_confirm: true,
        user_metadata: { full_name: 'Demo User' }
      }
    )
    
    if (updateError) {
      console.error('Error updating demo user via admin API:', updateError)
      
      // Fallback: try direct database update if admin API fails
      try {
        const { error: directUpdateError } = await supabaseAdmin
          .rpc('force_confirm_user', { user_email: demoEmail })
        
        if (directUpdateError) {
          console.error('Error with direct update too:', directUpdateError)
          throw new Error('Failed to confirm demo user via all methods')
        }
        
        console.log('Successfully confirmed demo user via RPC')
      } catch (rpcError) {
        console.error('RPC call failed:', rpcError)
        // Last resort: try direct table update
        try {
          const { data: userData } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', demoEmail)
            .maybeSingle()
            
          if (userData?.id) {
            console.log('Found user in profiles, ensuring demo data is set up')
            await ensureDemoData(supabaseAdmin, demoEmail)
          }
        } catch (profileError) {
          console.error('Even profile lookup failed:', profileError)
        }
      }
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
      .auth.admin.listUsers({ 
        filters: { email: demoEmail }
      })
    
    if (!userData || !userData.users || userData.users.length === 0) {
      console.log('Could not find demo user in auth.users')
      return
    }
    
    const userId = userData.users[0].id
    console.log('Found demo user ID:', userId)
    
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
