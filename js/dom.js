function createElement(tag, options = {}, children = []) {
  const el = document.createElement(tag);

  if (options.className) {
    el.className = options.className;
  }

  if (options.text !== undefined) {
    el.textContent = options.text;
  }

  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  }

  if (options.on) {
    Object.entries(options.on).forEach(([event, handler]) => {
      el.addEventListener(event, handler);
    });
  }

  children.forEach((child) => {
    if (child) el.appendChild(child);
  });

  return el;
}

function clearElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}
