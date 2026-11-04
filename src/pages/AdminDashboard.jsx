import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Trash2, PlusCircle, Users, CheckCircle2, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const { currentUser, logout, users, tasks, addTask, deleteTask } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');

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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '30px 20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '20px 25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', marginBottom: '25px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '1.5rem' }}>Admin Dashboard</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Welcome back, <strong>{currentUser?.name}</strong></p>
          </div>
          <button onClick={logout} style={{ padding: '10px 18px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
            <LogOut size={16} /> Logout
          </button>
        </header>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '25px' }}>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '10px' }}><Users size={24} /></div>
            <div>
              <span style={{ display: 'block', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>Total Registered Users</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>{users.length}</span>
            </div>
          </div>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: '#dcfce7', color: '#16a34a', borderRadius: '10px' }}><CheckCircle2 size={24} /></div>
            <div>
              <span style={{ display: 'block', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>Total System Tasks</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>{tasks.length}</span>
            </div>
          </div>
        </div>

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

        {/* Tasks List */}
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