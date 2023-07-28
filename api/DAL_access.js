const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'qap3_db',
  password: 'Neededmoss11',
  port: 5432,
});

const readQueryFile = (filename) => {
  const filePath = path.join(__dirname, '..', 'sql', filename);
  return fs.readFileSync(filePath, 'utf8');
};

const getUsers = async () => {
  try {
    const client = await pool.connect();
    const query = readQueryFile('getUsers.sql');
    const result = await client.query(query);
    client.release();
    return result.rows;
  } catch (err) {
    console.error('Error fetching users from the database:', err);
    throw err;
  }
};

const addUser = async (username, email) => {
  try {
    if (!username || !email) {
      throw new Error('Username and Email are required fields.');
    }
    const client = await pool.connect();
    const query = readQueryFile('addUser.sql');
    await client.query(query, [username, email]);
    client.release();
  } catch (err) {
    console.error('Error adding a new user to the database:', err);
    throw err;
  }
};

const updateUser = async (userId, username, email) => {
  try {
    const client = await pool.connect();
    let query = 'UPDATE users SET ';
    const values = [];
    let paramCount = 1;

    if (username) {
      query += `username = $${paramCount}`;
      values.push(username);
      paramCount++;
    }

    if (email) {
      if (values.length > 0) query += ', ';
      query += `email = $${paramCount}`;
      values.push(email);
      paramCount++;
    }

    query += ` WHERE user_id = $${paramCount}`;
    values.push(userId);

    await client.query(query, values);
    client.release();
  } catch (err) {
    console.error('Error updating a user in the database:', err);
    throw err;
  }
};

const deleteUser = async (userId) => {
  try {
    const client = await pool.connect();
    const query = readQueryFile('deleteUser.sql');
    await client.query(query, [userId]);
    client.release();
  } catch (err) {
    console.error('Error deleting a user from the database:', err);
    throw err;
  }
};

const searchUsers = async (searchUsername) => {
  try {
    const client = await pool.connect();
    const query = readQueryFile('searchUsers.sql');
    const result = await client.query(query, [searchUsername]);
    client.release();
    return result.rows;
  } catch (err) {
    console.error('Error searching for a user:', err);
    throw err;
  }
};

module.exports = {
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  searchUsers,
};







