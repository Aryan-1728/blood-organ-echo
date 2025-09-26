-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('donor', 'hospital', 'blood_bank', 'admin');

-- Create blood type enum  
CREATE TYPE public.blood_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- Create organ type enum
CREATE TYPE public.organ_type AS ENUM ('kidney', 'liver', 'heart', 'lung', 'pancreas', 'cornea', 'bone_marrow', 'skin', 'bone');

-- Create inventory status enum
CREATE TYPE public.inventory_status AS ENUM ('available', 'reserved', 'expired', 'used');

-- Create SOS priority enum
CREATE TYPE public.sos_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Create SOS status enum
CREATE TYPE public.sos_status AS ENUM ('active', 'acknowledged', 'responding', 'resolved', 'cancelled');

-- Create user profiles table
CREATE TABLE public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    role public.user_role NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    organization_name TEXT, -- For hospitals/blood banks
    license_number TEXT, -- For hospitals/blood banks
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donor medical profile table
CREATE TABLE public.donor_medical_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    blood_type public.blood_type NOT NULL,
    age INTEGER NOT NULL,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    medical_conditions TEXT[],
    medications TEXT[],
    last_donation_date DATE,
    available_for_donation BOOLEAN DEFAULT true,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory table for blood and organs
CREATE TABLE public.inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Hospital or blood bank
    blood_type public.blood_type,
    organ_type public.organ_type,
    quantity INTEGER DEFAULT 1,
    status public.inventory_status DEFAULT 'available',
    expiry_date TIMESTAMP WITH TIME ZONE,
    collection_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    donor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure either blood_type or organ_type is set, but not both
    CONSTRAINT inventory_type_check CHECK (
        (blood_type IS NOT NULL AND organ_type IS NULL) OR 
        (blood_type IS NULL AND organ_type IS NOT NULL)
    )
);

-- Create SOS requests table
CREATE TABLE public.sos_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    patient_name TEXT NOT NULL,
    patient_age INTEGER,
    blood_type public.blood_type,
    organ_type public.organ_type,
    priority public.sos_priority NOT NULL DEFAULT 'medium',
    status public.sos_status NOT NULL DEFAULT 'active',
    location_name TEXT NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    description TEXT,
    contact_phone TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure either blood_type or organ_type is set, but not both
    CONSTRAINT sos_type_check CHECK (
        (blood_type IS NOT NULL AND organ_type IS NULL) OR 
        (blood_type IS NULL AND organ_type IS NOT NULL)
    )
);

-- Create SOS responses table
CREATE TABLE public.sos_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sos_request_id UUID REFERENCES public.sos_requests(id) ON DELETE CASCADE NOT NULL,
    responder_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    message TEXT,
    estimated_arrival TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donor matching table
CREATE TABLE public.donor_matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sos_request_id UUID REFERENCES public.sos_requests(id) ON DELETE CASCADE NOT NULL,
    donor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    compatibility_score INTEGER DEFAULT 0, -- 0-100 score from AI
    distance_km DECIMAL(10,2),
    ai_recommendation TEXT,
    match_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'sos_alert', 'match_found', 'inventory_low', etc.
    priority public.sos_priority DEFAULT 'medium',
    read BOOLEAN DEFAULT false,
    sos_request_id UUID REFERENCES public.sos_requests(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_medical_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for donor medical profiles
CREATE POLICY "Donors can manage their medical profile" ON public.donor_medical_profiles
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for inventory
CREATE POLICY "Providers can manage their inventory" ON public.inventory
    FOR ALL USING (auth.uid() = provider_id);

CREATE POLICY "Users can view available inventory" ON public.inventory
    FOR SELECT USING (status = 'available');

-- RLS Policies for SOS requests
CREATE POLICY "Users can create SOS requests" ON public.sos_requests
    FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can view their own SOS requests" ON public.sos_requests
    FOR SELECT USING (auth.uid() = requester_id);

CREATE POLICY "Users can update their own SOS requests" ON public.sos_requests
    FOR UPDATE USING (auth.uid() = requester_id);

CREATE POLICY "All authenticated users can view active SOS requests" ON public.sos_requests
    FOR SELECT USING (status = 'active' AND auth.uid() IS NOT NULL);

-- RLS Policies for SOS responses
CREATE POLICY "Users can create SOS responses" ON public.sos_responses
    FOR INSERT WITH CHECK (auth.uid() = responder_id);

CREATE POLICY "Users can view SOS responses" ON public.sos_responses
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- RLS Policies for donor matches
CREATE POLICY "Users can view donor matches" ON public.donor_matches
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- RLS Policies for notifications
CREATE POLICY "Users can manage their notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donor_medical_profiles_updated_at BEFORE UPDATE ON public.donor_medical_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sos_requests_updated_at BEFORE UPDATE ON public.sos_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.sos_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sos_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;