export function showNotification(type, title, message) {

    let container = document.getElementById("notification-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "notification-container";
        document.body.appendChild(container);
    }

    const el = document.createElement("div");
    el.className = `toast ${type}`;

    el.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
    `;

    container.appendChild(el);

    setTimeout(() => {
        el.remove();
    }, 3500);
}