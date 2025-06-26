# 🚀 Supabase Setup Guide for SHPE FAU Tech Management System

## Quick Setup (15 minutes to live database)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended)
4. Create a new project:
   - **Name**: `SHPE FAU Tech Management`
   - **Database Password**: Choose a strong password
   - **Region**: US East (closest to Florida)

### Step 2: Set Up Database Schema
1. Go to your Supabase dashboard
2. Click **SQL Editor** in the sidebar
3. Click **New Query**
4. Copy and paste the entire `database/schema.sql` file
5. Click **Run** to create all tables and initial data

### Step 3: Get Your Project Credentials
1. Go to **Settings** > **API** in your Supabase dashboard
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

### Step 4: Configure Environment Variables
1. In your project root, create `.env.local`:
   ```bash
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```
2. Replace the values with your actual credentials from Step 3

### Step 5: Enable Authentication (Optional)
1. Go to **Authentication** > **Settings** in Supabase
2. Enable **Email** provider
3. Set **Site URL** to your GitHub Pages URL:
   ```
   https://yourusername.github.io/SHPE-FAU-Tech-Management-System
   ```

### Step 6: Test Your Setup
```bash
npm install
npm start
```

## 🎯 What You Get with Supabase Integration

### ✅ **Real-time Collaboration**
- Multiple team members can use the app simultaneously
- Live updates when anyone marks tasks complete
- Real-time workshop attendance tracking

### ✅ **Persistent Data**
- All data stored in PostgreSQL database
- Automatic backups by Supabase
- Never lose your progress

### ✅ **User Authentication**
- SHPE FAU members can sign in with email
- Role-based access control
- Secure data access

### ✅ **Advanced Features**
- File uploads for workshop materials
- Team member photo uploads
- Automated data syncing

### ✅ **Professional Grade**
- Industry-standard database
- Built-in API endpoints
- Scalable infrastructure

## 🔧 Database Schema Overview

Your database includes these tables:

### **Projects Table**
- Website Modernization tracking
- Mobile App Development roadmap
- Custom project creation

### **Tasks Table**
- Individual task management
- Real-time status updates
- Assignment tracking

### **Team Members Table**
- Skills and performance tracking
- Contact information
- GitHub integration ready

### **Workshops Table**
- Git/GitHub workshop template
- API Development workshop template
- Template progress tracking

### **Meetings & Automations**
- Meeting scheduling and agendas
- Automation status tracking
- Workflow management

## 🛡️ Security Features

### **Row Level Security (RLS)**
- Only authenticated SHPE members can access data
- Automatic user identification
- Secure by default

### **Environment Variables**
- API keys stored securely
- No sensitive data in code
- Easy credential rotation

## 📊 Real-time Features

### **Live Updates**
```javascript
// Automatic real-time subscriptions
supabaseHelpers.subscribeToTasks((payload) => {
  // Updates immediately when anyone changes tasks
});
```

### **Collaboration**
- See when teammates mark tasks complete
- Live workshop attendance updates
- Real-time team performance metrics

## 🔄 Data Migration

### **From localStorage Version**
The app automatically detects if you have existing localStorage data and offers to migrate it to Supabase.

### **Export/Import**
- Export all data as JSON
- Import data to new Supabase instance
- Backup and restore capabilities

## 🚀 Deployment with Supabase

### **Environment Variables for GitHub Pages**
1. In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions**
2. Add these secrets:
   - `REACT_APP_SUPABASE_URL`: Your Supabase project URL
   - `REACT_APP_SUPABASE_ANON_KEY`: Your anon key

### **Build Process**
```bash
# The build process automatically includes environment variables
npm run build
npm run deploy
```

## 🏠 Future: Self-Hosting on Your PC

### **When You're Ready**
Supabase can be self-hosted using Docker:

```bash
# Clone Supabase
git clone --depth 1 https://github.com/supabase/supabase

# Start local instance
cd supabase/docker
cp .env.example .env
docker-compose up
```

### **Migration Path**
1. **Phase 1**: Use hosted Supabase (free)
2. **Phase 2**: Upgrade to Supabase Pro if needed
3. **Phase 3**: Self-host on your PC server
4. **Easy Migration**: Export/import your data

## 🆘 Troubleshooting

### **Common Issues**

**1. Connection Error**
- Check your `.env.local` file has correct URLs
- Verify Supabase project is active

**2. Authentication Issues**
- Check Site URL in Supabase Auth settings
- Ensure it matches your GitHub Pages URL

**3. Permission Errors**
- Verify RLS policies are created
- Check user is authenticated

**4. Real-time Not Working**
- Ensure WebSocket connections are allowed
- Check browser console for errors

### **Testing Connection**
```javascript
// Test in browser console
import { supabase } from './src/lib/supabase.js'
const { data, error } = await supabase.from('projects').select('*')
console.log(data, error)
```

## 💡 Pro Tips

### **Development Workflow**
1. **Local Development**: Use Supabase hosted database
2. **Testing**: Create separate staging project
3. **Production**: Use the same database for your live site

### **Team Collaboration**
1. **Tech Chair**: Full admin access
2. **Team Members**: Can update tasks assigned to them
3. **SHPE Members**: Read-only access to view progress

### **Performance Optimization**
- Supabase includes built-in caching
- Real-time updates are efficient
- Automatic query optimization

---

## 🎯 Success Checklist

- ✅ Supabase project created
- ✅ Database schema deployed
- ✅ Environment variables configured
- ✅ Authentication enabled
- ✅ Local development working
- ✅ GitHub Pages deployment successful
- ✅ Real-time updates functioning
- ✅ Team can collaborate in real-time

**Total Setup Time**: ~15 minutes  
**Result**: Professional-grade database-powered project management system!