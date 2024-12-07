const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const checkUser = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(checkUser, [username, email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (results.length > 0) {
        return res.status(409).json({ error: 'Username or email already exists' });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert new user
      const insertUser = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
      db.query(insertUser, [username, email, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const findUser = 'SELECT * FROM users WHERE email = ?';
    db.query(findUser, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = results[0];

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Return user data (excluding password)
      const { password_hash, ...userData } = user;
      res.json({
        message: 'Login successful',
        user: userData
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create events
app.post('/api/events', (req, res) => {
  try {
    const { userId, title, details, eventDate } = req.body;
    
    if (!userId || !title || !eventDate) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const date = new Date(eventDate);
    const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');

    const query = 'INSERT INTO events (user_id, title, details, event_date, status) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [userId, title, details, formattedDate, 'P'], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ 
        message: 'Event created successfully',
        eventId: result.insertId 
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's events
app.get('/api/events/:userId', (req, res) => {
  try {
    const userId = req.params.userId;
    const query = 'SELECT * FROM events WHERE user_id = ? ORDER BY event_date ASC';
    
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Change event status
app.patch('/api/events/:eventId/status', (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body;
    
    if (!['P', 'C', 'X'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const query = 'UPDATE events SET status = ? WHERE id = ?';
    db.query(query, [status, eventId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Event status updated successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete event
app.delete('/api/events/:eventId', (req, res) => {
  try {
    const { eventId } = req.params;
    const query = 'DELETE FROM events WHERE id = ?';
    
    db.query(query, [eventId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json({ message: 'Event deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint
app.get('/api/users', (req, res) => {
  db.query('SELECT id, username, email, FROM users', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Database test endpoint
app.get('/api/test-db', (req, res) => {
  db.query('SELECT 1', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Database connection successful!' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});