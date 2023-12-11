// userController.js
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { handleServerError, checkUserAccess } = require('../utils/helpers');
const { generateToken } = require('../middlewares/authMiddleware');
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.fetchAll();
    res.json(users);
  } catch (error) {
    handleServerError(error, res);
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.where({ id }).fetch();
    res.json(user);
  } catch (error) {
    handleServerError(error, res);
  }
};

exports.createUser = async (req, res) => {
  const userData = req.body;

  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    login: Joi.string().required(),
    password: Joi.string().required(),
  });

  const saltRounds = 10;
  try {
    await schema.validateAsync(userData);

    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    userData.password = hashedPassword;

    const newUser = await User.forge(userData).save();
    res.json(newUser);
  } catch (error) {
    handleServerError(error, res);
  }
};

exports.updateUserById = async (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  try {
    const existingUser = await User.where({ id }).fetch();

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!checkUserAccess(req.user, id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await existingUser.save(userData, { method: 'update' });
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    handleServerError(error, res);
  }
};

exports.deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const existingUser = await User.where({ id }).fetch();

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!checkUserAccess(req.user, id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await existingUser.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    handleServerError(error, res);
  }
};

exports.authenticateUser = async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await User.where({ login }).fetch();

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.get('password'));

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    handleServerError(error, res);
  }
};
