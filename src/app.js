import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Users, Code, GitBranch, Target, AlertCircle, Plus, Edit3, Trash2, Clock, Award, TrendingUp, Bell, Settings } from 'lucide-react';
import './App.css';

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

  const [workflows, setWorkflows] = useState(() => loadFromStorage('workflows', [
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

  // Task status update function
  const updateTaskStatus = (projectId, taskId, newStatus) => {
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
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <Users className="h-6 w-6 mx-auto mb-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Schedule Team Meeting</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <Award className="h-6 w-6 mx-auto mb-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Plan Workshop</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Add simplified versions of other tabs for space
  const ProjectsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Management</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center">
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
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(project.priority)}`}>
                {project.priority}
              </span>
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

          <div>
            <h4 className="font-semibold mb-3">Tasks</h4>
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
                    <div>
                      <p className="font-medium text-sm">{task.name}</p>
                      <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Team Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map(member => (
          <div key={member.id} className="border p-4 rounded-lg">
            <h3 className="font-semibold">{member.name}</h3>
            <p className="text-gray-600 text-sm">{member.role}</p>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Performance</span>
                <span>{member.performance}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
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
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Simplified tabs for other sections
  const WorkflowsTab = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Development Workflows</h2>
      <p className="text-gray-600">Workflow management coming soon...</p>
    </div>
  );

  const MeetingsTab = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Meetings & Communication</h2>
      <p className="text-gray-600">Meeting management coming soon...</p>
    </div>
  );

  const AutomationTab = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Automation & Tools</h2>
      <p className="text-gray-600">Automation setup coming soon...</p>
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SHPE FAU Tech Chair</h1>
              <p className="text-gray-600">Project Management & Team Coordination System</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">August 2025 - Present</span>
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