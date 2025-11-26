// WARNING: Contains intentional vulnerabilities for testing!

const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.json());

// VULNERABILITY: Hard-coded credentials
const dbConfig = {
  host: 'localhost',
  user: 'admin',
  password: 'SuperSecret123!',
  database: 'testdb'
};

const connection = mysql.createConnection(dbConfig);

// VULNERABILITY: SQL Injection
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  connection.query(query, (error, results) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json(results);
  });
});

// VULNERABILITY: Command Injection
app.post('/ping', (req, res) => {
  const host = req.body.host;
  const { exec } = require('child_process');
  exec(`ping -c 4 ${host}`, (error, stdout) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json({ output: stdout });
  });
});

// VULNERABILITY: Weak cryptography
const crypto = require('crypto');
app.post('/hash', (req, res) => {
  const password = req.body.password;
  const hash = crypto.createHash('md5').update(password).digest('hex');
  res.json({ hash: hash });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
  console.log('WARNING: Contains vulnerabilities for testing!');
});

module.exports = app;