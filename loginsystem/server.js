const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors'); // ✅ add this
const app = express();

app.use(cors()); // ✅ enable CORS
app.use(express.json());

// MongoDB connection
mongoose.connect('your_mongodb_uri_here', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schema
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String
}));

// Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const exists = await User.findOne({ username });
  if (exists) return res.json({ message: 'User already exists' });

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hash });
  await user.save();
  res.json({ message: 'Registered successfully!' });
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.json({ message: 'Invalid username' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.json({ message: 'Incorrect password' });

  res.json({ message: 'Login successful!' });
});

app.listen(3000, () => console.log('Server running'));
