const express = require('express');
const mongoose = require('mongoose');
const { DB_URI } = require('./config');
const userRoutes = require('./routes/users.routes');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.options("*", cors());

mongoose.set('strictQuery', true);
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
// .then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Routes
app.use('/users', userRoutes);

module.exports = app;