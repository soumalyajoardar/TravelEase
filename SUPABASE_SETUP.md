# Supabase Setup for TravelEase

This document outlines the Supabase configuration and database schema design for the TravelEase application.

## Prerequisites

1. Copy `.env.example` to `.env.local` and configure your Supabase Project URL, Anon Key, and Service Role Key.
2. Ensure you have installed `@supabase/supabase-js` and `@supabase/ssr` (or equivalent) for modern Next.js App Router support.

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase API URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anonymous Key (safe for the browser).
- `SUPABASE_SERVICE_ROLE_KEY`: Your Service Role Key (bypasses RLS, NEVER expose to the browser).

## Authentication & Profiles

Authentication identities are securely managed by Supabase Auth (`auth.users`). Passwords are NOT duplicated or stored in our public schema.

We maintain a `profiles` table that references the authenticated user.

### Profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'support_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Inventory Schema

The following core normalized tables support the transportation inventory:

### Operators
Organizations providing the transportation.
```sql
CREATE TABLE operators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('train', 'bus')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Stations
```sql
CREATE TABLE stations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  active BOOLEAN DEFAULT true
);
```

### Routes
Logical journeys linking an origin and destination.
```sql
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  origin_station_id UUID REFERENCES stations(id),
  destination_station_id UUID REFERENCES stations(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(origin_station_id, destination_station_id)
);
```

### Services (Trains & Buses)
```sql
CREATE TABLE train_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID REFERENCES operators(id),
  train_number TEXT UNIQUE NOT NULL,
  train_name TEXT NOT NULL,
  active BOOLEAN DEFAULT true
);

CREATE TABLE bus_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID REFERENCES operators(id),
  service_name TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  active BOOLEAN DEFAULT true
);
```

### Schedules
Individual dated departures tied to a route and a service.
```sql
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id UUID REFERENCES routes(id),
  service_type TEXT CHECK (service_type IN ('train', 'bus')),
  train_service_id UUID REFERENCES train_services(id),
  bus_service_id UUID REFERENCES bus_services(id),
  departure_at TIMESTAMPTZ NOT NULL,
  arrival_at TIMESTAMPTZ NOT NULL,
  travel_date DATE NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'delayed', 'completed')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_service_fkey CHECK (
    (service_type = 'train' AND train_service_id IS NOT NULL AND bus_service_id IS NULL) OR
    (service_type = 'bus' AND bus_service_id IS NOT NULL AND train_service_id IS NULL)
  )
);
```

## Customer Data

### Saved Passengers
```sql
CREATE TABLE passengers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Bookings
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES schedules(id),
  booking_reference TEXT UNIQUE NOT NULL,
  booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'failed')),
  payment_status TEXT DEFAULT 'pending',
  total_amount INTEGER NOT NULL, -- minor units (e.g., paise)
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ
);
```

### Booking Passengers
Historical snapshot of passengers tied to a specific booking.
```sql
CREATE TABLE booking_passengers (
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  seat_number TEXT,
  PRIMARY KEY (booking_id, full_name, age)
);
```

## Row Level Security (RLS)

All sensitive tables MUST enable Row Level Security.

Example Policies for `profiles`:
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Customers can view their own profile
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Customers can update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);
```

Example Policies for `bookings`:
```sql
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Customers can view their own bookings
CREATE POLICY "Users can view own bookings"
ON bookings FOR SELECT
USING (auth.uid() = user_id);
```

## Administrator Authorization

Role checks must be enforced securely via the backend. DO NOT use frontend boolean variables to gate critical operations.

```sql
-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
ON bookings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```
