require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

// Create table
db.query(`
  CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE
  )
`);

// API routes

app.get('/api/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch todos' });
    res.json(results);
  });
});

app.get('/', (req, res) => {
  return res.status(200).send('Hello, hello, .... Welcome to the Todo API');
});

app.get('/hello', (req, res) => {
  return res.status(200).send('Hello, hello, and hello again');
});

app.post('/api/todos', (req, res) => {
  const { task } = req.body;
  if (!task || task.trim() === '') {
    return res.status(400).json({ error: 'Task cannot be empty' });
  }
  db.query('INSERT INTO todos (task) VALUES (?)', [task], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to add task' });
    res.json({ id: result.insertId, task, completed: false });
  });
});

app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;

  const fields = [];
  const values = [];

  if (typeof task !== 'undefined') {
    fields.push('task = ?');
    values.push(task);
  }

  if (typeof completed !== 'undefined') {
    fields.push('completed = ?');
    values.push(completed);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  values.push(id);
  const sql = `UPDATE todos SET ${fields.join(', ')} WHERE id = ?`;

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update' });
    res.json({ id, task, completed });
  });
});

app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM todos WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete' });
    res.json({ id });
  });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

