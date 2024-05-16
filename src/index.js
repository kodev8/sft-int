const express = require('express');
const mongoose = require('mongoose');
const { DB_URI, PORT } = require('./config');

const app = express();
app.use(express.json());

// Database connection
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Routes

app.listen(PORT, () => console.log(`Server running on port ${PORT}; DB_URI: ${DB_URI}`));
