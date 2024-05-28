const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  }, 
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, 
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address`
    }
  }
});

module.exports = mongoose.model('User', UserSchema);