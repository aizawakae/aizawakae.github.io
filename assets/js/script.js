document.addEventListener("DOMContentLoaded", () => {

/* CURSOR GLOW */
const glow = document.createElement("div");

glow.classList.add("cursor-glow");

document.body.appendChild(glow);

document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
});

/* MENU SYSTEM */
const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("menuOverlay");
const closeMenu = document.getElementById("closeMenu");

if (!menuButton || !sideMenu || !overlay) {
    console.log("MENU ELEMENT MISSING");
    return;
}

menuButton.addEventListener("click", () => {
    sideMenu.classList.add("active");
    overlay.classList.add("active");
});

overlay.addEventListener("click", () => {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
});

if (closeMenu) {
    closeMenu.addEventListener("click", () => {
        sideMenu.classList.remove("active");
        overlay.classList.remove("active");
    });
}

});
