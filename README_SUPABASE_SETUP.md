# Supabase Setup Instructions for Cluck & Track Farm Management

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: cluck-and-track-farm
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
6. Click "Create new project"

## Step 2: Get Your Project Credentials

1. Once your project is created, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (something like `https://your-project-id.supabase.co`)
   - **Project API Key** (anon/public key)

## Step 3: Update the Project Configuration

1. Open `src/lib/supabase.ts`
2. Replace `YOUR_SUPABASE_URL` with your Project URL
3. Replace `YOUR_SUPABASE_ANON_KEY` with your Project API Key

## Step 4: Run Database Migrations

Copy and paste the following SQL into your Supabase SQL Editor:

### Migration 1: Initial Schema

```sql
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
  items jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coops ENABLE ROW LEVEL SECURITY;
ALTER TABLE cages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chickens ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_collection_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_sales ENABLE ROW LEVEL SECURITY;

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
```

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Under "Auth Providers", make sure **Email** is enabled
3. Configure the following settings:
   - **Enable email confirmations**: OFF (for development)
   - **Enable email change confirmations**: ON
   - **Enable manual linking**: OFF

## Step 6: Update Your Code

After setting up Supabase, you'll need to:

1. Update `src/lib/supabase.ts` with your credentials
2. Update `src/services/api.ts` to set `useSupabase = true`
3. Implement the Supabase functions in `src/services/supabaseApi.ts`
4. Update the AuthContext to use Supabase authentication

## Step 7: Test the Connection

1. Start your development server: `npm run dev`
2. Try to sign up with a new account
3. The application should now be connected to your new Supabase project

## Features Available

✅ **Dashboard** - Overview of farm metrics and quick actions
✅ **Chickens** - Individual chicken tracking with health status
✅ **Coops** - Chicken housing management with environmental data
✅ **Cages** - Egg collection areas (A-Z cages)
✅ **Egg Collection** - Daily egg production tracking
✅ **Credit Tracker** - Customer credit sales management
✅ **Inventory** - Feed and supplies management
✅ **Finances** - Expense and revenue tracking
✅ **Reports** - Data analytics and PDF generation
✅ **Settings** - User preferences and farm configuration

For now, the application will use mock data until you complete the Supabase setup.