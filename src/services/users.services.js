const User = require('../models/users.model');

const createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = new User({ name, email });
    await user.save();
    return res.status(201).send(user);
    
  } catch (err) {
    return res.status(500).send(err.message);

  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).send(users);
  } catch (err) {
    return res.status(500).send(err.message);


  }
};

const removeUser = async (req, res) => {
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Not found');
        }

         await User.findByIdAndRemove(userId);
        return res.status(200).send('User deleted');
    } catch (err) {
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
            return res.status(404).send('Not found');

        }
        return res.status(200).send(updatedUser);

    }
    catch (err) {
        return res.status(500).send(err.message);

    }
    }

module.exports = {
    createUser,
    getAllUsers,
    removeUser,
    updateUser
};