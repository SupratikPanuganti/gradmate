# GradMate

A platform for students to manage their research lab applications, with AI-powered essay analysis and email generation.

## Project Structure

```
GradMate/
├── gradmate-frontend/     # Next.js frontend application
└── gradmate-backend/      # Express backend server
```

## Prerequisites

- Node.js 20.x
- npm 10.x
- AWS Account
- Supabase Account
- OpenAI API Key
- Pinecone Account

## Environment Setup

### Frontend (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)

```
# Server Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX=gradmate

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Development

1. Install dependencies:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd gradmate-frontend
npm install

# Install backend dependencies
cd ../gradmate-backend
npm install
```

2. Start development servers:

```bash
# From root directory
npm run dev
```

## Deployment

### AWS Setup

1. Create an AWS account if you don't have one
2. Install AWS CLI and configure credentials:

```bash
aws configure
```

3. Create an ECR repository:

```bash
aws ecr create-repository --repository-name gradmate-backend
```

4. Create an ECS cluster:

```bash
aws ecs create-cluster --cluster-name gradmate-cluster
```

5. Create an ECS service:

```bash
aws ecs create-service \
  --cluster gradmate-cluster \
  --service-name gradmate-backend-service \
  --task-definition gradmate-backend \
  --desired-count 1
```

### GitHub Setup

1. Create a new GitHub repository
2. Add the following secrets to your GitHub repository:

   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `PINECONE_API_KEY`

3. Push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

### Database Setup

1. Create a new Supabase project
2. Run the following SQL to create the necessary tables:

```sql
-- Create students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  university TEXT NOT NULL,
  major TEXT NOT NULL,
  graduation_year INTEGER,
  gpa DECIMAL,
  research_interests TEXT[],
  skills TEXT[],
  resume_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create labs table
CREATE TABLE labs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  university TEXT NOT NULL,
  research_areas TEXT[],
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create professors table
CREATE TABLE professors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id UUID REFERENCES labs(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create essay_ideas table
CREATE TABLE essay_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  lab_id UUID REFERENCES labs(id),
  professor_id UUID REFERENCES professors(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  key_points TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create outreach_logs table
CREATE TABLE outreach_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  lab_id UUID REFERENCES labs(id),
  professor_id UUID REFERENCES professors(id),
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Set up storage buckets in Supabase:

   - Create a `resumes` bucket for student resumes
   - Create an `essays` bucket for student essays

4. Set up Row Level Security (RLS) policies in Supabase:
   - Allow users to read/write their own data
   - Allow public read access to labs and professors
   - Restrict write access to authenticated users

## Monitoring

1. Set up AWS CloudWatch for monitoring:

   - Create log groups for your ECS service
   - Set up alarms for error rates and latency
   - Configure metrics for API usage

2. Set up Supabase monitoring:
   - Enable database backups
   - Monitor storage usage
   - Set up alerts for unusual activity

## Security

1. Enable CORS in your Supabase project
2. Set up proper authentication in your frontend
3. Use environment variables for all sensitive data
4. Enable rate limiting on your API endpoints
5. Set up proper error handling and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
