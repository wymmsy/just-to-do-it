function addTask(tasks, title, date) {
  const task = {
    id: Date.now(),
    title: title.trim(),
    date: date || new Date().toISOString().slice(0, 10),
    completed: false
  };
  return [...tasks, task];
}

function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

function editTask(tasks, id, title, date) {
  return tasks.map((task) =>
    task.id === id ? { ...task, title: title.trim(), date } : task
  );
}

function toggleTaskCompleted(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
}

function sortTasksByDate(tasks, direction) {
  return [...tasks].sort((a, b) => {
    const diff = new Date(a.date) - new Date(b.date);
    return direction === "desc" ? -diff : diff;
  });
}

function filterTasksByStatus(tasks, status) {
  if (status === "active") return tasks.filter((task) => !task.completed);
  if (status === "completed") return tasks.filter((task) => task.completed);
  return tasks;
}
