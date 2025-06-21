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

1. Open `src/integrations/supabase/client.ts`
2. Replace `YOUR_SUPABASE_URL` with your Project URL
3. Replace `YOUR_SUPABASE_ANON_KEY` with your Project API Key

4. Open `src/lib/supabase.ts`
5. Replace `YOUR_SUPABASE_URL` with your Project URL
6. Replace `YOUR_SUPABASE_ANON_KEY` with your Project API Key

## Step 4: Run Database Migrations

1. In your Supabase project dashboard, go to the **SQL Editor**
2. Click "New query"
3. Copy and paste the content from `supabase/migrations/001_initial_schema.sql`
4. Click "Run" to execute the migration
5. Repeat for `supabase/migrations/002_sample_data.sql` (optional - adds sample data)

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Under "Auth Providers", make sure **Email** is enabled
3. Configure the following settings:
   - **Enable email confirmations**: OFF (for development)
   - **Enable email change confirmations**: ON
   - **Enable manual linking**: OFF

## Step 6: Test the Connection

1. Start your development server: `npm run dev`
2. Try to sign up with a new account
3. The application should now be connected to your new Supabase project

## Features Included in the Database Schema

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

## Database Tables Created

- `profiles` - User profiles and farm information
- `coops` - Chicken housing units
- `cages` - Egg collection areas
- `chickens` - Individual bird records
- `egg_collection_records` - Daily egg production
- `feed_inventory` - Feed stock management
- `feed_consumption` - Feed usage tracking
- `health_alerts` - Health monitoring system
- `expenses` - Farm expense tracking
- `revenues` - Farm income tracking
- `credit_sales` - Customer credit management
- `credit_payments` - Credit payment tracking
- `environmental_logs` - Environmental monitoring
- `reports` - Generated reports storage

## Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Secure authentication with Supabase Auth
- Proper data validation and constraints

## Next Steps

After setting up Supabase:

1. Create your first user account through the app
2. Add some sample coops and cages
3. Start tracking your egg production
4. Explore the various features and reports

For any issues, check the browser console for error messages and verify your Supabase credentials are correct.