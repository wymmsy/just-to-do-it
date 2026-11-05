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

function searchTasksByTitle(tasks, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return tasks;
  return tasks.filter((task) => task.title.toLowerCase().includes(normalized));
}

function reorderTasks(tasks, draggedId, targetId, position) {
  if (draggedId === targetId) return tasks;

  const fromIndex = tasks.findIndex((task) => task.id === draggedId);
  if (fromIndex === -1) return tasks;

  const updated = [...tasks];
  const [moved] = updated.splice(fromIndex, 1);

  let toIndex = updated.findIndex((task) => task.id === targetId);
  if (toIndex === -1) return tasks;
  if (position === "after") toIndex += 1;

  updated.splice(toIndex, 0, moved);
  return updated;
}
