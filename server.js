const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'QBao090706@',
  database: 'todo_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

app.get('/api/todo', (req, res) => {
  let sql = 'SELECT * FROM todos WHERE 1=1';
  const params = [];
  //log sql 
  console.log('SQL Query:', sql);
  if (req.query.search) {
   
    sql += ' AND task LIKE ?';
    params.push(`%${req.query.search}%`);
  }

  if (req.query.category) {
    sql += ' AND category = ?';
    params.push(req.query.category);
  }
  if (req.query.priority) {
    sql += ' AND priority = ?';
    params.push(req.query.priority);
  }
  sql += ' ORDER BY due_date ASC';
console.log('SQL Query:', sql);
//log params
console.log('SQL Params:', params);
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    console.log('Query Results:', results);
    res.json(results);
  });
});

app.post('/api/todo', (req, res) => {
  const { task, category, priority, due_date, status } = req.body;
  db.query('INSERT INTO todos (task, category, priority, due_date, status) VALUES (?, ?, ?, ?, ?)',
    [task, category, priority, due_date, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId });
    });
});

app.put('/api/todo/:id/toggle', (req, res) => {
  db.query('UPDATE todos SET status = IF(status="Done","Pending","Done") WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/todo/:id', (req, res) => {
  db.query('DELETE FROM todos WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
