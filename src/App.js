import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- UI Styling Definitions ---
const cardStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '12px',
  textAlign: 'center',
  border: '1px solid rgba(0,0,0,0.04)',
  boxShadow: '0 10px 20px rgba(0,0,0,0.02)'
};

const cardStylePending = {
  ...cardStyle,
  boxShadow: '0 10px 20px rgba(230, 126, 34, 0.05)',
};

const cardStyleCompleted = {
  ...cardStyle,
  boxShadow: '0 10px 20px rgba(39, 174, 96, 0.05)',
};

const workspaceStyle = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '12px',
  border: '1px solid rgba(0,0,0,0.04)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
};

const inputStyle = {
  padding: '12px 15px',
  fontSize: '15px',
  borderRadius: '8px',
  border: '1px solid #e1e4e8',
  backgroundColor: '#fafbfc',
  outline: 'none'
};

const inputStyleSearch = {
  ...inputStyle,
  flex: 2,
  borderRadius: '20px'
};

const selectStyle = {
  flex: 1,
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #e1e4e8',
  background: '#fff'
};

const selectStyleFilter = {
  ...selectStyle,
  borderRadius: '20px',
  padding: '10px 15px'
};

const submitButtonStyle = {
  flex: 1,
  background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 4px 6px rgba(0, 114, 255, 0.2)'
};

const taskCardStyle = {
  backgroundColor: '#fff',
  padding: '16px 20px',
  borderRadius: '10px',
  border: '1px solid #f1f1f1',
  boxShadow: '0 4px 6px rgba(0,0,0,0.015)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const checkboxStyle = {
  width: '18px',
  height: '18px',
  cursor: 'pointer',
  accentColor: '#27ae60'
};

const deleteButtonStyle = {
  backgroundColor: 'rgba(231, 76, 60, 0.08)',
  color: '#e74c3c',
  border: 'none',
  padding: '6px 14px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px'
};

// --- Main App Component ---
function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const API_URL = 'http://localhost:8080/api/tasks';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await axios.post(API_URL, { title, description, priority, status: 'PENDING' });
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      fetchTasks();
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const toggleTaskStatus = async (task) => {
    const updatedStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await axios.put(`${API_URL}/${task.id}`, { ...task, status: updatedStatus });
      fetchTasks();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // Filter & Search Logic
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'ALL' || t.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const pendingTasks = totalTasks - completedTasks;

  const getPriorityColor = (p) => {
    if (p === 'HIGH') return '#e74c3c';
    if (p === 'MEDIUM') return '#f39c12';
    return '#2ecc71';
  };

  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div style={{ maxWidth: '900px', margin: 'auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h1 style={{ color: '#2c3e50', margin: 0, fontSize: '32px' }}>ProTask Workspace</h1>
          <p style={{ color: '#7f8c8d', fontSize: '15px', marginTop: '6px' }}>Full-Stack Task Management Dashboard</p>
        </div>

        {/* Analytics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={cardStyle}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(52, 152, 219, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto' }}>
              <span style={{ color: '#3498db', fontSize: '18px' }}>📊</span>
            </div>
            <span style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'bold' }}>TOTAL TASKS</span>
            <h2 style={{ margin: '5px 0 0 0', color: '#2c3e50', fontSize: '28px' }}>{totalTasks}</h2>
          </div>

          <div style={cardStylePending}>
            <span style={{ fontSize: '12px', color: '#e67e22', fontWeight: 'bold' }}>PENDING TASKS</span>
            <h2 style={{ margin: '5px 0 0 0', color: '#e67e22', fontSize: '28px' }}>{pendingTasks}</h2>
          </div>

          <div style={cardStyleCompleted}>
            <span style={{ fontSize: '12px', color: '#27ae60', fontWeight: 'bold' }}>COMPLETED TASKS</span>
            <h2 style={{ margin: '5px 0 0 0', color: '#27ae60', fontSize: '28px' }}>{completedTasks}</h2>
          </div>
        </div>

        {/* Workspace */}
        <div style={workspaceStyle}>
          
          {/* Create Task Form */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50', fontSize: '20px' }}>New Task</h3>
            <form onSubmit={addTask} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="text" 
                placeholder="What needs to be done?" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                style={inputStyle} 
              />
              <input 
                type="text" 
                placeholder="Optional notes or description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                style={inputStyle} 
              />
              <div style={{ display: 'flex', gap: '15px' }}>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} style={selectStyle}>
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
                <button type="submit" style={submitButtonStyle}>Add Task</button>
              </div>
            </form>
          </div>

          {/* Search & Filter Bar */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
            <input 
              type="text" 
              placeholder="🔍 Search tasks..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              style={inputStyleSearch} 
            />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selectStyleFilter}>
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Task Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredTasks.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#95a5a6', margin: '30px 0' }}>No tasks found.</p>
            ) : (
              filteredTasks.map((t) => (
                <div 
                  key={t.id} 
                  style={{ 
                    ...taskCardStyle, 
                    borderLeft: `5px solid ${getPriorityColor(t.priority)}`, 
                    opacity: t.status === 'COMPLETED' ? 0.6 : 1 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <input 
                      type="checkbox" 
                      checked={t.status === 'COMPLETED'} 
                      onChange={() => toggleTaskStatus(t)} 
                      style={checkboxStyle} 
                    />
                    <div>
                      <h4 style={{ margin: 0, color: '#2c3e50', textDecoration: t.status === 'COMPLETED' ? 'line-through' : 'none' }}>
                        {t.title}
                      </h4>
                      {t.description && <p style={{ margin: '3px 0 0 0', color: '#7f8c8d', fontSize: '13px' }}>{t.description}</p>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span 
                      style={{ 
                        fontSize: '10px', 
                        fontWeight: 'bold', 
                        color: '#fff', 
                        backgroundColor: getPriorityColor(t.priority), 
                        padding: '4px 10px', 
                        borderRadius: '14px', 
                        textTransform: 'uppercase' 
                      }}
                    >
                      {t.priority}
                    </span>
                    <button onClick={() => deleteTask(t.id)} style={deleteButtonStyle}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;