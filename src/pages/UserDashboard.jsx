import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, CheckCircle, Calendar, PlusCircle } from 'lucide-react';

const UserDashboard = () => {
  const { currentUser, logout, tasks, updateTaskStatus, addTask } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');

  const getDayName = (dateString) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? '' : days[d.getDay()];
  };

  const today = new Date().toISOString().split('T')[0];

  const handleCreateUserTask = (e) => {
    e.preventDefault();
    addTask(title, description, currentUser.email, priority, deadline);
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDeadline('');
    alert('Task successfully created and assigned to you!');
  };

  const processedTasks = tasks
    .filter((task) => task.assignedTo === currentUser?.email)
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '30px 20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '20px 25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', marginBottom: '25px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '1.5rem' }}>User Dashboard</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Welcome, <strong>{currentUser?.name}</strong></p>
          </div>
          <button onClick={logout} style={{ padding: '10px 18px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
            <LogOut size={16} /> Logout
          </button>
        </header>

        {/* Assign Task to Self Section */}
        <section style={{ background: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} color="#0284c7" /> Assign New Task to Yourself
          </h3>
          <form onSubmit={handleCreateUserTask}>
            <div style={{ marginBottom: '15px' }}>
              <input type="text" placeholder="Task Title" required value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <textarea placeholder="Task Description" required value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', minHeight: '80px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
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
            <button type="submit" style={{ padding: '12px 24px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Add My Task</button>
          </form>
        </section>

        {/* Assigned Tasks Section */}
        <section style={{ background: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '1.2rem' }}>My Assigned Tasks ({processedTasks.length})</h3>
          {processedTasks.length === 0 ? (
            <p style={{ color: '#64748b' }}>No tasks assigned to you yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {processedTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    border: task.isOverdue ? '2px solid #ef4444' : '1px solid #e2e8f0',
                    backgroundColor: task.isOverdue ? '#fffbfb' : '#ffffff',
                    padding: '18px',
                    borderRadius: '10px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>{task.title}</h4>
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

                  <p style={{ margin: '0 0 15px 0', color: '#475569', fontSize: '0.95rem' }}>{task.description}</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: task.isOverdue ? '#dc2626' : '#64748b', fontSize: '0.9rem', fontWeight: task.isOverdue ? 'bold' : 'normal' }}>
                      <Calendar size={16} />
                      <span>Deadline: {task.deadline} ({getDayName(task.deadline)})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>
                        <CheckCircle size={16} color="#0284c7" /> Status:
                      </label>
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
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