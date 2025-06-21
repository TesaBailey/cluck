/*
  # Initial Farm Management Schema

  1. New Tables
    - `profiles` - User profiles and farm information
    - `coops` - Chicken coops with environmental data
    - `cages` - Individual chicken cages for egg collection
    - `chickens` - Individual chicken records
    - `egg_collection_records` - Daily egg collection data
    - `feed_inventory` - Feed stock management
    - `health_alerts` - Health monitoring and alerts
    - `expenses` - Farm expense tracking
    - `revenues` - Farm revenue tracking
    - `credit_sales` - Credit sales tracking for customers

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create custom types
CREATE TYPE health_status AS ENUM ('healthy', 'sick', 'recovering', 'deceased');
CREATE TYPE alert_type AS ENUM ('disease', 'injury', 'behavior', 'temperature', 'water', 'feed', 'other');
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'overdue');
CREATE TYPE sold_as_type AS ENUM ('single', 'crate');

-- Profiles table for user management
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  role text DEFAULT 'farm_manager',
  farm_name text,
  farm_address text,
  phone_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Coops table for chicken housing
CREATE TABLE IF NOT EXISTS coops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  capacity integer NOT NULL DEFAULT 0,
  current_occupancy integer NOT NULL DEFAULT 0,
  temperature decimal(4,1) DEFAULT 22.0,
  humidity decimal(4,1) DEFAULT 60.0,
  last_cleaned timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cages table for egg collection areas
CREATE TABLE IF NOT EXISTS cages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL UNIQUE,
  capacity integer NOT NULL DEFAULT 10,
  current_occupancy integer NOT NULL DEFAULT 0,
  new_chickens_count integer NOT NULL DEFAULT 0,
  old_chickens_count integer NOT NULL DEFAULT 0,
  coop_id uuid REFERENCES coops(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chickens table for individual bird tracking
CREATE TABLE IF NOT EXISTS chickens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  breed text NOT NULL,
  age_weeks integer NOT NULL DEFAULT 0,
  health_status health_status DEFAULT 'healthy',
  weight_grams integer,
  coop_id uuid REFERENCES coops(id) ON DELETE SET NULL,
  cage_id uuid REFERENCES cages(id) ON DELETE SET NULL,
  acquisition_date timestamptz DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Egg collection records
CREATE TABLE IF NOT EXISTS egg_collection_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cage_id uuid REFERENCES cages(id) ON DELETE CASCADE NOT NULL,
  collection_date date NOT NULL,
  total_count integer NOT NULL DEFAULT 0,
  damaged_count integer NOT NULL DEFAULT 0,
  spoiled_count integer NOT NULL DEFAULT 0,
  sold_count integer NOT NULL DEFAULT 0,
  sold_as sold_as_type,
  price_per_unit decimal(10,2),
  buyer_name text,
  payment_status payment_status,
  payment_due_date date,
  is_from_new_chickens boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Feed inventory management
CREATE TABLE IF NOT EXISTS feed_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feed_type text NOT NULL,
  brand text,
  current_stock_kg decimal(10,2) NOT NULL DEFAULT 0,
  cost_per_kg decimal(10,2) NOT NULL DEFAULT 0,
  supplier text,
  reorder_level_kg decimal(10,2) NOT NULL DEFAULT 50,
  last_restocked timestamptz DEFAULT now(),
  expiry_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Feed consumption tracking
CREATE TABLE IF NOT EXISTS feed_consumption (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feed_inventory_id uuid REFERENCES feed_inventory(id) ON DELETE CASCADE NOT NULL,
  consumption_date date NOT NULL,
  amount_kg decimal(10,2) NOT NULL DEFAULT 0,
  coop_id uuid REFERENCES coops(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Health alerts and monitoring
CREATE TABLE IF NOT EXISTS health_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  alert_type alert_type NOT NULL,
  severity alert_severity NOT NULL DEFAULT 'medium',
  title text NOT NULL,
  description text NOT NULL,
  chicken_id uuid REFERENCES chickens(id) ON DELETE CASCADE,
  coop_id uuid REFERENCES coops(id) ON DELETE CASCADE,
  cage_id uuid REFERENCES cages(id) ON DELETE CASCADE,
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id),
  resolution_notes text,
  alert_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Expense tracking
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  subcategory text,
  description text NOT NULL,
  amount decimal(10,2) NOT NULL,
  transaction_date date NOT NULL,
  payment_method text,
  vendor text,
  receipt_url text,
  is_recurring boolean DEFAULT false,
  recurring_frequency text,
  tags text[],
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Revenue tracking
CREATE TABLE IF NOT EXISTS revenues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  subcategory text,
  description text NOT NULL,
  amount decimal(10,2) NOT NULL,
  transaction_date date NOT NULL,
  payment_method text,
  customer_name text,
  invoice_number text,
  is_recurring boolean DEFAULT false,
  recurring_frequency text,
  tags text[],
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Credit sales tracking
CREATE TABLE IF NOT EXISTS credit_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_name text NOT NULL,
  customer_phone text,
  customer_address text,
  sale_date date NOT NULL,
  due_date date NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  paid_amount decimal(10,2) NOT NULL DEFAULT 0,
  balance_amount decimal(10,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  payment_status payment_status DEFAULT 'pending',
  items jsonb, -- Store sale items as JSON
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Credit payments tracking
CREATE TABLE IF NOT EXISTS credit_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_sale_id uuid REFERENCES credit_sales(id) ON DELETE CASCADE NOT NULL,
  payment_amount decimal(10,2) NOT NULL,
  payment_date date NOT NULL,
  payment_method text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Environmental monitoring data
CREATE TABLE IF NOT EXISTS environmental_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  coop_id uuid REFERENCES coops(id) ON DELETE CASCADE,
  recorded_at timestamptz DEFAULT now(),
  temperature decimal(4,1),
  humidity decimal(4,1),
  air_quality_index integer,
  lighting_hours decimal(4,1),
  ventilation_status text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Reports and analytics
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  report_type text NOT NULL,
  report_name text NOT NULL,
  date_range_start date,
  date_range_end date,
  filters jsonb,
  data jsonb,
  generated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coops ENABLE ROW LEVEL SECURITY;
ALTER TABLE cages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chickens ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_collection_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for all other tables (users can only access their own data)
CREATE POLICY "Users can manage own coops"
  ON coops
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own cages"
  ON cages
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own chickens"
  ON chickens
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own egg collection"
  ON egg_collection_records
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own feed inventory"
  ON feed_inventory
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own feed consumption"
  ON feed_consumption
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own health alerts"
  ON health_alerts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own expenses"
  ON expenses
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own revenues"
  ON revenues
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own credit sales"
  ON credit_sales
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage credit payments for own sales"
  ON credit_payments
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM credit_sales 
    WHERE credit_sales.id = credit_payments.credit_sale_id 
    AND credit_sales.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own environmental logs"
  ON environmental_logs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own reports"
  ON reports
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_coops_user_id ON coops(user_id);
CREATE INDEX IF NOT EXISTS idx_cages_user_id ON cages(user_id);
CREATE INDEX IF NOT EXISTS idx_chickens_user_id ON chickens(user_id);
CREATE INDEX IF NOT EXISTS idx_chickens_coop_id ON chickens(coop_id);
CREATE INDEX IF NOT EXISTS idx_chickens_cage_id ON chickens(cage_id);
CREATE INDEX IF NOT EXISTS idx_egg_collection_user_id ON egg_collection_records(user_id);
CREATE INDEX IF NOT EXISTS idx_egg_collection_cage_id ON egg_collection_records(cage_id);
CREATE INDEX IF NOT EXISTS idx_egg_collection_date ON egg_collection_records(collection_date);
CREATE INDEX IF NOT EXISTS idx_feed_inventory_user_id ON feed_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_consumption_user_id ON feed_consumption(user_id);
CREATE INDEX IF NOT EXISTS idx_health_alerts_user_id ON health_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_health_alerts_resolved ON health_alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(transaction_date);
CREATE INDEX IF NOT EXISTS idx_revenues_user_id ON revenues(user_id);
CREATE INDEX IF NOT EXISTS idx_revenues_date ON revenues(transaction_date);
CREATE INDEX IF NOT EXISTS idx_credit_sales_user_id ON credit_sales(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_sales_status ON credit_sales(payment_status);
CREATE INDEX IF NOT EXISTS idx_credit_payments_sale_id ON credit_payments(credit_sale_id);
CREATE INDEX IF NOT EXISTS idx_environmental_logs_user_id ON environmental_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_environmental_logs_coop_id ON environmental_logs(coop_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);

-- Create functions for automated tasks
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coops_updated_at BEFORE UPDATE ON coops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cages_updated_at BEFORE UPDATE ON cages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chickens_updated_at BEFORE UPDATE ON chickens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_egg_collection_updated_at BEFORE UPDATE ON egg_collection_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feed_inventory_updated_at BEFORE UPDATE ON feed_inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_alerts_updated_at BEFORE UPDATE ON health_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_revenues_updated_at BEFORE UPDATE ON revenues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_credit_sales_updated_at BEFORE UPDATE ON credit_sales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();