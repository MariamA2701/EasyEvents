const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'R@ruwaida3',
  database: 'saassignment'
};

const pool = mysql.createPool(dbConfig);

const UsersModel = {
  checkCredentials: async function (username) {
    try {
      const sql = 'SELECT user_id, password FROM Users WHERE username = ?';
      const [rows] = await pool.execute(sql, [username]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error in checkCredentials:', error);
      throw error;
    }
  },

  createCredentials: async function (username, password, age) {
    const sql = 'INSERT INTO Users (username, password, age) VALUES (?, ?, ?)';
    try {
      const [result] = await pool.execute(sql, [username, password, age]);
      return result.insertId;
    } catch (error) {
      console.error('Error in createCredentials:', error);
      throw error;
    }
  }
};

module.exports = UsersModel;