import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  LogOut, 
  Trash2, 
  PlusCircle, 
  Users, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

const AdminDashboard = () => {
  const { currentUser, logout, users, tasks, addTask, deleteTask } = useContext(AuthContext);

  // State for creating new tasks
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');

  // State for selecting a user profile to inspect
  const [selectedUserEmail, setSelectedUserEmail] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const regularUsers = users.filter((u) => u.role === 'User');

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!assignedTo) {
      alert('Please select a user to assign the task to.');
      return;
    }
    addTask(title, description, assignedTo, priority, deadline);
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setPriority('Medium');
    setDeadline('');
  };

  // Helper function to compute performance stats for any specific user
  const getUserStats = (email) => {
    const userTasks = tasks.filter((t) => t.assignedTo === email);
    const completed = userTasks.filter((t) => t.status === 'Completed').length;
    const pending = userTasks.filter((t) => t.status === 'Pending').length;
    const inProgress = userTasks.filter((t) => t.status === 'In Progress').length;
    const overdue = userTasks.filter((t) => t.status !== 'Completed' && t.deadline && t.deadline < today).length;
    const rate = userTasks.length > 0 ? Math.round((completed / userTasks.length) * 100) : 0;

    return { total: userTasks.length, completed, pending, inProgress, overdue, rate, userTasks };
  };

  const selectedUser = users.find((u) => u.email === selectedUserEmail);
  const selectedUserStats = selectedUserEmail ? getUserStats(selectedUserEmail) : null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '30px 20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Top Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '20px 25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#e0e7ff', padding: '10px', borderRadius: '10px', color: '#4f46e5' }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <h2 style={{ margin: '0 0 2px 0', color: '#1e293b', fontSize: '1.4rem' }}>Admin Dashboard</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Welcome back, <strong>{currentUser?.name}</strong></p>
            </div>
          </div>
          <button onClick={logout} style={{ padding: '10px 18px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
            <LogOut size={16} /> Logout
          </button>
        </header>

        {/* System Overview Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '25px' }}>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '10px' }}><Users size={24} /></div>
            <div>
              <span style={{ display: 'block', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>Total Registered Users</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#1e293b' }}>{users.length}</span>
            </div>
          </div>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: '#dcfce7', color: '#16a34a', borderRadius: '10px' }}><CheckCircle2 size={24} /></div>
            <div>
              <span style={{ display: 'block', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>Total System Tasks</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#1e293b' }}>{tasks.length}</span>
            </div>
          </div>
        </div>

        {/* USER PROFILES & PERFORMANCE TRACKER (NEW FEATURE) */}
        <section style={{ background: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={22} color="#4f46e5" /> User Profiles & Completion Tracking
          </h3>
          <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '0.85rem' }}>
            Inspect team member profiles directly to monitor task completion rates and current progress.
          </p>

          {/* User Profile Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginBottom: selectedUserEmail ? '25px' : '0' }}>
            {regularUsers.length === 0 ? (
              <p style={{ color: '#64748b' }}>No regular users registered yet.</p>
            ) : (
              regularUsers.map((user) => {
                const stats = getUserStats(user.email);
                const isSelected = selectedUserEmail === user.email;

                return (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUserEmail(isSelected ? '' : user.email)}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#f5f3ff' : '#fafafa',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1rem' }}>{user.name}</h4>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: '#e2e8f0', borderRadius: '12px', color: '#475569', fontWeight: '600' }}>
                        {user.role}
                      </span>
                    </div>

                    <p style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: '0.8rem' }}>{user.email}</p>

                    {/* Completion rate bar */}
                    <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                      <div style={{ width: `${stats.rate}%`, height: '100%', background: '#16a34a' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569' }}>
                      <span>Done: <strong>{stats.completed}/{stats.total}</strong></span>
                      <span style={{ color: '#16a34a', fontWeight: 'bold' }}>{stats.rate}%</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Detailed Selected User Inspection View */}
          {selectedUser && selectedUserStats && (
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>
                    Profile Details: <strong>{selectedUser.name}</strong> ({selectedUser.email})
                  </h4>
                </div>
                <button onClick={() => setSelectedUserEmail('')} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.85rem' }}>
                  Close Inspection
                </button>
              </div>

              {/* Stat breakdown badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
                <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                  Total Assigned: {selectedUserStats.total}
                </span>
                <span style={{ background: '#dcfce7', color: '#15803d', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                  Completed: {selectedUserStats.completed}
                </span>
                <span style={{ background: '#fef3c7', color: '#b45309', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                  In Progress: {selectedUserStats.inProgress}
                </span>
                <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                  Overdue: {selectedUserStats.overdue}
                </span>
              </div>

              {/* List of Tasks for Selected Person */}
              <h5 style={{ margin: '0 0 10px 0', color: '#334155' }}>Assigned Tasks List:</h5>
              {selectedUserStats.userTasks.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No tasks assigned to this user yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedUserStats.userTasks.map((t) => (
                    <div key={t.id} style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                      <div>
                        <strong>{t.title}</strong> — <span style={{ color: '#64748b' }}>{t.description}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span>Deadline: <strong>{t.deadline}</strong></span>
                        <span>Status: <strong style={{ color: t.status === 'Completed' ? '#16a34a' : '#0284c7' }}>{t.status}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Assign Task Section */}
        <section style={{ background: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} color="#4f46e5" /> Assign New Task
          </h3>
          <form onSubmit={handleCreateTask}>
            <div style={{ marginBottom: '15px' }}>
              <input type="text" placeholder="Task Title" required value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <textarea placeholder="Task Description" required value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', minHeight: '80px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Assign To User:</label>
                <select required value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <option value="">-- Select User --</option>
                  {regularUsers.map((user) => (
                    <option key={user.id} value={user.email}>{user.name} ({user.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Priority Level:</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Deadline Date:</label>
                <input type="date" required value={deadline} onChange={(e) => setDeadline(e.target.value)} style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
            </div>
            <button type="submit" style={{ padding: '12px 24px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Create Task</button>
          </form>
        </section>

        {/* All Tasks List */}
        <section style={{ background: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '1.2rem' }}>All System Tasks ({tasks.length})</h3>
          {tasks.length === 0 ? (
            <p style={{ color: '#64748b' }}>No tasks created yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tasks.map((task) => (
                <div key={task.id} style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', color: '#1e293b', fontSize: '1.05rem' }}>{task.title}</h4>
                    <p style={{ margin: '0 0 8px 0', color: '#475569', fontSize: '0.9rem' }}>{task.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.85rem', color: '#64748b' }}>
                      <span>Assigned to: <strong>{task.assignedTo}</strong></span>
                      <span>Priority: <strong style={{ color: task.priority === 'High' ? '#ef4444' : '#334155' }}>{task.priority}</strong></span>
                      <span>Deadline: <strong>{task.deadline}</strong></span>
                      <span>Status: <strong style={{ color: '#0284c7' }}>{task.status}</strong></span>
                    </div>
                  </div>
                  <button onClick={() => deleteTask(task.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }} title="Delete Task">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;