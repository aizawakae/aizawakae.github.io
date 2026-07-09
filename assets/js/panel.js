/* =========================================================
   AIZAWAKAE PANEL.JS
   Premium Dashboard 2026
   Part 1
========================================================= */

/* =========================================================
   FIREBASE
========================================================= */

import {
    auth,
    db
} from "./firebase/config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =========================================================
   DOM
========================================================= */

const loader = document.getElementById("loader");

const logoutButton = document.getElementById("logoutButton");

const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");
const profileRank = document.getElementById("profileRank");

const welcomeUser = document.getElementById("welcomeUser");

const accountUsername = document.getElementById("accountUsername");
const accountEmail = document.getElementById("accountEmail");
const accountMembership = document.getElementById("accountMembership");
const accountCreated = document.getElementById("accountCreated");

const membershipType = document.getElementById("membershipType");

const walletBalance = document.getElementById("walletBalance");
const userBalance = document.getElementById("userBalance");

const totalOrders = document.getElementById("totalOrders");
const activeOrders = document.getElementById("activeOrders");

/* =========================================================
   USER
========================================================= */

let currentUser = null;

/* =========================================================
   LOADER
========================================================= */

function hideLoader() {

    if (!loader) return;

    loader.style.opacity = "0";
    loader.style.visibility = "hidden";

    setTimeout(() => {

        loader.remove();

    }, 500);

}

/* =========================================================
   AUTH CHECK
========================================================= */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    currentUser = user;

    hideLoader();

});
/* =========================================================
   USER DATA
========================================================= */

async function loadUserData() {

    try {

        const userRef = doc(db, "users", currentUser.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {

            console.warn("Kullanıcı belgesi bulunamadı.");
            return;

        }

        const data = userSnap.data();

        /* =========================================
           PROFILE
        ========================================= */

if (profileUsername) {

    profileUsername.innerHTML =
        `${data.username || currentUser.displayName || "Kullanıcı"}
        ${
            data.verified
            ? '<i class="fa-solid fa-circle-check" style="color:#1d9bf0;font-size:16px;margin-left:6px;"></i>'
            : ""
        }`;

}
if (welcomeUser) {

    welcomeUser.innerHTML =
        `${data.username || currentUser.displayName || "Kullanıcı"}
        ${
            data.verified
            ? '<i class="fa-solid fa-circle-check" style="color:#1d9bf0;font-size:16px;margin-left:6px;"></i>'
            : ""
        }`;

}

        if (accountUsername)
            accountUsername.textContent =
                data.username || currentUser.displayName || "Kullanıcı";

        if (profileEmail)
            profileEmail.textContent =
                currentUser.email || "-";

        if (accountEmail)
            accountEmail.textContent =
                currentUser.email || "-";

        /* =========================================
           MEMBERSHIP
        ========================================= */

        const premium = data.premium === true;

        const membership = premium
            ? "👑 Premium Üye"
            : "Standart Üye";

        if (profileRank)
            profileRank.textContent = membership;

        if (membershipType)
            membershipType.textContent = membership;

        if (accountMembership)
            accountMembership.textContent = membership;

        /* =========================================
           BALANCE
        ========================================= */

        const balance = Number(data.balance || 0);

        if (walletBalance)
            walletBalance.textContent =
                `₺${balance.toLocaleString("tr-TR")}`;

        if (userBalance)
            userBalance.textContent =
                `₺${balance.toLocaleString("tr-TR")}`;

        /* =========================================
           CREATED DATE
        ========================================= */

        if (accountCreated) {

            if (data.createdAt?.toDate) {

                accountCreated.textContent =
                    data.createdAt
                        .toDate()
                        .toLocaleDateString("tr-TR");

            } else {

                accountCreated.textContent = "-";

            }

        }

    } catch (error) {

        console.error("Kullanıcı verisi okunamadı:", error);

    }

}

/* =========================================================
   AUTH CONTINUE
========================================================= */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    currentUser = user;

    await loadUserData();

    hideLoader();

});
/* =========================================================
   ORDERS
========================================================= */

import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =========================================================
   LOAD ORDERS
========================================================= */

async function loadOrders() {

    console.log("loadOrders çalıştı");

    try {

        const ordersRef = collection(db, "orders");

const ordersQuery = query(
    ordersRef,
    orderBy("createdAt", "desc"),
    limit(5)
);

        const snapshot = await getDocs(ordersQuery);

        console.log("Sipariş sayısı:", snapshot.size);

const ordersContainer =
document.getElementById("recentOrdersList");

        if (!ordersContainer) return;

        ordersContainer.innerHTML = "";

        let total = 0;
        let active = 0;

        const allOrdersQuery = query(
    collection(db, "orders"),
    where("uid", "==", currentUser.uid)
);

const allOrdersSnapshot = await getDocs(allOrdersQuery);

total = allOrdersSnapshot.size;

active = 0;

allOrdersSnapshot.forEach((doc) => {

    const order = doc.data();

if (
    order.status === "Beklemede" ||
    order.status === "İşleniyor"
) {

    active++;

}

});

        snapshot.forEach((docSnap) => {

            

            const order = docSnap.data();
            
            let statusText = "Bekleniyor";
            let statusClass = "waiting";

            switch (order.status) {

                case "İşleniyor":
                    statusText = "İşleniyor";
                    statusClass = "progress";
                    
                    break;

                case "Tamamlandı":
                    statusText = "Tamamlandı";
                    statusClass = "completed";
                    break;

                case "İptal":
                    statusText = "İptal";
                    statusClass = "cancelled";
                    break;

                default:
                 statusText = "Beklemede";
                 statusClass = "waiting";
                break;

            }

const row = document.createElement("div");

row.className = "recent-order-item";

row.innerHTML = `

<div class="recent-order-platform">

    <strong>${order.platform}</strong>

    <span>${order.service}</span>

</div>

<div>

    <span class="recent-order-status ${statusClass}">

        ${statusText}

    </span>

</div>

<div class="recent-order-price">

    ${order.total || "₺0"}

</div>

`;

            ordersContainer.appendChild(row);

        });

if (totalOrders) {
    totalOrders.textContent = total.toLocaleString("tr-TR");
}

if (activeOrders) {
    activeOrders.textContent = active.toLocaleString("tr-TR");
}

        if (snapshot.empty) {

            ordersContainer.innerHTML = `

                <div class="table-row">

                    <span>Henüz sipariş bulunmuyor.</span>

                    <span>-</span>

                    <span>-</span>

                </div>

            `;

        }

    } catch (error) {

        console.error("Siparişler yüklenemedi:", error);

    }

}

/* =========================================================
   PANEL START
========================================================= */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    currentUser = user;

    await loadUserData();

    await loadOrders();

    hideLoader();

});

/* NAV ACTIVE SYSTEM */
const items = document.querySelectorAll(".nav-item");

items.forEach(item => {
    item.addEventListener("click", () => {

        items.forEach(i => i.classList.remove("active"));

        item.classList.add("active");

    });
});

