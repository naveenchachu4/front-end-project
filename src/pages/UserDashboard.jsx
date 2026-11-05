import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  LogOut, 
  CheckCircle2, 
  Calendar, 
  PlusCircle, 
  Search, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckSquare, 
  AlertTriangle 
} from 'lucide-react';

const UserDashboard = () => {
  const { currentUser, logout, tasks, updateTaskStatus, addTask } = useContext(AuthContext);

  // Search & Task Creation States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const getDayName = (dateString) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? '' : days[d.getDay()];
  };

  const handleCreateUserTask = (e) => {
    e.preventDefault();
    addTask(title, description, currentUser.email, priority, deadline);
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDeadline('');
    alert('Task created successfully!');
  };

  // Process assigned tasks & identify overdue items
  const userTasks = tasks.filter((task) => task.assignedTo === currentUser?.email);

  const processedTasks = userTasks
    .map((task) => {
      const isOverdue = task.status !== 'Completed' && task.deadline && task.deadline < today;
      return {
        ...task,
        isOverdue,
        displayPriority: isOverdue ? 'OVERDUE (HIGH)' : task.priority || 'Medium',
      };
    })
    .sort((a, b) => {
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      const priorityOrder = { 'OVERDUE (HIGH)': 0, High: 1, Medium: 2, Low: 3 };
      return (priorityOrder[a.displayPriority] || 4) - (priorityOrder[b.displayPriority] || 4);
    });

  // Filter tasks based on Search Bar and Status filter dropdown
  const filteredTasks = processedTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats for Dashboard V15 widgets
  const completedCount = userTasks.filter(t => t.status === 'Completed').length;
  const pendingCount = userTasks.filter(t => t.status === 'Pending').length;
  const overdueCount = processedTasks.filter(t => t.isOverdue).length;
  const completionPercentage = userTasks.length > 0 ? Math.round((completedCount / userTasks.length) * 100) : 0;

  // Mock Leaderboard Data (Inspired by "Friends Score" widget)
  const leaderboard = [
    { name: currentUser?.name || 'You', score: 8280, rank: 1, isSelf: true },
    { name: 'Anna Morgan', score: 7057, rank: 2, isSelf: false },
    { name: 'Jake Thompson', score: 5619, rank: 3, isSelf: false },
    { name: 'Sofia Bennett', score: 3858, rank: 4, isSelf: false },
  ];

  const getPriorityBadgeStyle = (priority, isOverdue) => {
    if (isOverdue) return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' };
    switch (priority) {
      case 'High': return { background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' };
      case 'Medium': return { background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' };
      case 'Low': return { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' };
      default: return { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f7f6', padding: '30px 20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Dashboard V15 Top Navigation Bar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '16px 24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', marginBottom: '25px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#1e293b' }}>User Dashboard V15</h2>
            <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>Track performance, complete tasks & monitor deadlines</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '0.95rem', color: '#334155', fontWeight: '600' }}>{currentUser?.name}</span>
            <button onClick={logout} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '600' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {/* Stat Highlights Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '25px' }}>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '12px' }}><CheckSquare size={24} /></div>
            <div>
              <span style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', fontWeight: '600' }}>Assigned Tasks</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#1e293b' }}>{userTasks.length}</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: '#dcfce7', color: '#16a34a', borderRadius: '12px' }}><TrendingUp size={24} /></div>
            <div>
              <span style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', fontWeight: '600' }}>Completion Rate</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#16a34a' }}>{completionPercentage}%</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: '#fee2e2', color: '#dc2626', borderRadius: '12px' }}><AlertTriangle size={24} /></div>
            <div>
              <span style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', fontWeight: '600' }}>Overdue Tasks</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#dc2626' }}>{overdueCount}</span>
            </div>
          </div>
        </div>

        {/* Dashboard V15 Layout: Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', marginBottom: '25px' }}>
          
          {/* Left Column: Progress Widget & Task Assignment Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* Performance Chart / Progress Meter Card */}
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>Performance Progress Chart</h3>
                <span style={{ fontSize: '0.85rem', color: '#4f46e5', fontWeight: '600' }}>Overall: {completionPercentage}%</span>
              </div>
              
              {/* Progress Bar Display */}
              <div style={{ width: '100%', height: '14px', background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{ width: `${completionPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%)', transition: 'width 0.4s ease' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
                <span>Completed: <strong>{completedCount}</strong></span>
                <span>Pending: <strong>{pendingCount}</strong></span>
                <span>Overdue: <strong>{overdueCount}</strong></span>
              </div>
            </div>

            {/* Create Task Form */}
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle size={20} color="#4f46e5" /> Assign New Task
              </h3>
              <form onSubmit={handleCreateUserTask}>
                <div style={{ marginBottom: '12px' }}>
                  <input type="text" placeholder="Task Title" required value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <textarea placeholder="Task Description" required value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '70px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>Priority:</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>Deadline Date:</label>
                    <input type="date" required value={deadline} onChange={(e) => setDeadline(e.target.value)} style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <button type="submit" style={{ padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Add Task</button>
              </form>
            </div>

          </div>

          {/* Right Column: Friends Score / Leaderboard Widget (from screenshot) */}
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} color="#f59e0b" /> Friends Score
            </h3>
            <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '0.8rem' }}>See how you rank among friends</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {leaderboard.map((item) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: item.isSelf ? '#eef2ff' : '#f8fafc', borderRadius: '10px', border: item.isSelf ? '1px solid #c7d2fe' : '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', width: '16px' }}>{item.rank}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: item.isSelf ? '700' : '500', color: item.isSelf ? '#4f46e5' : '#334155' }}>
                      {item.name} {item.isSelf && '(You)'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#1e293b' }}>{item.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Assigned Tasks Card Section with Filter Controls */}
        <section style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#1e293b' }}>
              My Assigned Tasks ({filteredTasks.length})
            </h3>

            {/* Live Filter Controls */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {/* Search Bar */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <Search size={16} color="#64748b" style={{ marginRight: '6px' }} />
                <input 
                  type="text" 
                  placeholder="Search tasks..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>

              {/* Status Dropdown Filter */}
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No tasks found matching your criteria.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    border: task.isOverdue ? '2px solid #ef4444' : '1px solid #e2e8f0',
                    backgroundColor: task.isOverdue ? '#fffbfb' : '#ffffff',
                    padding: '18px',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.05rem' }}>{task.title}</h4>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        ...getPriorityBadgeStyle(task.priority, task.isOverdue)
                      }}
                    >
                      {task.isOverdue ? '⚠️ OVERDUE - HIGH PRIORITY' : `Priority: ${task.priority}`}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 14px 0', color: '#475569', fontSize: '0.9rem' }}>{task.description}</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: task.isOverdue ? '#dc2626' : '#64748b', fontSize: '0.85rem', fontWeight: task.isOverdue ? 'bold' : 'normal' }}>
                      <Calendar size={16} />
                      <span>Deadline: {task.deadline} ({getDayName(task.deadline)})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                        <CheckCircle2 size={16} color="#4f46e5" /> Status:
                      </label>
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default UserDashboard;