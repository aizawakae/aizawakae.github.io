import { auth, db } from "../../firebase/config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    query,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =======================
   ADMINS
======================= */

const ADMIN_EMAILS = [
    "adminkae@gmail.com",
    "aizawakae@gmail.com"
];

/* =======================
   DOM
======================= */

const totalUsers = document.getElementById("totalUsers");
const totalOrders = document.getElementById("totalOrders");
const pendingOrders = document.getElementById("pendingOrders");
const completedOrders = document.getElementById("completedOrders");

const ordersList = document.getElementById("ordersList");
const usersList = document.getElementById("usersList");

const logoutBtn = document.getElementById("logoutBtn");

const emailInput = document.getElementById("userEmail");
const balanceInput = document.getElementById("balanceAmount");
const addBalanceBtn = document.getElementById("addBalanceBtn");

let currentUser = null;

/* =======================
   AUTH
======================= */

onAuthStateChanged(auth, (user) => {

    if (!user) {
        location.href = "login.html";
        return;
    }

    const email = (user.email || "").trim().toLowerCase();

    if (!ADMIN_EMAILS.includes(email)) {
        alert("Yetkisiz erişim");
        location.href = "index.html";
        return;
    }

    currentUser = user;

    listenOrders();
    listenUsers();
});

/* =======================
   ORDERS
======================= */

function listenOrders() {

    const q = query(collection(db, "orders"));

    onSnapshot(q, (snapshot) => {

        if (!ordersList) return;

        ordersList.innerHTML = "";

        let pending = 0;
        let completed = 0;

        snapshot.forEach((d) => {

            const o = d.data();
            if (!o) return;

            if (o.status === "Bekliyor" || o.status === "İşleme Alındı") pending++;
            if (o.status === "Tamamlandı") completed++;

            const card = document.createElement("div");
            card.className = "admin-order";

            card.innerHTML = `
                <div>
                    <h3>${o.platform || "-"} • ${o.service || "-"}</h3>
                    <p>${o.email || "-"}</p>
                    <p>${o.quantity || 0} adet</p>
                    <p>${Number(o.totalPrice || 0).toFixed(2)} TL</p>
                </div>

                <div class="admin-actions">

                    <select class="statusSelect">
                        <option ${o.status === "Bekliyor" ? "selected" : ""}>Bekliyor</option>
                        <option ${o.status === "İşleme Alındı" ? "selected" : ""}>İşleme Alındı</option>
                        <option ${o.status === "Tamamlandı" ? "selected" : ""}>Tamamlandı</option>
                        <option ${o.status === "İptal Edildi" ? "selected" : ""}>İptal Edildi</option>
                    </select>

                    <button class="updateBtn">Güncelle</button>
                    <button class="deleteBtn">Sil</button>

                </div>
            `;

            const statusSelect = card.querySelector(".statusSelect");
            const updateBtn = card.querySelector(".updateBtn");
            const deleteBtn = card.querySelector(".deleteBtn");

            updateBtn.onclick = async () => {
                await updateDoc(doc(db, "orders", d.id), {
                    status: statusSelect.value
                });
            };

            deleteBtn.onclick = async () => {
                if (!confirm("Silinsin mi?")) return;
                await deleteDoc(doc(db, "orders", d.id));
            };

            ordersList.appendChild(card);
        });

        if (totalOrders) totalOrders.textContent = snapshot.size;
        if (pendingOrders) pendingOrders.textContent = pending;
        if (completedOrders) completedOrders.textContent = completed;

    });
}

/* =======================
   USERS
======================= */

function listenUsers() {

    const q = query(collection(db, "users"));

    onSnapshot(q, (snapshot) => {

        if (!usersList) return;

        usersList.innerHTML = "";

        if (totalUsers) totalUsers.textContent = snapshot.size;

        snapshot.forEach((d) => {

            const u = d.data();
            if (!u) return;

            const card = document.createElement("div");
            card.className = "admin-user";

            card.innerHTML = `
                <div>
                    <h3>${u.username || "User"}</h3>
                    <p>${u.email || "-"}</p>
                    <p>Bakiye: ${(u.balance || 0).toFixed(2)} ₺</p>
                    <p>${u.verified ? "🔵 Verified Kullanıcı" : "⚪ Normal Kullanıcı"}</p>
                </div>

                <div class="admin-actions">
                    <button class="verifyBtn">
                        ${u.verified ? "Verified Kaldır" : "Verified Ver"}
                    </button>
                </div>
            `;

            const verifyBtn = card.querySelector(".verifyBtn");

            verifyBtn.onclick = async () => {
                await updateDoc(doc(db, "users", d.id), {
                    verified: !u.verified
                });
            };

            usersList.appendChild(card);
        });

    });
}

/* =======================
   BALANCE SYSTEM
======================= */

addBalanceBtn.onclick = async () => {

    const email = (emailInput.value || "").trim().toLowerCase();
    const amount = Number(balanceInput.value);

    if (!email || amount <= 0) {
        alert("Geçerli veri giriniz");
        return;
    }

    const snap = await getDocs(collection(db, "users"));

    let found = null;
    let userId = null;

    snap.forEach((d) => {
        const data = d.data();

        if ((data.email || "").toLowerCase() === email) {
            found = data;
            userId = d.id;
        }
    });

    if (!found) {
        alert("Kullanıcı bulunamadı");
        return;
    }

    await updateDoc(doc(db, "users", userId), {
        balance: (found.balance || 0) + amount
    });

    alert("Bakiye eklendi");

    emailInput.value = "";
    balanceInput.value = "";
};

/* =======================
   LOGOUT
======================= */

logoutBtn.onclick = async () => {
    await signOut(auth);
    location.href = "login.html";
};