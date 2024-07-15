// server.js

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Carregar tarefas do arquivo
const loadTasks = () => {
  try {
    const data = fs.readFileSync('tasks.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Salvar tarefas no arquivo
const saveTasks = (tasks) => {
  fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2), 'utf8');
};

// Rota para listar todas as tarefas
app.get('/tasks', (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

// Rota para adicionar uma nova tarefa
app.post('/tasks', (req, res) => {
  const tasks = loadTasks();
  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    name: req.body.name,
    completed: false,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

// Rota para atualizar uma tarefa
app.put('/tasks/:id', (req, res) => {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (task) {
    task.name = req.body.name;
    task.completed = req.body.completed;
    saveTasks(tasks);
    res.json(task);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Rota para remover uma tarefa
app.delete('/tasks/:id', (req, res) => {
  let tasks = loadTasks();
  const taskIndex = tasks.findIndex((t) => t.id === parseInt(req.params.id));
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    saveTasks(tasks);
    res.json({ message: 'Task deleted' });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
