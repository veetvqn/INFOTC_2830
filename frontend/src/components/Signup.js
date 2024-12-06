import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
          <h2>
            Create your account
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div>
              {error}
            </div>
          )}
          <div>
            <div>
              <input
                name="username"
                type="text"
                required
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
            >
              Sign up
            </button>
          </div>
          
          <div>
            <Link to="/login">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;