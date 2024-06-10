const User = require('../models/users.model');
const formatText = require('../utils/formatText');

const createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    if (!name || !email) {
      return res.status(400).json({msg: 'Name and email are required fields'});
    }

    let formattedName = formatText(name);
    if (!formattedName) {
      return res.status(400).json({msg: `${name} is not a valid name`});
    }

    let formattedEmail = formatText(email, tolower=true);
    if (!formattedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formattedEmail)) {
      return res.status(400).json({msg: `${email} is not a valid email address`});
    }
    const usercheck = await User.findOne({ email: formattedEmail });
    if (usercheck) {
      return res.status(400).json({msg: 'User already exists'});
    }

    const user = new User({ name: formattedName, email: formattedEmail});
    await user.save();
    return res.status(201).json({msg: 'User created', name: user.name, email: user.email});
    
  } catch (err) {
    return res.status(500).json({msg: err.message});

  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({msg: err.message});


  }
};

const getUser  = async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({msg: 'Email is required'});
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({msg: 'User not found'});
    }
    return res.status(200).json({ msg: 'User found', name: user.name, email: user.email});
  }
  catch (err) {
    return res.status(500).json({msg: err.message});

  }
}

const removeUser = async (req, res) => {
  try {
    const { email } = req.body;
      if (!email) {
          return res.status(400).json({msg: 'Email is required'});
      }
        let formattedEmail = formatText(email, tolower=true);
        const user = await User.findOne({ email: formattedEmail });
        if (!user) {
            return res.status(404).json({msg: 'User not found'});
        }

         await user.remove();
        return res.status(200).json({msg: 'User removed'});
    } catch (err) {
      return res.status(500).json({msg: err.message});

    }
}

const updateUser = async (req, res) => {

    const { email, ...data } = req.body;
    if (!email) {
        return res.status(400).json({msg: 'Email is required'});
    }
    
    try {
        const updatedUser = await User.findOneAndUpdate({ email }, {name: data.name}, {new: true});
        if (!updatedUser) {
            return res.status(404).json({msg: 'User not found'});

        }
        return res.status(200).json({msg: 'User updated', ...updatedUser});

    }
    catch (err) {
        return res.status(500).json({msg: err.message});

    }
    }

module.exports = {
    createUser,
    getAllUsers,
    getUser,
    removeUser,
    updateUser
};