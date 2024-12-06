import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div>
      <div style={{
        padding: '1rem',
        backgroundColor: '#f0f0f0',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <span>{user?.username || user?.email}</span>
        <button 
          onClick={handleSignOut}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>

      <div className="planner-app">
        <h2>Add New Tasks</h2>
        <div className="row">
          <input type="text" name="newTast" value="Add a New Task"></input>
          <button>Add</button>
        </div>
        <ul id="list-container">
          <li className="checked">Task 1</li>
          <li>Task 2</li>
          <li>Task 3</li>
        </ul>
      </div> 
    </div>
  );
}

export default Dashboard;