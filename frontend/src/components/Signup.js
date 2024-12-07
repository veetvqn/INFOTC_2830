import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Verification.css';

function Signup({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', formData);
      const loginResponse = await axios.post('http://localhost:5000/api/login', {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div>
      <div>
        <div>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div>
              {error}
            </div>
          )}
          <div className='planner-app'>
            <h2>
              Create your account
            </h2>
            <div className='row'>
              <input
                name="username"
                type="text"
                required
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className='row'>
              <input
                name="email"
                type="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className='row'>
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
            >
              Sign up
            </button>
            <div className='sign-up-link'>
            <Link to="/login">
              Already have an account? Sign in
            </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;