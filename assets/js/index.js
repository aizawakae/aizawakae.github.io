import { auth, db, storage } from "./firebase/config.js";
window.auth = auth;
window.db = db;
window.storage = storage;

console.log("✅ Firebase bağlandı.");

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    if (loader) {
        loader.style.opacity = "0";
        loader.style.visibility = "hidden";

        setTimeout(() => {
            loader.remove();
        }, 500);
    }
});