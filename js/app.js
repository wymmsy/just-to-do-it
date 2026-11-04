let tasks = loadTasks();
let editingTaskId = null;

function renderHeader() {
  const logo = createElement("img", {
    className: "app-header__logo",
    attrs: { src: "img/favicon.svg", alt: "" }
  });
  const title = createElement("h1", {
    className: "app-header__title",
    text: "Just To Do It."
  });
  return createElement("header", { className: "app-header" }, [logo, title]);
}

function updateTasks(nextTasks) {
  tasks = nextTasks;
  saveTasks(tasks);
  render();
}

function renderTaskForm() {
  const titleInput = createElement("input", {
    className: "task-form__input",
    attrs: { type: "text", placeholder: "Новая задача", required: "" }
  });

  const dateInput = createElement("input", {
    className: "task-form__input",
    attrs: { type: "date" }
  });

  const submitButton = createElement("button", {
    className: "btn btn--primary",
    text: "Добавить",
    attrs: { type: "submit" }
  });

  return createElement(
    "form",
    {
      className: "task-form",
      on: {
        submit: (event) => {
          event.preventDefault();
          if (!titleInput.value.trim()) return;
          updateTasks(addTask(tasks, titleInput.value, dateInput.value));
        }
      }
    },
    [titleInput, dateInput, submitButton]
  );
}

function renderTaskItem(task) {
  if (editingTaskId === task.id) {
    return renderTaskEditItem(task);
  }

  const checkbox = createElement("input", {
    className: "task-item__checkbox",
    attrs: { type: "checkbox" },
    on: {
      change: () => updateTasks(toggleTaskCompleted(tasks, task.id))
    }
  });
  checkbox.checked = task.completed;

  const titleEl = createElement("span", { className: "task-item__title", text: task.title });
  const dateEl = createElement("span", { className: "task-item__date", text: task.date });
  const body = createElement("div", { className: "task-item__body" }, [titleEl, dateEl]);

  const editButton = createElement("button", {
    className: "btn btn--small btn--ghost",
    text: "Изменить",
    on: {
      click: () => {
        editingTaskId = task.id;
        render();
      }
    }
  });

  const deleteButton = createElement("button", {
    className: "btn btn--small btn--accent",
    text: "Удалить",
    on: {
      click: () => updateTasks(deleteTask(tasks, task.id))
    }
  });

  const actions = createElement("div", { className: "task-item__actions" }, [
    editButton,
    deleteButton
  ]);

  return createElement(
    "li",
    { className: `task-item${task.completed ? " task-item--completed" : ""}` },
    [checkbox, body, actions]
  );
}

function renderTaskEditItem(task) {
  const titleInput = createElement("input", {
    className: "task-item__edit-input",
    attrs: { type: "text", value: task.title }
  });

  const dateInput = createElement("input", {
    className: "task-item__edit-input",
    attrs: { type: "date", value: task.date }
  });

  const saveButton = createElement("button", {
    className: "btn btn--small btn--primary",
    text: "Сохранить",
    on: {
      click: () => {
        editingTaskId = null;
        updateTasks(editTask(tasks, task.id, titleInput.value, dateInput.value));
      }
    }
  });

  const cancelButton = createElement("button", {
    className: "btn btn--small btn--ghost",
    text: "Отмена",
    on: {
      click: () => {
        editingTaskId = null;
        render();
      }
    }
  });

  const editRow = createElement("div", { className: "task-item__edit-row" }, [
    titleInput,
    dateInput,
    saveButton,
    cancelButton
  ]);

  return createElement("li", { className: "task-item" }, [editRow]);
}

function renderTaskList(list) {
  if (list.length === 0) {
    return createElement("p", { className: "empty-state", text: "Задач не найдено" });
  }

  const items = list.map(renderTaskItem);
  return createElement("ul", { className: "task-list" }, items);
}

function render() {
  const app = document.getElementById("app");
  clearElement(app);

  const container = createElement("div", { className: "container" }, [
    renderTaskForm(),
    renderTaskList(tasks)
  ]);

  app.appendChild(renderHeader());
  app.appendChild(container);
}

render();
