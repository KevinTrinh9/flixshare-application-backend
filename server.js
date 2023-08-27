// Import necessary modules
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const path = require('path');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Create Express app
const app = express();
const port = 5000;

// Configure PostgreSQL connection
const client = new Client({
  connectionString: 'postgres://qsgfywui:8wyD2sz7qqqIJWo1XaFWtPLQkdXFx5SZ@mahmud.db.elephantsql.com/qsgfywui',
});

client.connect();

app.use(express.json());
app.use(
  session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Set up CORS headers
app.use(cors({
  origin: 'https://flixshare-application.onrender.com', // Replace with your frontend domain
  credentials: true,
}));

// Default route to serve the API documentation
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/users', async (req, res) => {
  const search = req.query.search;

  try {
    let query = 'SELECT * FROM users';

    // Append WHERE clause to the query if search term exists
    if (search) {
      query += ` WHERE LOWER(username) LIKE LOWER('%${search}%')`;
    }

    const { rows } = await client.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Signup route
app.post('/api/signup', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query(
      'INSERT INTO users (email, username, password) VALUES ($1, $2, $3)',
      [email, username, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await client.query(
      'SELECT id, username, password FROM users WHERE username = $1',
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ id: user.id, username: user.username }, 'your_secret_key');
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Error destroying session:', error);
    }
    res.sendStatus(200);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
