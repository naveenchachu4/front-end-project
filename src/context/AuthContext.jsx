import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const initialTasks = [
  { id: '1', title: 'Requirement Analysis', description: 'Complete SRS document review', assignedTo: 'naveen2@gmail.com', status: 'Pending', priority: 'High', deadline: '2026-11-03' },
  { id: '2', title: 'UI Wireframing', description: 'Design Figma mocks for admin panel', assignedTo: 'naveen2@gmail.com', status: 'Pending', priority: 'High', deadline: '2026-11-04' },
  { id: '3', title: 'Database Schema', description: 'Setup initial relational tables', assignedTo: 'naveen2@gmail.com', status: 'In Progress', priority: 'Medium', deadline: '2026-11-05' },
  { id: '4', title: 'Auth API Integration', description: 'Implement JWT route protection', assignedTo: 'naveen2@gmail.com', status: 'Pending', priority: 'High', deadline: '2026-11-05' },
  { id: '5', title: 'Component Library Setup', description: 'Configure Tailwind / Lucide icons', assignedTo: 'naveen2@gmail.com', status: 'Completed', priority: 'Low', deadline: '2026-11-06' },
  { id: '6', title: 'User Testing', description: 'Run end-to-end user evaluation', assignedTo: 'naveen2@gmail.com', status: 'Pending', priority: 'Medium', deadline: '2026-11-06' },
  { id: '7', title: 'Vercel Deployment', description: 'Deploy production build to Vercel', assignedTo: 'naveen2@gmail.com', status: 'Pending', priority: 'High', deadline: '2026-11-07' },
  { id: '8', title: 'Final Documentation', description: 'Prepare final presentation slides', assignedTo: 'naveen2@gmail.com', status: 'Pending', priority: 'Medium', deadline: '2026-11-07' }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : initialTasks;
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const signup = (name, email, password, role) => {
    const existing = users.find((u) => u.email === email);
    if (existing) {
      alert('User with this email already exists!');
      return false;
    }
    const newUser = { id: Date.now().toString(), name, email, password, role };
    setUsers([...users, newUser]);
    return true;
  };

  const login = (email, password) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    alert('Invalid email or password!');
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addTask = (title, description, assignedTo, priority = 'Medium', deadline) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      assignedTo,
      status: 'Pending',
      priority,
      deadline: deadline || new Date().toISOString().split('T')[0],
      createdAt: new Date().toLocaleDateString(),
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const updateTaskStatus = (id, status) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        tasks,
        signup,
        login,
        logout,
        addTask,
        deleteTask,
        updateTaskStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};