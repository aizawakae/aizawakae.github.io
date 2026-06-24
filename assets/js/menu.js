const menu = document.querySelector(".menu");
const overlay = document.querySelector(".menu-overlay");
const openBtn = document.getElementById("menuButton");
const closeBtn = document.getElementById("menuClose");
const body = document.body;

import { auth } from "./firebase/config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// OPEN MENU
function openMenu(){
    menu.classList.add("active");
    overlay.classList.add("active");
    body.style.overflow = "hidden";
}

// CLOSE MENU
function closeMenu(){
    menu.classList.remove("active");
    overlay.classList.remove("active");
    body.style.overflow = "auto";
}

// EVENTS
openBtn?.addEventListener("click", openMenu);
closeBtn?.addEventListener("click", closeMenu);
overlay?.addEventListener("click", closeMenu);

// ESC CLOSE
document.addEventListener("keydown", (e) => {
    if(e.key === "Escape"){
        closeMenu();
    }
});

logoutButton?.addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.href = "login.html";

    } catch (error) {

        console.error(error);

    }

});