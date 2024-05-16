const User = require('../models/users.model');

const createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    if (!name || !email) {
      throw new Error('Name and email are required fields');
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({msg: 'User already exists'});
    }

    const user = new User({ name, email });
    await user.save();
    return res.status(201).json({user});
    
  } catch (err) {
    return res.status(500).json({msg: err.message});

  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({users});
  } catch (err) {
    return res.status(500).json({msg: err.message});


  }
};

const removeUser = async (req, res) => {
    
  const { email } = req.body;
    if (!email) {
        throw new Error('Email is required');
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
        throw new Error('Name and email are required fields');
    }

    
    try {
        const updatedUser = await User.findOneAndUpdate({ email }, { ...data });
        if (!updatedUser) {
            return res.status(404).json({msg: 'user Not found'});

        }
        return res.status(200).json({updatedUser});

    }
    catch (err) {
        return res.status(500).json({msg: err.message});

    }
    }

module.exports = {
    createUser,
    getAllUsers,
    removeUser,
    updateUser
};