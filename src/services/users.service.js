const User = require('../models/users.model');

const createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    if (!name || !email) {
      return res.status(400).json({msg: 'Name and email are required fields'});
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({msg: `${email} is not a valid email address`});
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({msg: 'User already exists'});
    }

    const user = new User({ name, email });
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
    
  const { email } = req.body;
    if (!email) {
        return res.status(400).json({msg: 'Email is required'});
    }
    try {
      
        const user = await User.findOne({ email });
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