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
