import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database helper functions
export const supabaseHelpers = {
  // Projects
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        tasks (*)
      `)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  async createProject(project) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateProject(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Tasks
  async getTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true })
    
    if (error) throw error
    return data
  },

  async updateTaskStatus(id, status) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async createTask(task) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Team Members
  async getTeamMembers() {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  async createTeamMember(member) {
    const { data, error } = await supabase
      .from('team_members')
      .insert([member])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateTeamMember(id, updates) {
    const { data, error } = await supabase
      .from('team_members')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Workshops
  async getWorkshops() {
    const { data, error } = await supabase
      .from('workshops')
      .select('*')
      .order('date', { ascending: true })
    
    if (error) throw error
    return data
  },

  async updateWorkshop(id, updates) {
    const { data, error } = await supabase
      .from('workshops')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async createWorkshop(workshop) {
    const { data, error } = await supabase
      .from('workshops')
      .insert([workshop])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Meetings
  async getMeetings() {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('next_date', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Automations
  async getAutomations() {
    const { data, error } = await supabase
      .from('automations')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Real-time subscriptions
  subscribeToProjects(callback) {
    return supabase
      .channel('projects-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' }, 
        callback
      )
      .subscribe()
  },

  subscribeToTasks(callback) {
    return supabase
      .channel('tasks-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks' }, 
        callback
      )
      .subscribe()
  },

  subscribeToTeamMembers(callback) {
    return supabase
      .channel('team-members-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'team_members' }, 
        callback
      )
      .subscribe()
  }
}