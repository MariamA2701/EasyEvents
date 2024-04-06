const mysql = require('mysql2/promise');

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "R@ruwaida3",
  database: "saassignment"
};

const pool = mysql.createPool(dbConfig);

async function query(sql, params) {
  const [results, ] = await pool.execute(sql, params);
  return results;
}

module.exports = { query };

async function initDatabase() {
  let con;
  try {
    con = await mysql.createConnection(dbConfig);
    console.log("Connected to the database!");

    await con.query("DROP TABLE IF EXISTS Events");
    console.log("Events table dropped");

    await con.query("DROP TABLE IF EXISTS Users");
    console.log("Users table dropped");

    const createUsersSql = `
      CREATE TABLE Users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username TEXT,
        password TEXT,
        age INTEGER
      )`;
    await con.query(createUsersSql);
    console.log("Users table created");

    const createEventsSql = `
      CREATE TABLE Events (
        event_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        event_date DATE,
        location TEXT,
        attendees INTEGER,
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
      )`;
    await con.query(createEventsSql);
    console.log("Events table created");
  } catch (err) {
    console.error("An error occurred:", err);
  } finally {
    if (con) {
      await con.end();
      console.log("Database connection closed");
    }
  }
}

initDatabase();