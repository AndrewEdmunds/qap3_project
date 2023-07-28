const express = require('express');
const router = express.Router();
const dataAccess = require('./DAL_access');

router.get('/users', async (req, res) => {
  try {
    const users = await dataAccess.getUsers();
    res.json(users);
  } catch (err) {
    console.error('Error getting users:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/users/search', async (req, res) => {
  try {
    const searchQuery = req.query.q;
    const users = await dataAccess.searchUsersByUsername(searchQuery);
    res.json(users);
  } catch (err) {
    console.error('Error searching users:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).json({ error: 'Username and Email are required fields.' });
    }
    await dataAccess.addUser(username, email);
    res.json({ message: 'User added successfully.' });
  } catch (err) {
    console.error('Error adding a new user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.patch('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email } = req.body;
    await dataAccess.updateUser(userId, username, email);
    res.json({ message: 'User updated successfully.' });
  } catch (err) {
    console.error('Error updating a user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await dataAccess.deleteUser(userId);
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Error deleting a user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;


