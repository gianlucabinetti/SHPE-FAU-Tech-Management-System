# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `npm start` - Start development server (React app)
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run deploy` - Deploy to GitHub Pages

### Database
- Database schema located at `database/schema.sql`
- Run schema in Supabase SQL Editor to set up database
- Environment variables needed: `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`

## Project Architecture

### Tech Stack
- **Frontend**: React 18 with functional components and hooks
- **UI**: Tailwind CSS for styling, Lucide React for icons
- **State Management**: localStorage for local mode, Supabase for database mode
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Deployment**: GitHub Pages

### Core Architecture
This is a SHPE FAU Tech Chair management system with dual-mode operation:

1. **Local Mode**: Data stored in localStorage with immediate persistence
2. **Database Mode**: Supabase integration with real-time collaboration

### Key Components

#### Main Application (`src/app.js`)
- Single-page application with tab-based navigation
- State management using React hooks
- Automatic localStorage persistence
- Real-time progress calculation

#### Database Layer (`src/lib/supabase.js`)
- Supabase client configuration
- Database helper functions for CRUD operations
- Real-time subscription management
- Environment variable configuration

#### Data Structure
- **Projects**: Main project tracking with tasks, phases, and progress
- **Tasks**: Individual actionable items linked to projects
- **Team Members**: Developer profiles with skills and performance metrics
- **Workshops**: Educational event planning and template management
- **Meetings**: Recurring meeting management
- **Automations**: Workflow automation tracking

### Database Schema
PostgreSQL tables:
- `projects` - Project management with status and progress tracking
- `tasks` - Individual tasks with assignees and due dates
- `team_members` - Developer profiles and skill tracking
- `workshops` - Educational workshop planning
- `meetings` - Meeting scheduling and agenda management
- `automations` - Workflow automation status

### Real-time Features
- Live task status updates across multiple users
- Real-time progress calculation
- Collaborative workshop planning
- Instant data synchronization via Supabase subscriptions

### Development Patterns
- Component-based architecture with functional components
- localStorage fallback for offline functionality
- Real-time state updates using Supabase channels
- Responsive design with Tailwind CSS
- Interactive task completion with checkbox UI

### Deployment
- GitHub Pages deployment from `build/` directory
- Environment variables for Supabase configuration
- Static site generation with React build process