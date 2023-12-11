const express = require('express');
const cors = require('cors');
const userController = require('./controllers/userController');
const taskController = require('./controllers/taskController');
const { authenticateToken } = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Главная страница
app.get('/', (req, res) => {
  res.send('Привет, это сервер для приложения TODO List!');
});

// Маршруты для пользователей
app.get('/users', userController.getAllUsers);
app.get('/users/:id', userController.getUserById);
app.post('/users', userController.createUser);
app.put('/users/:id', authenticateToken, userController.updateUserById);
app.delete('/users/:id', authenticateToken, userController.deleteUserById);

// Маршруты для задач
app.get('/tasks', taskController.getAllTasks);
app.get('/tasks/:id', taskController.getTaskById);
app.post('/tasks', authenticateToken, taskController.createTask); // Добавили проверку аутентификации
app.put('/tasks/:id', authenticateToken, taskController.updateTaskById);
app.delete('/tasks/:id', authenticateToken, taskController.deleteTaskById);

// Маршрут для аутентификации
app.post('/auth', userController.authenticateUser);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
