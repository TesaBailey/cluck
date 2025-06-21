/*
  # Sample Data Migration

  1. Sample Data
    - Add sample expenses for demonstration
    - Add sample revenues for demonstration
    - Add sample feed inventory items
    - Add sample cages for egg collection

  Note: This migration adds sample data that will be associated with users when they sign up.
  In production, you might want to skip this or modify it based on your needs.
*/

-- Sample feed inventory items (these will be created without user_id initially)
-- Users can modify these or create their own
INSERT INTO feed_inventory (
  id,
  feed_type,
  brand,
  current_stock_kg,
  cost_per_kg,
  supplier,
  reorder_level_kg,
  last_restocked,
  expiry_date,
  notes
) VALUES 
  (
    gen_random_uuid(),
    'Layer Feed',
    'Premium Layers',
    150.0,
    0.85,
    'Farm Supply Co',
    50.0,
    CURRENT_DATE - INTERVAL '3 days',
    CURRENT_DATE + INTERVAL '6 months',
    'High protein feed for laying hens'
  ),
  (
    gen_random_uuid(),
    'Starter Feed',
    'Chick Starter Plus',
    75.0,
    1.20,
    'Poultry Nutrition Ltd',
    25.0,
    CURRENT_DATE - INTERVAL '1 week',
    CURRENT_DATE + INTERVAL '4 months',
    'For chicks 0-8 weeks old'
  ),
  (
    gen_random_uuid(),
    'Grower Feed',
    'Young Bird Grower',
    100.0,
    0.95,
    'Farm Supply Co',
    30.0,
    CURRENT_DATE - INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '5 months',
    'For growing birds 8-16 weeks'
  );

