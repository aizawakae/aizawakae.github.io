import { auth, db } from "../../firebase/config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

/* ELEMENTS */

const loginButton = document.getElementById("loginButton");
const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");
const closeMenu = document.getElementById("closeMenu");
const panelLogout = document.getElementById("panelLogout");

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const premiumBadge = document.getElementById("premiumBadge");
const userBalance = document.getElementById("userBalance");
const verifiedBadge = document.getElementById("verifiedBadge");

/* =========================
   MENU
========================= */

function showMenuButton() {
    if (menuButton) menuButton.style.display = "flex";
}

function hideMenuButton() {
    if (menuButton) menuButton.style.display = "none";
}

function openMenu() {
    sideMenu?.classList.add("active");
    menuOverlay?.classList.add("active");
}

function closeMenuFn() {
    sideMenu?.classList.remove("active");
    menuOverlay?.classList.remove("active");
}

menuButton?.addEventListener("click", openMenu);
closeMenu?.addEventListener("click", closeMenuFn);
menuOverlay?.addEventListener("click", closeMenuFn);

/* =========================
   AUTH
========================= */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        loginButton && (loginButton.style.display = "block");
        hideMenuButton();

        if (userName) userName.textContent = "Misafir";
        if (userEmail) userEmail.textContent = "";
        if (premiumBadge) premiumBadge.textContent = "⭐ Standart Üye";
        if (userBalance) userBalance.textContent = "0 ₺";

        return;
    }

    loginButton && (loginButton.style.display = "none");
    showMenuButton();

    if (userName)
        userName.textContent = user.displayName || "Kullanıcı";

    if (userEmail)
        userEmail.textContent = user.email || "";

    if (premiumBadge)
        premiumBadge.textContent = "⭐ Standart Üye";

    if (userBalance)
        userBalance.textContent = "0 ₺";

    try {

        const snap = await getDoc(doc(db, "users", user.uid));

        if (!snap.exists()) {
            return;
        }

        const data = snap.data();

        if (verifiedBadge) {
    verifiedBadge.style.display =
        data.verified === true ? "inline-flex" : "none";
}

        if (userName)
            userName.textContent =
                data.username ||
                user.displayName ||
                "Kullanıcı";

        if (userEmail)
            userEmail.textContent =
                data.email ||
                user.email ||
                "";

        if (userBalance)
            userBalance.textContent =
                `${Number(data.balance ?? 0).toFixed(2)} ₺`;

        if (premiumBadge) {

    if (data.admin === true || data.plan === "admin") {

        premiumBadge.textContent = "Admin";

    } else if (data.plan === "vip") {

        premiumBadge.textContent = "VIP Üye";

    } else if (data.plan === "premium") {

        premiumBadge.textContent = "Premium Üye";

    } else {

        premiumBadge.textContent = "Standart Üye";

    }

}

    } catch (err) {

        console.error("Index User Load:", err);

    }

});

/* =========================
   LOGOUT
========================= */

panelLogout?.addEventListener("click", async () => {

    try {

        await signOut(auth);

    } catch (err) {

        console.error(err);

    }

    location.reload();

});