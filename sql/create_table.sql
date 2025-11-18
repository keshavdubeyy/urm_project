-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id TEXT UNIQUE NOT NULL,
    consent BOOLEAN,
    start_timestamp TEXT,
    end_timestamp TEXT,
    duration_seconds INTEGER,
    
    -- Demographics (flattened)
    age INTEGER,
    gender TEXT,
    gender_self_describe TEXT,
    education_level TEXT,
    education_other TEXT,
    ai_use_frequency INTEGER,
    ai_tool_most_used TEXT,
    
    -- Nested data as JSON strings
    dia_pre TEXT,
    gse TEXT,
    mood_pre TEXT,
    task_no_ai TEXT,
    task_ai TEXT,
    dia_post TEXT,
    mood_post TEXT,
    reflections TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on response_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_survey_responses_response_id ON survey_responses(response_id);

-- Create index on created_at for ordered queries
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON survey_responses(created_at);