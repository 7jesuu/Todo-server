const Joi = require('joi');
const Task = require('../models/Task');
const { handleServerError } = require('../utils/helpers');

exports.createTask = async (req, res) => {
  const taskData = req.body;

  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    // ... другие поля
  });

  try {
    await schema.validateAsync(taskData);
    const newTask = await Task.forge(taskData).save();
    res.json(newTask);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.fetchAll();
    res.json(tasks);
  } catch (error) {
    handleServerError(error, res);
  }
};

exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.where({ id }).fetch();
    res.json(task);
  } catch (error) {
    handleServerError(error, res);
  }
};

exports.updateTaskById = async (req, res) => {
  const { id } = req.params;
  const taskData = req.body;

  try {
    await Task.where({ id }).save(taskData, { method: 'update' });
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    handleServerError(error, res);
  }
};

exports.deleteTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    await Task.where({ id }).destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    handleServerError(error, res);
  }
};
