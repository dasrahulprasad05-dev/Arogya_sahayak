-- ==========================================
-- AAROGYA SAHAYAK - DATABASE SCHEMA SETUP
-- Execute this script in your Supabase SQL Editor
-- ==========================================

-- 1. PROFILES TABLE
-- Stores user preferences and metadata linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE,
  full_name TEXT,
  language TEXT DEFAULT 'or',
  theme TEXT DEFAULT 'dark'
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Allow public read access to profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow individual write access to profiles" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow individual insert access to profiles" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);


-- 2. HEALTH LOGS TABLE
-- Stores generic JSON health tracking metrics (sleep, water, symptoms, vitals, etc.)
CREATE TABLE IF NOT EXISTS public.health_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.health_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Health Logs
CREATE POLICY "Allow individual read access to health_logs" ON public.health_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow individual insert access to health_logs" ON public.health_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow individual update access to health_logs" ON public.health_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow individual delete access to health_logs" ON public.health_logs
  FOR DELETE USING (auth.uid() = user_id);


-- 3. AUTOMATIC USER PROFILE TRIGGER
-- Automatically creates a profile row in public.profiles when a new user registers in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, language, theme, updated_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'language', 'or'),
    COALESCE(new.raw_user_meta_data->>'theme', 'dark'),
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind Trigger to auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
