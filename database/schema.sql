-- SHPE FAU Tech Management System Database Schema
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phase TEXT,
    status TEXT DEFAULT 'Not Started',
    priority TEXT DEFAULT 'Medium',
    start_date DATE,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    assignee TEXT,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT,
    skills TEXT[], -- Array of skills
    availability TEXT DEFAULT 'Part-time',
    performance INTEGER DEFAULT 85,
    github_username TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

-- Workshops table
CREATE TABLE IF NOT EXISTS workshops (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    date DATE,
    attendees INTEGER DEFAULT 0,
    status TEXT DEFAULT 'template-needed',
    priority TEXT DEFAULT 'medium',
    topics TEXT[], -- Array of topics
    template_status TEXT DEFAULT 'not-started',
    deliverables TEXT[], -- Array of deliverables
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

-- Meetings table
CREATE TABLE IF NOT EXISTS meetings (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'one-time',
    frequency TEXT,
    next_date DATE,
    agenda TEXT[], -- Array of agenda items
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

-- Automations table
CREATE TABLE IF NOT EXISTS automations (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    frequency TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    steps TEXT[], -- Array of workflow steps
    automations TEXT[], -- Array of automation descriptions
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

-- Row Level Security Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users (SHPE FAU members)
CREATE POLICY "Users can view all data" ON projects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert data" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update data" ON projects FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all tasks" ON tasks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert tasks" ON tasks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update tasks" ON tasks FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view team members" ON team_members FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert team members" ON team_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update team members" ON team_members FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view workshops" ON workshops FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert workshops" ON workshops FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update workshops" ON workshops FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view meetings" ON meetings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert meetings" ON meetings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update meetings" ON meetings FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view automations" ON automations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert automations" ON automations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update automations" ON automations FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view workflows" ON workflows FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert workflows" ON workflows FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update workflows" ON workflows FOR UPDATE USING (auth.role() = 'authenticated');

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON workshops FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON automations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert initial data for SHPE FAU Tech Chair
INSERT INTO projects (name, phase, status, priority, start_date, end_date, description) VALUES
('Website Modernization', 'Phase 2', 'Not Started', 'High', '2025-08-15', '2025-09-30', 'Modernize SHPE FAU website with improved UI/UX and performance'),
('Mobile App Development', 'Phase 3', 'Planning', 'High', '2025-09-01', '2026-05-15', 'Develop dedicated mobile application for SHPE FAU members');

-- Insert initial tasks
INSERT INTO tasks (project_id, name, status, due_date) VALUES
(1, 'Current website audit', 'pending', '2025-08-20'),
(1, 'Performance analysis', 'pending', '2025-08-22'),
(1, 'UI/UX improvements backlog', 'pending', '2025-08-25'),
(1, 'Mobile responsiveness fixes', 'pending', '2025-09-05'),
(1, 'SEO optimization', 'pending', '2025-09-15'),
(1, 'Content management system update', 'pending', '2025-09-25'),
(2, 'Technical architecture design', 'pending', '2025-09-15'),
(2, 'UI/UX wireframes', 'pending', '2025-09-20'),
(2, 'Development environment setup', 'pending', '2025-09-25'),
(2, 'Authentication system', 'pending', '2025-10-15'),
(2, 'Event management features', 'pending', '2025-11-15'),
(2, 'Member directory', 'pending', '2025-12-15'),
(2, 'Beta testing with members', 'pending', '2026-03-15'),
(2, 'App store deployment', 'pending', '2026-05-01');

-- Insert initial workshops
INSERT INTO workshops (title, subtitle, description, date, priority, topics, deliverables) VALUES
('Git/GitHub Workshop', 'Essential Version Control for Engineers', 'Essential for any engineering role. Cover basics like version control, pull requests, and collaborative coding. You could even do a mini hackathon where teams contribute to a shared project.', '2025-09-15', 'high', 
    ARRAY['Version control basics', 'Pull requests', 'Collaborative coding', 'Mini hackathon'],
    ARRAY['Shared project repository for mini hackathon', 'Git commands cheat sheet', 'PR workflow templates', 'Collaboration best practices guide']),
('API Development Workshop', 'Building Connected Applications', 'Create and deploy your first REST API from scratch. Learn to build endpoints, handle authentication, connect to databases, and integrate third-party services. By the end, you will have a working API deployed online.', '2025-10-15', 'high',
    ARRAY['REST API creation', 'Authentication', 'Database integration', 'Third-party services', 'Deployment'],
    ARRAY['API starter template', 'Database setup scripts', 'Authentication implementation', 'Deployment guide', 'Working deployed API']),
('Workshop 3', 'TBD', 'Workshop topic to be determined', '2025-11-15', 'medium', ARRAY[]::TEXT[], ARRAY[]::TEXT[]),
('Workshop 4', 'TBD', 'Workshop topic to be determined', '2025-12-15', 'medium', ARRAY[]::TEXT[], ARRAY[]::TEXT[]);

-- Insert initial team members
INSERT INTO team_members (name, role, skills, availability, performance) VALUES
('Frontend Developer 1', 'Frontend Lead', ARRAY['React', 'CSS', 'JavaScript'], 'Full-time', 85),
('Backend Developer 1', 'Backend Lead', ARRAY['Node.js', 'Python', 'Database'], 'Part-time', 90),
('UI/UX Designer', 'Design Lead', ARRAY['Figma', 'User Research', 'Prototyping'], 'Full-time', 88),
('Mobile Developer', 'Mobile Lead', ARRAY['React Native', 'Flutter', 'iOS/Android'], 'Part-time', 82);

-- Insert initial meetings
INSERT INTO meetings (title, type, frequency, next_date, agenda) VALUES
('E-Board Sync', 'recurring', 'bi-weekly', '2025-08-15', ARRAY['Project updates', 'Budget discussion', 'Event planning']),
('Tech Committee Meeting', 'recurring', 'weekly', '2025-08-12', ARRAY['Code review', 'Sprint planning', 'Pair programming']),
('Team Standup', 'recurring', 'daily', '2025-08-05', ARRAY['Yesterday progress', 'Today plans', 'Blockers']);

-- Insert initial automations
INSERT INTO automations (name, description, status, frequency) VALUES
('Daily Progress Reports', 'Auto-generate team progress summaries', 'active', 'daily'),
('Meeting Reminders', 'Send calendar reminders with agendas', 'active', 'as-needed'),
('Code Review Assignments', 'Auto-assign reviewers based on expertise', 'active', 'on-PR'),
('Sprint Reports', 'Weekly sprint progress to E-Board', 'active', 'weekly'),
('Workshop Attendance Tracking', 'Auto-track and follow up on workshop attendance', 'active', 'post-event');

-- Insert initial workflows
INSERT INTO workflows (name, steps, automations, status) VALUES
('Pull Request Process', 
    ARRAY['Create feature branch from main', 'Implement feature with proper commits', 'Write/update tests', 'Create PR with description template', 'Request 2 code reviewers', 'Address review feedback', 'Merge after approval'],
    ARRAY['Auto-assign reviewers', 'Run CI/CD pipeline', 'Auto-deploy to staging'], 'active'),
('Sprint Planning',
    ARRAY['Review previous sprint retrospective', 'Prioritize backlog items', 'Estimate story points', 'Assign tasks to team members', 'Set sprint goals', 'Create sprint board', 'Send sprint summary to E-Board'],
    ARRAY['Auto-create sprint board', 'Send calendar invites', 'Generate progress reports'], 'active');