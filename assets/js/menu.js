import { auth, db } from "./firebase/config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =========================================
   MENU ELEMENTS
========================================= */

const menu = document.querySelector(".menu");
const overlay = document.querySelector(".menu-overlay");

const openBtn = document.getElementById("menuButton");
const closeBtn = document.getElementById("menuClose");

const logoutButton = document.getElementById("logoutButton");

/* =========================================
   USER ELEMENTS
========================================= */

const menuUsername = document.getElementById("menuUsername");

const menuPremium = document.getElementById("menuPremium");

const menuBalance = document.getElementById("menuBalance");

const menuVerified = document.getElementById("menuVerified");

/* =========================================
   MENU OPEN
========================================= */

function openMenu(){

    menu?.classList.add("active");

    overlay?.classList.add("active");

    document.body.style.overflow = "hidden";

}

/* =========================================
   MENU CLOSE
========================================= */

function closeMenu(){

    menu?.classList.remove("active");

    overlay?.classList.remove("active");

    document.body.style.overflow = "auto";

}

/* =========================================
   EVENTS
========================================= */

openBtn?.addEventListener("click", openMenu);

closeBtn?.addEventListener("click", closeMenu);

overlay?.addEventListener("click", closeMenu);

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        closeMenu();

    }

});
/* =========================================
   AUTH
========================================= */

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    try {

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;

        const userData = userSnap.data();

        /* =========================================
           USERNAME
        ========================================= */

        if (menuUsername) {

            menuUsername.textContent =
                userData.username || "Kullanıcı";

        }

        /* =========================================
           BALANCE
        ========================================= */

        if (menuBalance) {

            const balance = Number(userData.balance || 0);

            menuBalance.textContent =
                `₺${balance.toLocaleString("tr-TR")}`;

        }

        /* =========================================
           PREMIUM
        ========================================= */

        if (menuPremium) {

            menuPremium.textContent =
                userData.premium
                    ? "👑 Premium Üye"
                    : "Standart Üye";

        }

        /* =========================================
           VERIFIED
        ========================================= */

        if (menuVerified) {

            menuVerified.style.display =
                userData.verified
                    ? "inline-block"
                    : "none";

        }

    } catch (error) {

        console.error("Menu Error:", error);

    }

});
/* =========================================
   LOGOUT
========================================= */

logoutButton?.addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.href = "login.html";

    } catch (error) {

        console.error("Logout Error:", error);

    }

});

/* =========================================
   EXPORT
========================================= */

export {

    openMenu,
    closeMenu

};