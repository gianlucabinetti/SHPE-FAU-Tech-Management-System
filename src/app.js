import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Users, Code, GitBranch, Target, Plus, Edit3, Trash2, Clock, Award, TrendingUp, Bell, Settings, Database, Cloud } from 'lucide-react';
import { supabase, supabaseHelpers } from './lib/supabase';
import './app.css';

const TechChairTracker = () => {
  // Load data from localStorage on component mount
  const loadFromStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  // Save data to localStorage
  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [showWorkshopModal, setShowWorkshopModal] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingTaskProjectId, setEditingTaskProjectId] = useState(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState(null);
  const [databaseMode, setDatabaseMode] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState({ name: 'Tech Chair', isLoggedIn: true });
  
  const [projects, setProjects] = useState(() => loadFromStorage('projects', [
    {
      id: 1,
      name: 'Website Modernization',
      phase: 'Phase 2',
      status: 'Not Started',
      priority: 'High',
      startDate: '2025-08-15',
      endDate: '2025-09-30',
      progress: 0,
      teamMembers: [],
      tasks: [
        { id: 1, name: 'Current website audit', status: 'pending', assignee: '', dueDate: '2025-08-20' },
        { id: 2, name: 'Performance analysis', status: 'pending', assignee: '', dueDate: '2025-08-22' },
        { id: 3, name: 'UI/UX improvements backlog', status: 'pending', assignee: '', dueDate: '2025-08-25' },
        { id: 4, name: 'Mobile responsiveness fixes', status: 'pending', assignee: '', dueDate: '2025-09-05' },
        { id: 5, name: 'SEO optimization', status: 'pending', assignee: '', dueDate: '2025-09-15' },
        { id: 6, name: 'Content management system update', status: 'pending', assignee: '', dueDate: '2025-09-25' }
      ]
    },
    {
      id: 2,
      name: 'Mobile App Development',
      phase: 'Phase 3',
      status: 'Planning',
      priority: 'High',
      startDate: '2025-09-01',
      endDate: '2026-05-15',
      progress: 0,
      teamMembers: [],
      tasks: [
        { id: 1, name: 'Technical architecture design', status: 'pending', assignee: '', dueDate: '2025-09-15' },
        { id: 2, name: 'UI/UX wireframes', status: 'pending', assignee: '', dueDate: '2025-09-20' },
        { id: 3, name: 'Development environment setup', status: 'pending', assignee: '', dueDate: '2025-09-25' },
        { id: 4, name: 'Authentication system', status: 'pending', assignee: '', dueDate: '2025-10-15' },
        { id: 5, name: 'Event management features', status: 'pending', assignee: '', dueDate: '2025-11-15' },
        { id: 6, name: 'Member directory', status: 'pending', assignee: '', dueDate: '2025-12-15' },
        { id: 7, name: 'Beta testing with members', status: 'pending', assignee: '', dueDate: '2026-03-15' },
        { id: 8, name: 'App store deployment', status: 'pending', assignee: '', dueDate: '2026-05-01' }
      ]
    }
  ]));

  const [teamMembers, setTeamMembers] = useState(() => loadFromStorage('teamMembers', [
    { id: 1, name: 'Frontend Developer 1', role: 'Frontend Lead', skills: ['React', 'CSS', 'JavaScript'], availability: 'Full-time', performance: 85 },
    { id: 2, name: 'Backend Developer 1', role: 'Backend Lead', skills: ['Node.js', 'Python', 'Database'], availability: 'Part-time', performance: 90 },
    { id: 3, name: 'UI/UX Designer', role: 'Design Lead', skills: ['Figma', 'User Research', 'Prototyping'], availability: 'Full-time', performance: 88 },
    { id: 4, name: 'Mobile Developer', role: 'Mobile Lead', skills: ['React Native', 'Flutter', 'iOS/Android'], availability: 'Part-time', performance: 82 }
  ]));

  const [workflows] = useState(() => loadFromStorage('workflows', [
    {
      id: 1,
      name: 'Pull Request Process',
      steps: [
        'Create feature branch from main',
        'Implement feature with proper commits',
        'Write/update tests',
        'Create PR with description template',
        'Request 2 code reviewers',
        'Address review feedback',
        'Merge after approval'
      ],
      automations: ['Auto-assign reviewers', 'Run CI/CD pipeline', 'Auto-deploy to staging'],
      status: 'active'
    },
    {
      id: 2,
      name: 'Sprint Planning',
      steps: [
        'Review previous sprint retrospective',
        'Prioritize backlog items',
        'Estimate story points',
        'Assign tasks to team members',
        'Set sprint goals',
        'Create sprint board',
        'Send sprint summary to E-Board'
      ],
      automations: ['Auto-create sprint board', 'Send calendar invites', 'Generate progress reports'],
      status: 'active'
    }
  ]));

  const [workshops, setWorkshops] = useState(() => loadFromStorage('workshops', [
    { 
      id: 1, 
      title: 'Git/GitHub Workshop', 
      subtitle: 'Essential Version Control for Engineers',
      date: '2025-09-15', 
      attendees: 0, 
      status: 'template-needed', 
      priority: 'high',
      topics: ['Version control basics', 'Pull requests', 'Collaborative coding', 'Mini hackathon'], 
      templateStatus: 'not-started',
      description: 'Essential for any engineering role. Cover basics like version control, pull requests, and collaborative coding. You could even do a mini hackathon where teams contribute to a shared project.',
      deliverables: [
        'Shared project repository for mini hackathon',
        'Git commands cheat sheet',
        'PR workflow templates',
        'Collaboration best practices guide'
      ]
    },
    { 
      id: 2, 
      title: 'API Development Workshop', 
      subtitle: 'Building Connected Applications',
      date: '2025-10-15', 
      attendees: 0, 
      status: 'template-needed', 
      priority: 'high',
      topics: ['REST API creation', 'Authentication', 'Database integration', 'Third-party services', 'Deployment'], 
      templateStatus: 'not-started',
      description: 'Create and deploy your first REST API from scratch. Learn to build endpoints, handle authentication, connect to databases, and integrate third-party services. By the end, you\'ll have a working API deployed online.',
      deliverables: [
        'API starter template',
        'Database setup scripts',
        'Authentication implementation',
        'Deployment guide',
        'Working deployed API'
      ]
    },
    { 
      id: 3, 
      title: 'Workshop 3', 
      subtitle: 'TBD',
      date: '2025-11-15', 
      attendees: 0, 
      status: 'template-needed', 
      priority: 'medium',
      topics: [], 
      templateStatus: 'not-started',
      description: 'Workshop topic to be determined',
      deliverables: []
    },
    { 
      id: 4, 
      title: 'Workshop 4', 
      subtitle: 'TBD',
      date: '2025-12-15', 
      attendees: 0, 
      status: 'template-needed', 
      priority: 'medium',
      topics: [], 
      templateStatus: 'not-started',
      description: 'Workshop topic to be determined',
      deliverables: []
    }
  ]));

  const [meetings, setMeetings] = useState(() => loadFromStorage('meetings', [
    { id: 1, title: 'E-Board Sync', type: 'recurring', frequency: 'bi-weekly', nextDate: '2025-08-15', agenda: ['Project updates', 'Budget discussion', 'Event planning'] },
    { id: 2, title: 'Tech Committee Meeting', type: 'recurring', frequency: 'weekly', nextDate: '2025-08-12', agenda: ['Code review', 'Sprint planning', 'Pair programming'] },
    { id: 3, title: 'Team Standup', type: 'recurring', frequency: 'daily', nextDate: '2025-08-05', agenda: ['Yesterday progress', 'Today plans', 'Blockers'] }
  ]));

  const [automations, setAutomations] = useState(() => loadFromStorage('automations', [
    { id: 1, name: 'Daily Progress Reports', description: 'Auto-generate team progress summaries', status: 'active', frequency: 'daily' },
    { id: 2, name: 'Meeting Reminders', description: 'Send calendar reminders with agendas', status: 'active', frequency: 'as-needed' },
    { id: 3, name: 'Code Review Assignments', description: 'Auto-assign reviewers based on expertise', status: 'active', frequency: 'on-PR' },
    { id: 4, name: 'Sprint Reports', description: 'Weekly sprint progress to E-Board', status: 'active', frequency: 'weekly' },
    { id: 5, name: 'Workshop Attendance Tracking', description: 'Auto-track and follow up on workshop attendance', status: 'active', frequency: 'post-event' }
  ]));

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage('projects', projects);
  }, [projects]);

  useEffect(() => {
    saveToStorage('teamMembers', teamMembers);
  }, [teamMembers]);

  useEffect(() => {
    saveToStorage('workflows', workflows);
  }, [workflows]);

  useEffect(() => {
    saveToStorage('workshops', workshops);
  }, [workshops]);

  useEffect(() => {
    saveToStorage('meetings', meetings);
  }, [meetings]);

  useEffect(() => {
    saveToStorage('automations', automations);
  }, [automations]);

  // Database connection status check
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase
          .from('projects')
          .select('count')
          .limit(1);
        
        if (!error) {
          setIsConnected(true);
        }
      } catch (err) {
        setIsConnected(false);
      }
    };

    if (databaseMode) {
      checkConnection();
    }
  }, [databaseMode]);

  // Load data from Supabase when in database mode
  useEffect(() => {
    const loadDataFromDatabase = async () => {
      if (!databaseMode || !isConnected) return;
      
      try {
        const [projectsData, teamData, workshopsData, meetingsData, automationsData] = await Promise.all([
          supabaseHelpers.getProjects(),
          supabaseHelpers.getTeamMembers(),
          supabaseHelpers.getWorkshops(),
          supabaseHelpers.getMeetings(),
          supabaseHelpers.getAutomations()
        ]);
        
        if (projectsData) setProjects(projectsData);
        if (teamData) setTeamMembers(teamData);
        if (workshopsData) setWorkshops(workshopsData);
        if (meetingsData) setMeetings(meetingsData);
        if (automationsData) setAutomations(automationsData);
        
        alert('Data loaded from Supabase successfully!');
      } catch (error) {
        console.error('Error loading from database:', error);
        alert('Failed to load data from database. Check your connection.');
      }
    };

    loadDataFromDatabase();
  }, [databaseMode, isConnected]);

  // Sync data to Supabase in real-time when in database mode
  const syncToDatabase = async (type, operation, data, id = null) => {
    if (!databaseMode || !isConnected) return;
    
    try {
      switch (type) {
        case 'projects':
          if (operation === 'create') {
            await supabaseHelpers.createProject(data);
          } else if (operation === 'update') {
            await supabaseHelpers.updateProject(id, data);
          }
          break;
        case 'tasks':
          if (operation === 'create') {
            await supabaseHelpers.createTask(data);
          } else if (operation === 'update') {
            await supabaseHelpers.updateTaskStatus(id, data.status);
          }
          break;
        case 'team_members':
          if (operation === 'create') {
            await supabaseHelpers.createTeamMember(data);
          } else if (operation === 'update') {
            await supabaseHelpers.updateTeamMember(id, data);
          }
          break;
        case 'workshops':
          if (operation === 'create') {
            await supabaseHelpers.createWorkshop(data);
          } else if (operation === 'update') {
            await supabaseHelpers.updateWorkshop(id, data);
          }
          break;
        default:
          console.warn(`Unknown sync type: ${type}`);
          break;
      }
    } catch (error) {
      console.error(`Error syncing ${type}:`, error);
    }
  };

  // Task status update function
  const updateTaskStatus = async (projectId, taskId, newStatus) => {
    setProjects(prevProjects => 
      prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task => 
              task.id === taskId ? { ...task, status: newStatus } : task
            )
          };
        }
        return project;
      })
    );
    
    // Sync to database if in database mode
    if (databaseMode) {
      await syncToDatabase('tasks', 'update', { status: newStatus }, taskId);
    }
  };

  // Workshop template status update
  const updateWorkshopTemplateStatus = (workshopId, newStatus) => {
    setWorkshops(prevWorkshops =>
      prevWorkshops.map(workshop =>
        workshop.id === workshopId 
          ? { ...workshop, templateStatus: newStatus }
          : workshop
      )
    );
  };

  // Project CRUD operations
  const addProject = async (projectData) => {
    const newProject = {
      id: Math.max(...projects.map(p => p.id), 0) + 1,
      ...projectData,
      tasks: [],
      teamMembers: [],
      progress: 0
    };
    setProjects(prev => [...prev, newProject]);
    
    // Sync to database if in database mode
    if (databaseMode) {
      await syncToDatabase('projects', 'create', newProject);
    }
  };

  const updateProject = async (projectId, updates) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId ? { ...project, ...updates } : project
    ));
    
    // Sync to database if in database mode
    if (databaseMode) {
      await syncToDatabase('projects', 'update', updates, projectId);
    }
  };

  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };


  // Team member CRUD operations
  const addTeamMember = (memberData) => {
    const newMember = {
      id: Math.max(...teamMembers.map(m => m.id), 0) + 1,
      ...memberData,
      skills: memberData.skills || [],
      performance: memberData.performance || 85
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const updateTeamMember = (memberId, updates) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, ...updates } : member
    ));
  };

  const deleteTeamMember = (memberId) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
  };

  // Workshop CRUD operations
  const addWorkshop = (workshopData) => {
    const newWorkshop = {
      id: Math.max(...workshops.map(w => w.id), 0) + 1,
      ...workshopData,
      attendees: 0,
      status: 'template-needed',
      templateStatus: 'not-started',
      topics: workshopData.topics || [],
      deliverables: workshopData.deliverables || []
    };
    setWorkshops(prev => [...prev, newWorkshop]);
  };

  const updateWorkshop = (workshopId, updates) => {
    setWorkshops(prev => prev.map(workshop => 
      workshop.id === workshopId ? { ...workshop, ...updates } : workshop
    ));
  };

  const deleteWorkshop = (workshopId) => {
    setWorkshops(prev => prev.filter(workshop => workshop.id !== workshopId));
  };

  // Task CRUD operations
  const addTask = (projectId, taskData) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        const newTask = {
          id: Math.max(...project.tasks.map(t => t.id), 0) + 1,
          ...taskData,
          status: taskData.status || 'pending'
        };
        return {
          ...project,
          tasks: [...project.tasks, newTask]
        };
      }
      return project;
    }));
  };

  const updateTask = (projectId, taskId, updates) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        };
      }
      return project;
    }));
  };

  const deleteTask = (projectId, taskId) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.filter(task => task.id !== taskId)
        };
      }
      return project;
    }));
  };

  // Meeting CRUD operations
  const addMeeting = (meetingData) => {
    const newMeeting = {
      id: Math.max(...meetings.map(m => m.id), 0) + 1,
      ...meetingData,
      agenda: meetingData.agenda || []
    };
    setMeetings(prev => [...prev, newMeeting]);
  };

  const updateMeeting = (meetingId, updates) => {
    setMeetings(prev => prev.map(meeting => 
      meeting.id === meetingId ? { ...meeting, ...updates } : meeting
    ));
  };

  const deleteMeeting = (meetingId) => {
    setMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
  };

  // Automation CRUD operations
  const addAutomation = (automationData) => {
    const newAutomation = {
      id: Math.max(...automations.map(a => a.id), 0) + 1,
      ...automationData,
      status: automationData.status || 'active'
    };
    setAutomations(prev => [...prev, newAutomation]);
  };

  const updateAutomation = (automationId, updates) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === automationId ? { ...automation, ...updates } : automation
    ));
  };

  const deleteAutomation = (automationId) => {
    setAutomations(prev => prev.filter(automation => automation.id !== automationId));
  };

  // Authentication functions
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout? Your local data will be preserved.')) {
      setUser({ name: '', isLoggedIn: false });
      // Could redirect to login page or show login form
      alert('Logged out successfully. Refresh the page to log back in.');
    }
  };

  const calculateProjectProgress = (project) => {
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'blocked': return 'text-red-600 bg-red-100';
      case 'template-needed': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': case 'high': return 'text-red-600 bg-red-100';
      case 'Medium': case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Rest of your component code remains the same...
  // (Include all the tab components here - DashboardTab, ProjectsTab, etc.)
  
  const DashboardTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Workshops</p>
              <p className="text-2xl font-bold text-gray-900">{workshops.filter(w => w.status === 'template-needed' || w.status === 'planned').length}</p>
            </div>
            <Award className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Automations</p>
              <p className="text-2xl font-bold text-gray-900">{automations.filter(a => a.status === 'active').length}</p>
            </div>
            <Settings className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Project Progress
          </h3>
          <div className="space-y-4">
            {projects.map(project => {
              const progress = calculateProjectProgress(project);
              return (
                <div key={project.id} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{project.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{project.phase}</span>
                    <span>{progress}% complete</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-green-500" />
            Upcoming Deadlines
          </h3>
          <div className="space-y-3">
            {projects.flatMap(project => 
              project.tasks
                .filter(task => task.status === 'pending')
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .slice(0, 5)
                .map(task => (
                  <div key={`${project.id}-${task.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-sm">{task.name}</p>
                      <p className="text-xs text-gray-500">{project.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{new Date(task.dueDate).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">
                        {Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Bell className="h-5 w-5 mr-2 text-yellow-500" />
          Quick Actions & Data Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => {
              const dataToExport = {
                projects,
                teamMembers,
                workshops,
                meetings,
                automations,
                exportDate: new Date().toISOString()
              };
              const dataStr = JSON.stringify(dataToExport, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `shpe-tech-chair-data-${new Date().toISOString().split('T')[0]}.json`;
              link.click();
            }}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Plus className="h-6 w-6 mx-auto mb-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Export Data</span>
          </button>
          <label className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer">
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const importedData = JSON.parse(event.target.result);
                      if (window.confirm('This will replace all current data. Are you sure?')) {
                        if (importedData.projects) setProjects(importedData.projects);
                        if (importedData.teamMembers) setTeamMembers(importedData.teamMembers);
                        if (importedData.workshops) setWorkshops(importedData.workshops);
                        if (importedData.meetings) setMeetings(importedData.meetings);
                        if (importedData.automations) setAutomations(importedData.automations);
                        alert('Data imported successfully!');
                      }
                    } catch (error) {
                      alert('Invalid JSON file. Please check the format.');
                    }
                  };
                  reader.readAsText(file);
                }
                e.target.value = '';
              }}
            />
            <Users className="h-6 w-6 mx-auto mb-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Import Data</span>
          </label>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <Users className="h-6 w-6 mx-auto mb-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Schedule Team Meeting</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <Award className="h-6 w-6 mx-auto mb-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Plan Workshop</span>
          </button>
        </div>
        
        {!isConnected && databaseMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <Cloud className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Supabase Setup Required</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  To use database mode, configure your Supabase credentials:
                </p>
                <ul className="text-xs text-yellow-600 mt-2 space-y-1">
                  <li>1. Set REACT_APP_SUPABASE_URL in your environment</li>
                  <li>2. Set REACT_APP_SUPABASE_ANON_KEY in your environment</li>
                  <li>3. Run the schema.sql in your Supabase SQL Editor</li>
                  <li>4. Refresh the page to connect</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {isConnected && databaseMode && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Cloud className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-green-800">Database Connected</h4>
                <p className="text-sm text-green-700">Real-time collaboration enabled with Supabase.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Project Modal Component
  const ProjectModal = ({ editingProject }) => {
    const [formData, setFormData] = useState({
      name: '',
      phase: '',
      status: 'Not Started',
      priority: 'Medium',
      startDate: '',
      endDate: '',
      description: ''
    });

    React.useEffect(() => {
      if (editingProject) {
        setFormData({
          name: editingProject.name || '',
          phase: editingProject.phase || '',
          status: editingProject.status || 'Not Started',
          priority: editingProject.priority || 'Medium',
          startDate: editingProject.startDate || '',
          endDate: editingProject.endDate || '',
          description: editingProject.description || ''
        });
      }
    }, [editingProject]);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (editingProject) {
        updateProject(editingProject.id, formData);
      } else {
        addProject(formData);
      }
      setShowProjectModal(false);
      setEditingProject(null);
      setFormData({
        name: '',
        phase: '',
        status: 'Not Started',
        priority: 'Medium',
        startDate: '',
        endDate: '',
        description: ''
      });
    };

    const handleClose = () => {
      setShowProjectModal(false);
      setEditingProject(null);
      setFormData({
        name: '',
        phase: '',
        status: 'Not Started',
        priority: 'Medium',
        startDate: '',
        endDate: '',
        description: ''
      });
    };

    if (!showProjectModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phase
              </label>
              <input
                type="text"
                value={formData.phase}
                onChange={(e) => setFormData({...formData, phase: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Phase 1, Phase 2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Project description..."
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                {editingProject ? 'Update' : 'Create'} Project
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Team Member Modal Component
  const TeamModal = ({ editingTeamMember }) => {
    const [formData, setFormData] = useState({
      name: '',
      role: '',
      skills: '',
      availability: 'Part-time',
      performance: 85
    });

    React.useEffect(() => {
      if (editingTeamMember) {
        setFormData({
          name: editingTeamMember.name || '',
          role: editingTeamMember.role || '',
          skills: editingTeamMember.skills ? editingTeamMember.skills.join(', ') : '',
          availability: editingTeamMember.availability || 'Part-time',
          performance: editingTeamMember.performance || 85
        });
      }
    }, [editingTeamMember]);

    const handleSubmit = (e) => {
      e.preventDefault();
      const memberData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        performance: parseInt(formData.performance)
      };
      
      if (editingTeamMember) {
        updateTeamMember(editingTeamMember.id, memberData);
      } else {
        addTeamMember(memberData);
      }
      setShowTeamModal(false);
      setEditingTeamMember(null);
      setFormData({
        name: '',
        role: '',
        skills: '',
        availability: 'Part-time',
        performance: 85
      });
    };

    const handleClose = () => {
      setShowTeamModal(false);
      setEditingTeamMember(null);
      setFormData({
        name: '',
        role: '',
        skills: '',
        availability: 'Part-time',
        performance: 85
      });
    };

    if (!showTeamModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">
            {editingTeamMember ? 'Edit Team Member' : 'Add New Team Member'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Frontend Lead, Backend Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., React, JavaScript, CSS"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({...formData, availability: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Volunteer">Volunteer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Performance %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.performance}
                  onChange={(e) => setFormData({...formData, performance: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                {editingTeamMember ? 'Update' : 'Add'} Member
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Task Modal Component
  const TaskModal = ({ editingTask, editingTaskProjectId }) => {
    const [formData, setFormData] = useState({
      name: '',
      status: 'pending',
      assignee: '',
      dueDate: '',
      description: ''
    });

    React.useEffect(() => {
      if (editingTask) {
        setFormData({
          name: editingTask.name || '',
          status: editingTask.status || 'pending',
          assignee: editingTask.assignee || '',
          dueDate: editingTask.dueDate || '',
          description: editingTask.description || ''
        });
      }
    }, [editingTask]);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (editingTask && editingTaskProjectId) {
        updateTask(editingTaskProjectId, editingTask.id, formData);
      } else if (editingTaskProjectId) {
        addTask(editingTaskProjectId, formData);
      }
      setShowTaskModal(false);
      setEditingTask(null);
      setEditingTaskProjectId(null);
      setFormData({
        name: '',
        status: 'pending',
        assignee: '',
        dueDate: '',
        description: ''
      });
    };

    const handleClose = () => {
      setShowTaskModal(false);
      setEditingTask(null);
      setEditingTaskProjectId(null);
      setFormData({
        name: '',
        status: 'pending',
        assignee: '',
        dueDate: '',
        description: ''
      });
    };

    if (!showTaskModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">
            {editingTask ? 'Edit Task' : 'Add New Task'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              <select
                value={formData.assignee}
                onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Unassigned</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.name}>{member.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Task description..."
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                {editingTask ? 'Update' : 'Create'} Task
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Meeting Modal Component
  const MeetingModal = ({ editingMeeting }) => {
    const [formData, setFormData] = useState({
      title: '',
      type: 'one-time',
      frequency: 'weekly',
      nextDate: '',
      agenda: ''
    });

    React.useEffect(() => {
      if (editingMeeting) {
        setFormData({
          title: editingMeeting.title || '',
          type: editingMeeting.type || 'one-time',
          frequency: editingMeeting.frequency || 'weekly',
          nextDate: editingMeeting.nextDate || '',
          agenda: editingMeeting.agenda ? editingMeeting.agenda.join(', ') : ''
        });
      }
    }, [editingMeeting]);

    const handleSubmit = (e) => {
      e.preventDefault();
      const meetingData = {
        ...formData,
        agenda: formData.agenda.split(',').map(s => s.trim()).filter(s => s)
      };
      
      if (editingMeeting) {
        updateMeeting(editingMeeting.id, meetingData);
      } else {
        addMeeting(meetingData);
      }
      setShowMeetingModal(false);
      setEditingMeeting(null);
      setFormData({
        title: '',
        type: 'one-time',
        frequency: 'weekly',
        nextDate: '',
        agenda: ''
      });
    };

    const handleClose = () => {
      setShowMeetingModal(false);
      setEditingMeeting(null);
      setFormData({
        title: '',
        type: 'one-time',
        frequency: 'weekly',
        nextDate: '',
        agenda: ''
      });
    };

    if (!showMeetingModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">
            {editingMeeting ? 'Edit Meeting' : 'Schedule New Meeting'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="one-time">One-time</option>
                  <option value="recurring">Recurring</option>
                </select>
              </div>
              {formData.type === 'recurring' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Next Meeting Date
              </label>
              <input
                type="date"
                value={formData.nextDate}
                onChange={(e) => setFormData({...formData, nextDate: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agenda Items (comma-separated)
              </label>
              <textarea
                value={formData.agenda}
                onChange={(e) => setFormData({...formData, agenda: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="e.g., Project updates, Code review, Sprint planning"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-purple-500 rounded-md hover:bg-purple-600"
              >
                {editingMeeting ? 'Update' : 'Schedule'} Meeting
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Automation Modal Component
  const AutomationModal = ({ editingAutomation }) => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      frequency: 'daily',
      status: 'active'
    });

    React.useEffect(() => {
      if (editingAutomation) {
        setFormData({
          name: editingAutomation.name || '',
          description: editingAutomation.description || '',
          frequency: editingAutomation.frequency || 'daily',
          status: editingAutomation.status || 'active'
        });
      }
    }, [editingAutomation]);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (editingAutomation) {
        updateAutomation(editingAutomation.id, formData);
      } else {
        addAutomation(formData);
      }
      setShowAutomationModal(false);
      setEditingAutomation(null);
      setFormData({
        name: '',
        description: '',
        frequency: 'daily',
        status: 'active'
      });
    };

    const handleClose = () => {
      setShowAutomationModal(false);
      setEditingAutomation(null);
      setFormData({
        name: '',
        description: '',
        frequency: 'daily',
        status: 'active'
      });
    };

    if (!showAutomationModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">
            {editingAutomation ? 'Edit Automation' : 'Add New Automation'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Automation Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="What does this automation do?"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="on-demand">On Demand</option>
                  <option value="on-PR">On PR</option>
                  <option value="as-needed">As Needed</option>
                  <option value="post-event">Post Event</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="testing">Testing</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
              >
                {editingAutomation ? 'Update' : 'Create'} Automation
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Workshop Modal Component
  const WorkshopModal = ({ editingWorkshop }) => {
    const [formData, setFormData] = useState({
      title: '',
      subtitle: '',
      date: '',
      priority: 'medium',
      description: '',
      topics: '',
      deliverables: ''
    });

    React.useEffect(() => {
      if (editingWorkshop) {
        setFormData({
          title: editingWorkshop.title || '',
          subtitle: editingWorkshop.subtitle || '',
          date: editingWorkshop.date || '',
          priority: editingWorkshop.priority || 'medium',
          description: editingWorkshop.description || '',
          topics: editingWorkshop.topics ? editingWorkshop.topics.join(', ') : '',
          deliverables: editingWorkshop.deliverables ? editingWorkshop.deliverables.join(', ') : ''
        });
      }
    }, [editingWorkshop]);

    const handleSubmit = (e) => {
      e.preventDefault();
      const workshopData = {
        ...formData,
        topics: formData.topics.split(',').map(s => s.trim()).filter(s => s),
        deliverables: formData.deliverables.split(',').map(s => s.trim()).filter(s => s)
      };
      
      if (editingWorkshop) {
        updateWorkshop(editingWorkshop.id, workshopData);
      } else {
        addWorkshop(workshopData);
      }
      setShowWorkshopModal(false);
      setEditingWorkshop(null);
      setFormData({
        title: '',
        subtitle: '',
        date: '',
        priority: 'medium',
        description: '',
        topics: '',
        deliverables: ''
      });
    };

    const handleClose = () => {
      setShowWorkshopModal(false);
      setEditingWorkshop(null);
      setFormData({
        title: '',
        subtitle: '',
        date: '',
        priority: 'medium',
        description: '',
        topics: '',
        deliverables: ''
      });
    };

    if (!showWorkshopModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            {editingWorkshop ? 'Edit Workshop' : 'Plan New Workshop'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workshop Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Workshop description and objectives..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topics (comma-separated)
              </label>
              <input
                type="text"
                value={formData.topics}
                onChange={(e) => setFormData({...formData, topics: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Version control basics, Pull requests, Collaborative coding"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deliverables (comma-separated)
              </label>
              <input
                type="text"
                value={formData.deliverables}
                onChange={(e) => setFormData({...formData, deliverables: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Git commands cheat sheet, PR workflow templates"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600"
              >
                {editingWorkshop ? 'Update' : 'Create'} Workshop
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Add simplified versions of other tabs for space
  const ProjectsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Management</h2>
        <button 
          onClick={() => setShowProjectModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </button>
      </div>

      {projects.map(project => (
        <div key={project.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold">{project.name}</h3>
              <p className="text-gray-600">{project.phase} • {project.startDate} - {project.endDate}</p>
            </div>
            <div className="flex gap-2 items-center">
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(project.priority)}`}>
                {project.priority}
              </span>
              <button
                onClick={() => {
                  setEditingProject(project);
                  setShowProjectModal(true);
                }}
                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this project?')) {
                    deleteProject(project.id);
                  }
                }}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{calculateProjectProgress(project)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${calculateProjectProgress(project)}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-3">Team Members</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.teamMembers && project.teamMembers.length > 0 ? (
                project.teamMembers.map(memberId => {
                  const member = teamMembers.find(m => m.id === memberId);
                  return member ? (
                    <div key={member.id} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      <span>{member.name}</span>
                      <button
                        onClick={() => {
                          updateProject(project.id, {
                            teamMembers: project.teamMembers.filter(id => id !== memberId)
                          });
                        }}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </div>
                  ) : null;
                })
              ) : (
                <span className="text-sm text-gray-500">No team members assigned</span>
              )}
              <select
                onChange={(e) => {
                  const memberId = parseInt(e.target.value);
                  if (memberId && !(project.teamMembers || []).includes(memberId)) {
                    updateProject(project.id, {
                      teamMembers: [...(project.teamMembers || []), memberId]
                    });
                  }
                  e.target.value = '';
                }}
                className="text-xs border border-gray-300 rounded px-2 py-1"
                defaultValue=""
              >
                <option value="">+ Add Member</option>
                {teamMembers
                  .filter(member => !(project.teamMembers || []).includes(member.id))
                  .map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))
                }
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Tasks</h4>
              <button
                onClick={() => {
                  setEditingTaskProjectId(project.id);
                  setShowTaskModal(true);
                }}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                <Plus className="h-3 w-3 inline mr-1" />
                Add Task
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {project.tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center">
                    <button 
                      onClick={() => updateTaskStatus(project.id, task.id, task.status === 'completed' ? 'pending' : 'completed')}
                      className="mr-3"
                    >
                      <CheckCircle className={`h-4 w-4 ${task.status === 'completed' ? 'text-green-500' : 'text-gray-300'}`} />
                    </button>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Due: {task.dueDate}</span>
                        {task.assignee && <span>• Assigned: {task.assignee}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setEditingTaskProjectId(project.id);
                        setShowTaskModal(true);
                      }}
                      className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this task?')) {
                          deleteTask(project.id, task.id);
                        }
                      }}
                      className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Simplified other tabs...
  const TeamTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Management</h2>
        <button 
          onClick={() => setShowTeamModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map(member => (
          <div key={member.id} className="bg-white border p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
                <p className="text-xs text-gray-500">{member.availability}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditingTeamMember(member);
                    setShowTeamModal(true);
                  }}
                  className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
                >
                  <Edit3 className="h-3 w-3" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to remove this team member?')) {
                      deleteTeamMember(member.id);
                    }
                  }}
                  className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {member.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Performance</span>
                <span>{member.performance}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${member.performance}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const WorkshopsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Technical Workshops</h2>
        <button 
          onClick={() => setShowWorkshopModal(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Plan Workshop
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workshops.map(workshop => (
          <div key={workshop.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{workshop.title}</h3>
                <p className="text-sm text-gray-600 font-medium">{workshop.subtitle}</p>
                <p className="text-gray-500 text-sm">{new Date(workshop.date).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(workshop.priority)}`}>
                  {workshop.priority} priority
                </span>
                <button
                  onClick={() => updateWorkshopTemplateStatus(workshop.id, 
                    workshop.templateStatus === 'completed' ? 'not-started' : 'completed'
                  )}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                    workshop.templateStatus === 'completed' ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100'
                  }`}
                >
                  Template: {workshop.templateStatus}
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingWorkshop(workshop);
                      setShowWorkshopModal(true);
                    }}
                    className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this workshop?')) {
                        deleteWorkshop(workshop.id);
                      }
                    }}
                    className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-3">{workshop.description}</p>
              
              {workshop.topics.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-medium mb-2 text-sm">Key Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {workshop.topics.map((topic, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {workshop.deliverables && workshop.deliverables.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-sm">Deliverables</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {workshop.deliverables.map((deliverable, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Workflows Tab
  const WorkflowsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Development Workflows</h2>
        <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Workflow
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workflows.map(workflow => (
          <div key={workflow.id} className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{workflow.name}</h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                  workflow.status === 'active' ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                }`}>
                  {workflow.status}
                </span>
              </div>
              <div className="flex gap-1">
                <button className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-3 text-sm">Workflow Steps</h4>
              <ol className="space-y-2">
                {workflow.steps.map((step, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-sm">Automations</h4>
              <div className="flex flex-wrap gap-2">
                {workflow.automations.map((automation, index) => (
                  <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                    {automation}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                View Details
              </button>
              <button 
                onClick={() => {
                  // Toggle workflow status - placeholder functionality
                  alert(`Workflow ${workflow.status === 'active' ? 'deactivated' : 'activated'}`);
                }}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  workflow.status === 'active' 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {workflow.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-dashed border-gray-300">
        <div className="text-center">
          <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Custom Workflow</h3>
          <p className="text-gray-600 mb-4">
            Design your own development workflow with custom steps and automations
          </p>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );

  const MeetingsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meetings & Communication</h2>
        <button 
          onClick={() => setShowMeetingModal(true)}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Meeting
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.map(meeting => (
          <div key={meeting.id} className="bg-white p-4 rounded-lg shadow-md border">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{meeting.title}</h3>
                <p className="text-sm text-gray-600">{meeting.type} • {meeting.frequency}</p>
                <p className="text-xs text-gray-500">Next: {new Date(meeting.nextDate).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  meeting.type === 'recurring' ? 'text-blue-600 bg-blue-100' : 'text-green-600 bg-green-100'
                }`}>
                  {meeting.type}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingMeeting(meeting);
                      setShowMeetingModal(true);
                    }}
                    className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this meeting?')) {
                        deleteMeeting(meeting.id);
                      }
                    }}
                    className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-sm">Agenda</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {meeting.agenda.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AutomationTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Automation & Tools</h2>
        <button 
          onClick={() => setShowAutomationModal(true)}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Automation
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automations.map(automation => (
          <div key={automation.id} className="bg-white p-4 rounded-lg shadow-md border">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{automation.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{automation.description}</p>
                <p className="text-xs text-gray-500">Frequency: {automation.frequency}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  automation.status === 'active' ? 'text-green-600 bg-green-100' : 
                  automation.status === 'testing' ? 'text-yellow-600 bg-yellow-100' :
                  'text-gray-600 bg-gray-100'
                }`}>
                  {automation.status}
                </span>
                <button
                  onClick={() => {
                    setEditingAutomation(automation);
                    setShowAutomationModal(true);
                  }}
                  className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
                >
                  <Edit3 className="h-3 w-3" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this automation?')) {
                      deleteAutomation(automation.id);
                    }
                  }}
                  className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <button 
                onClick={() => {
                  updateAutomation(automation.id, {
                    status: automation.status === 'active' ? 'inactive' : 'active'
                  });
                }}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  automation.status === 'active' 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {automation.status === 'active' ? 'Disable' : 'Enable'}
              </button>
              <span className="text-xs text-gray-500">Last run: Today</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'projects', name: 'Projects', icon: Target },
    { id: 'team', name: 'Team', icon: Users },
    { id: 'workshops', name: 'Workshops', icon: Award },
    { id: 'workflows', name: 'Workflows', icon: GitBranch },
    { id: 'meetings', name: 'Meetings', icon: Calendar },
    { id: 'automation', name: 'Automation', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectModal editingProject={editingProject} />
      <TeamModal editingTeamMember={editingTeamMember} />
      <WorkshopModal editingWorkshop={editingWorkshop} />
      <TaskModal editingTask={editingTask} editingTaskProjectId={editingTaskProjectId} />
      <MeetingModal editingMeeting={editingMeeting} />
      <AutomationModal editingAutomation={editingAutomation} />
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SHPE FAU Tech Chair</h1>
              <p className="text-gray-600">Project Management & Team Coordination System</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                <Database className="h-4 w-4 text-gray-600" />
                <button
                  onClick={() => setDatabaseMode(!databaseMode)}
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    databaseMode ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {databaseMode ? 'Database' : 'Local'}
                </button>
                {databaseMode && (
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                )}
              </div>
              <span className="text-sm text-gray-500">August 2025 - Present</span>
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded"
              >
                Logout
              </button>
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Code className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {tab.name}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          <div className="flex-1">
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'projects' && <ProjectsTab />}
            {activeTab === 'team' && <TeamTab />}
            {activeTab === 'workshops' && <WorkshopsTab />}
            {activeTab === 'workflows' && <WorkflowsTab />}
            {activeTab === 'meetings' && <MeetingsTab />}
            {activeTab === 'automation' && <AutomationTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechChairTracker;