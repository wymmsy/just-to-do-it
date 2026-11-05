# Just To Do It - трекер задач

Добавление задач, редактирование, удаление, отметка выполнения, сортировка по дате, фильтр по статусу, поиск по названию, перетаскивание для изменения порядка, группировка по дням, сохранение в localStorage.

## Демо

[wymmsy.github.io/just-to-do-it](https://wymmsy.github.io/just-to-do-it/)

## Стек

HTML5, CSS3, vanilla JavaScript (DOM API).

## Структура проекта

```
index.html
css/
  style.css
js/
  data.js      — начальные данные
  storage.js   — чтение/запись localStorage
  dom.js       — вспомогательные функции для создания DOM-элементов
  tasks.js     — логика работы со списком задач
  app.js       — состояние, рендер, обработчики событий
img/
  favicon.svg
```

## Запуск

Открыть `index.html` через локальный сервер, например:

```
python3 -m http.server 8000
```

и перейти на `http://localhost:8000`.
