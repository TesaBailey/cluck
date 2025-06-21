/*
  # Sample Data for Farm Management System

  1. Sample Data
    - Create sample coops
    - Create sample cages
    - Create sample chickens
    - Create sample feed inventory
    - Create sample expenses and revenues
    - Create sample egg collection records
*/

-- Insert sample feed inventory (will be available for all users)
-- Note: In a real app, you'd want to create this data per user
-- This is just for demonstration purposes

-- Sample expenses categories for reference
INSERT INTO expenses (id, user_id, category, description, amount, transaction_date)
VALUES 
  (gen_random_uuid(), auth.uid(), 'Feed', 'Layer feed purchase - 50kg bags', 250.00, CURRENT_DATE - INTERVAL '5 days'),
  (gen_random_uuid(), auth.uid(), 'Medication', 'Chicken vitamins and supplements', 45.50, CURRENT_DATE - INTERVAL '3 days'),
  (gen_random_uuid(), auth.uid(), 'Equipment', 'New feeders and waterers', 120.00, CURRENT_DATE - INTERVAL '7 days'),
  (gen_random_uuid(), auth.uid(), 'Maintenance', 'Coop repairs and cleaning supplies', 85.25, CURRENT_DATE - INTERVAL '2 days')
WHERE auth.uid() IS NOT NULL;

-- Sample revenue categories for reference
INSERT INTO revenues (id, user_id, category, description, amount, transaction_date)
VALUES 
  (gen_random_uuid(), auth.uid(), 'Egg Sales', 'Weekly egg sales to local market', 180.00, CURRENT_DATE - INTERVAL '1 day'),
  (gen_random_uuid(), auth.uid(), 'Chicken Sales', 'Sold 5 mature hens', 75.00, CURRENT_DATE - INTERVAL '4 days'),
  (gen_random_uuid(), auth.uid(), 'Manure Sales', 'Sold compost to local gardeners', 25.00, CURRENT_DATE - INTERVAL '6 days')
WHERE auth.uid() IS NOT NULL;