let tasks = loadTasks();
let editingTaskId = null;
let currentSortDirection = null;
let currentFilter = "all";
let currentSearch = "";
let draggedTaskId = null;
let dropTargetId = null;
let dropPosition = null;
let dropIndicatorEl = null;

function showDropIndicator(targetEl, isAfter) {
  if (!dropIndicatorEl) {
    dropIndicatorEl = createElement("li", { className: "drop-indicator" });
  }
  const parent = targetEl.parentElement;
  parent.insertBefore(dropIndicatorEl, isAfter ? targetEl.nextSibling : targetEl);
}

function clearDropState() {
  draggedTaskId = null;
  dropTargetId = null;
  dropPosition = null;
  if (dropIndicatorEl) {
    if (dropIndicatorEl.parentElement) {
      dropIndicatorEl.parentElement.removeChild(dropIndicatorEl);
    }
    dropIndicatorEl = null;
  }
}

function handleListDragOver(event) {
  event.preventDefault();
  if (draggedTaskId === null) return;

  const itemEl = event.target.closest(".task-item");
  if (!itemEl) return;

  const targetId = Number(itemEl.dataset.id);
  if (!targetId || targetId === draggedTaskId) return;

  const rect = itemEl.getBoundingClientRect();
  const isAfter = event.clientY - rect.top > rect.height / 2;
  dropTargetId = targetId;
  dropPosition = isAfter ? "after" : "before";
  showDropIndicator(itemEl, isAfter);
}

function handleListDrop(event) {
  event.preventDefault();
  if (draggedTaskId === null || dropTargetId === null) return;

  const nextTasks = reorderTasks(tasks, draggedTaskId, dropTargetId, dropPosition);
  clearDropState();
  updateTasks(nextTasks);
}

function getVisibleTasks() {
  let result = searchTasksByTitle(tasks, currentSearch);
  result = filterTasksByStatus(result, currentFilter);
  if (currentSortDirection) {
    result = sortTasksByDate(result, currentSortDirection);
  }
  return result;
}

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

function renderControls() {
  const searchInput = createElement("input", {
    className: "controls__search",
    attrs: { type: "text", placeholder: "Поиск задач", value: currentSearch },
    on: {
      keydown: (event) => {
        if (event.key !== "Enter") return;
        currentSearch = event.target.value;
        render();
      }
    }
  });

  const statuses = ["all", "active", "completed"];
  const statusLabels = { all: "Все", active: "Активные", completed: "Выполненные" };

  const filterButtons = statuses.map((status) =>
    createElement("button", {
      className: `btn btn--small${currentFilter === status ? " btn--active" : ""}`,
      text: statusLabels[status],
      on: {
        click: () => {
          currentFilter = status;
          render();
        }
      }
    })
  );

  const sortButton = createElement("button", {
    className: "btn btn--small",
    text: currentSortDirection === "desc" ? "Дата ↓" : "Дата ↑",
    on: {
      click: () => {
        currentSortDirection = currentSortDirection === "asc" ? "desc" : "asc";
        render();
      }
    }
  });

  const filtersWrap = createElement("div", { className: "controls__filters" }, [
    ...filterButtons,
    sortButton
  ]);

  return createElement("div", { className: "controls" }, [searchInput, filtersWrap]);
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
    {
      className: `task-item${task.completed ? " task-item--completed" : ""}`,
      attrs: { draggable: "true", "data-id": String(task.id) },
      on: {
        dragstart: (event) => {
          draggedTaskId = task.id;
          event.dataTransfer.setData("text/plain", String(task.id));
          event.currentTarget.classList.add("task-item--dragging");
        },
        dragend: (event) => {
          event.currentTarget.classList.remove("task-item--dragging");
          clearDropState();
        }
      }
    },
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

function groupTasksByDate(list) {
  const groups = [];
  const indexByDate = new Map();

  list.forEach((task) => {
    if (!indexByDate.has(task.date)) {
      indexByDate.set(task.date, groups.length);
      groups.push({ date: task.date, tasks: [] });
    }
    groups[indexByDate.get(task.date)].tasks.push(task);
  });

  return groups;
}

function renderTaskList(list) {
  if (list.length === 0) {
    return createElement("p", { className: "empty-state", text: "Задач не найдено" });
  }

  const groups = groupTasksByDate(list).map((group) => {
    const heading = createElement("h2", { className: "day-group__heading", text: group.date });
    const items = createElement(
      "ul",
      {
        className: "task-list",
        on: {
          dragover: handleListDragOver,
          drop: handleListDrop
        }
      },
      group.tasks.map(renderTaskItem)
    );
    return createElement("div", { className: "day-group" }, [heading, items]);
  });

  return createElement("div", { className: "day-group-list" }, groups);
}

function render() {
  const app = document.getElementById("app");
  clearElement(app);

  const container = createElement("div", { className: "container" }, [
    renderControls(),
    renderTaskForm(),
    renderTaskList(getVisibleTasks())
  ]);

  app.appendChild(renderHeader());
  app.appendChild(container);
}

render();
