const STORAGE_KEY = "justToDoIt.tasks";

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return DEFAULT_TASKS.map((task) => ({ ...task }));
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_TASKS.map((task) => ({ ...task }));
  } catch (error) {
    return DEFAULT_TASKS.map((task) => ({ ...task }));
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
