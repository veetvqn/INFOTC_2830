import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('user') ? true : false
  );

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route 
            path="/login" 
            element={
              !isAuthenticated 
                ? <Login setIsAuthenticated={setIsAuthenticated} /> 
                : <Navigate to="/dashboard" replace />
            } 
          />
          <Route 
            path="/signup" 
            element={
              !isAuthenticated 
                ? <Signup setIsAuthenticated={setIsAuthenticated} /> 
                : <Navigate to="/dashboard" replace />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated 
                ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> 
                : <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;