-- Function to create sample data for new users
CREATE OR REPLACE FUNCTION create_sample_data_for_user(user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Create sample coops
  INSERT INTO coops (id, user_id, name, capacity, current_occupancy, temperature, humidity, last_cleaned)
  VALUES 
    (gen_random_uuid(), user_id, 'North Coop', 50, 45, 22.5, 65.0, CURRENT_DATE - INTERVAL '2 days'),
    (gen_random_uuid(), user_id, 'South Coop', 60, 55, 23.0, 62.0, CURRENT_DATE - INTERVAL '1 day'),
    (gen_random_uuid(), user_id, 'West Coop', 40, 35, 21.8, 68.0, CURRENT_DATE - INTERVAL '3 days');

  -- Create sample cages (A through J for demonstration)
  INSERT INTO cages (id, user_id, name, capacity, current_occupancy, new_chickens_count, old_chickens_count)
  VALUES 
    (gen_random_uuid(), user_id, 'Cage A', 15, 12, 7, 5),
    (gen_random_uuid(), user_id, 'Cage B', 15, 14, 8, 6),
    (gen_random_uuid(), user_id, 'Cage C', 15, 10, 4, 6),
    (gen_random_uuid(), user_id, 'Cage D', 15, 13, 9, 4),
    (gen_random_uuid(), user_id, 'Cage E', 15, 11, 6, 5),
    (gen_random_uuid(), user_id, 'Cage F', 15, 15, 10, 5),
    (gen_random_uuid(), user_id, 'Cage G', 15, 9, 3, 6),
    (gen_random_uuid(), user_id, 'Cage H', 15, 12, 8, 4),
    (gen_random_uuid(), user_id, 'Cage I', 15, 8, 2, 6),
    (gen_random_uuid(), user_id, 'Cage J', 15, 14, 9, 5);

  -- Create sample chickens
  INSERT INTO chickens (id, user_id, name, breed, age_weeks, health_status, weight_grams, acquisition_date, notes)
  VALUES 
    (gen_random_uuid(), user_id, 'Henrietta', 'Rhode Island Red', 25, 'healthy', 1800, CURRENT_DATE - INTERVAL '20 weeks', 'Good layer, friendly temperament'),
    (gen_random_uuid(), user_id, 'Clucky', 'Leghorn', 30, 'healthy', 1600, CURRENT_DATE - INTERVAL '25 weeks', 'Excellent egg production'),
    (gen_random_uuid(), user_id, 'Feathers', 'Sussex', 22, 'healthy', 1900, CURRENT_DATE - INTERVAL '18 weeks', 'Calm and docile'),
    (gen_random_uuid(), user_id, 'Pecky', 'Australorp', 28, 'recovering', 1750, CURRENT_DATE - INTERVAL '23 weeks', 'Recently treated for minor injury'),
    (gen_random_uuid(), user_id, 'Goldie', 'Buff Orpington', 26, 'healthy', 2000, CURRENT_DATE - INTERVAL '21 weeks', 'Large breed, good broody hen');

  -- Create sample expenses
  INSERT INTO expenses (id, user_id, category, subcategory, description, amount, transaction_date, payment_method, vendor, notes)
  VALUES 
    (gen_random_uuid(), user_id, 'Feed', 'Layer Feed', 'Premium layer feed - 50kg bags', 250.00, CURRENT_DATE - INTERVAL '5 days', 'Credit Card', 'Farm Supply Co', 'Monthly feed purchase'),
    (gen_random_uuid(), user_id, 'Medication', 'Vitamins', 'Chicken vitamins and supplements', 45.50, CURRENT_DATE - INTERVAL '3 days', 'Cash', 'Vet Clinic', 'Preventive health care'),
    (gen_random_uuid(), user_id, 'Equipment', 'Feeders', 'New automatic feeders and waterers', 120.00, CURRENT_DATE - INTERVAL '7 days', 'Bank Transfer', 'Poultry Equipment Ltd', 'Upgrade to automatic system'),
    (gen_random_uuid(), user_id, 'Maintenance', 'Cleaning', 'Coop repairs and cleaning supplies', 85.25, CURRENT_DATE - INTERVAL '2 days', 'Credit Card', 'Hardware Store', 'Monthly maintenance'),
    (gen_random_uuid(), user_id, 'Utilities', 'Electricity', 'Monthly electricity bill for coops', 65.00, CURRENT_DATE - INTERVAL '1 week', 'Direct Debit', 'Power Company', 'Heating and lighting');

  -- Create sample revenues
  INSERT INTO revenues (id, user_id, category, subcategory, description, amount, transaction_date, payment_method, customer_name, notes)
  VALUES 
    (gen_random_uuid(), user_id, 'Egg Sales', 'Retail', 'Weekly egg sales to local market', 180.00, CURRENT_DATE - INTERVAL '1 day', 'Cash', 'Local Farmers Market', 'Regular weekly sales'),
    (gen_random_uuid(), user_id, 'Chicken Sales', 'Live Birds', 'Sold 5 mature laying hens', 75.00, CURRENT_DATE - INTERVAL '4 days', 'Cash', 'Neighbor Farm', 'Older hens past peak laying'),
    (gen_random_uuid(), user_id, 'Other', 'Manure', 'Sold compost to local gardeners', 25.00, CURRENT_DATE - INTERVAL '6 days', 'Cash', 'Community Garden', 'Organic compost sales'),
    (gen_random_uuid(), user_id, 'Egg Sales', 'Wholesale', 'Bulk egg sales to restaurant', 120.00, CURRENT_DATE - INTERVAL '3 days', 'Bank Transfer', 'Green Leaf Restaurant', 'Weekly restaurant order'),
    (gen_random_uuid(), user_id, 'Egg Sales', 'Direct', 'Farm gate sales', 45.00, CURRENT_DATE - INTERVAL '2 days', 'Cash', 'Various Customers', 'Direct sales to visitors');

  -- Create sample egg collection records
  INSERT INTO egg_collection_records (id, user_id, cage_id, collection_date, total_count, damaged_count, spoiled_count, sold_count, sold_as, price_per_unit, buyer_name, payment_status, is_from_new_chickens, notes)
  SELECT 
    gen_random_uuid(),
    user_id,
    c.id,
    CURRENT_DATE - INTERVAL '1 day',
    CASE 
      WHEN c.name IN ('Cage A', 'Cage B', 'Cage F') THEN c.current_occupancy
      WHEN c.name IN ('Cage C', 'Cage G', 'Cage I') THEN c.current_occupancy - 2
      ELSE c.current_occupancy - 1
    END,
    CASE WHEN c.name = 'Cage C' THEN 1 ELSE 0 END,
    0,
    CASE 
      WHEN c.name IN ('Cage A', 'Cage B') THEN c.current_occupancy - 1
      ELSE c.current_occupancy - 2
    END,
    'single',
    0.50,
    CASE 
      WHEN c.name IN ('Cage A', 'Cage B') THEN 'Local Market'
      ELSE NULL
    END,
    CASE 
      WHEN c.name IN ('Cage A', 'Cage B') THEN 'paid'
      ELSE NULL
    END,
    c.new_chickens_count > c.old_chickens_count,
    'Daily collection'
  FROM cages c 
  WHERE c.user_id = user_id;

  -- Create sample health alerts
  INSERT INTO health_alerts (id, user_id, alert_type, severity, title, description, resolved, alert_date, notes)
  VALUES 
    (gen_random_uuid(), user_id, 'temperature', 'medium', 'Temperature Spike', 'Temperature in North Coop exceeded 26°C', true, CURRENT_DATE - INTERVAL '3 days', 'Resolved by improving ventilation'),
    (gen_random_uuid(), user_id, 'behavior', 'low', 'Reduced Activity', 'Some chickens showing less activity than usual', false, CURRENT_DATE - INTERVAL '1 day', 'Monitoring situation'),
    (gen_random_uuid(), user_id, 'feed', 'high', 'Low Feed Stock', 'Layer feed running low - below reorder level', false, CURRENT_DATE, 'Need to reorder immediately');

  -- Create sample environmental logs
  INSERT INTO environmental_logs (id, user_id, recorded_at, temperature, humidity, air_quality_index, lighting_hours, ventilation_status, notes)
  SELECT 
    gen_random_uuid(),
    user_id,
    CURRENT_TIMESTAMP - (INTERVAL '1 hour' * generate_series(1, 24)),
    20 + (random() * 8), -- Temperature between 20-28°C
    55 + (random() * 20), -- Humidity between 55-75%
    40 + (random() * 20)::integer, -- AQI between 40-60
    12 + (random() * 4), -- Lighting 12-16 hours
    CASE WHEN random() > 0.8 THEN 'manual' ELSE 'automatic' END,
    'Automated environmental monitoring'
  FROM generate_series(1, 24);

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create sample data for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create sample data for the new user
  PERFORM create_sample_data_for_user(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires when a new user profile is created
DROP TRIGGER IF EXISTS on_auth_user_created ON profiles;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Note: The sample feed inventory items created above will be available to all users
-- In a production environment, you might want to create user-specific feed inventory
-- or allow users to copy from a template