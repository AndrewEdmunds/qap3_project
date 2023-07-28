const express = require('express');
const ejs = require('ejs');
const methodOverride = require('method-override');
const path = require('path');
const dataAccess = require('./api/DAL_access');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  try {
    const users = await dataAccess.getUsers();
    res.render('index', { title: 'QAP3 - Administrator Interface', users, searchedUsername: null });
  } catch (err) {
    console.error('Error rendering index page:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/users', async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).send('Please provide both username and email to add a user.');
    }
    await dataAccess.addUser(username, email);
    res.redirect('/');
  } catch (err) {
    console.error('Error adding a user:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/search', async (req, res) => {
  try {
    const { searchUsername } = req.body;
    if (!searchUsername) {
      return res.status(400).send('Please provide a username for the search.');
    }
    const users = await dataAccess.searchUsers(searchUsername);
    res.render('index', { title: 'QAP3 - Administrator Interface', users, searchedUsername: searchUsername });
  } catch (err) {
    console.error('Error searching for a user:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.patch('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email } = req.body;
    await dataAccess.updateUser(userId, username, email);
    res.redirect('/');
  } catch (err) {
    console.error('Error updating a user:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await dataAccess.deleteUser(userId);
    res.redirect('/');
  } catch (err) {
    console.error('Error deleting a user:', err);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});













