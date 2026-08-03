-- LegalEase AI Supabase Schema
-- Copy and paste this entirely into the Supabase SQL Editor and click "Run"

-- 1. Create the Documents Table
CREATE TABLE documents (
    id UUID PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_type TEXT,
    text_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the Analyses Table
CREATE TABLE analyses (
    id UUID PRIMARY KEY,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    risk_score INTEGER,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create the Clauses Table
CREATE TABLE clauses (
    id UUID PRIMARY KEY,
    analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    risk_level TEXT,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: Row Level Security (RLS) is disabled for this hackathon demo to allow the backend easy access.
-- In a production app, you would enable RLS and use service role keys or user auth tokens.
