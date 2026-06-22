import { auth, db } from "../../firebase/config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =======================
   STATE
======================= */

let currentUser = null;
let userBalance = 0;

/* =======================
   AUTH
======================= */

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        location.href = "login.html";
        return;
    }

    currentUser = user;

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
        userBalance = snap.data().balance || 0;
    }

    updateBalanceUI();

});

/* =======================
   ELEMENTS
======================= */

const platform = document.getElementById("platform");
const service = document.getElementById("service");
const amount = document.getElementById("amount");
const price = document.getElementById("price");

const usernameBox = document.getElementById("usernameBox");
const linkBox = document.getElementById("linkBox");

const username = document.getElementById("username");
const link = document.getElementById("link");
const note = document.getElementById("note");

const buyButton = document.getElementById("buyButton");

/* =======================
   SERVICES
======================= */

const services = {

    instagram: {
        Takipçi: 0.03,
        Beğeni: 0.02,
        İzlenme: 0.04,
        Yorum: 0.08
    },

    tiktok: {
        Takipçi: 0.30,
        Beğeni: 0.05,
        İzlenme: 0.001,
        Yorum: 1.50,
        Paylaşım: 0.03,
        Kaydetme: 0.03
    },

    youtube: {
        Abone: 25,
        Beğeni: 0.50,
        İzlenme: 0.10,
        Yorum: 2.50
    }

};

/* =======================
   UI
======================= */

function loadServices() {

    service.innerHTML = "";

    for (const item in services[platform.value]) {

        const option = document.createElement("option");
        option.textContent = item;
        option.value = services[platform.value][item];

        service.appendChild(option);

    }

    updateFields();
    calculate();
}

function updateFields() {

    const selected = service.options[service.selectedIndex].text;

    usernameBox.style.display =
        (selected === "Takipçi" || selected === "Abone") ? "block" : "none";

    linkBox.style.display =
        (selected === "Takipçi" || selected === "Abone") ? "none" : "block";

}

function calculate() {

    const total = Number(service.value) * Number(amount.value || 0);
    price.textContent = total.toFixed(2) + " TL";
}

/* =======================
   EVENTS
======================= */

platform.addEventListener("change", loadServices);
service.addEventListener("change", () => {
    updateFields();
    calculate();
});
amount.addEventListener("input", calculate);

loadServices();

/* =======================
   BALANCE UI (NO ALERT)
======================= */

function updateBalanceUI() {

    let el = document.getElementById("balanceBox");

    if (!el) {
        el = document.createElement("div");
        el.id = "balanceBox";
        el.style.marginTop = "10px";
        el.style.color = "#fff";
        document.body.appendChild(el);
    }

    el.textContent = `Bakiye: ${userBalance.toFixed(2)} ₺`;
}

/* =======================
   ORDER SYSTEM
======================= */

buyButton.addEventListener("click", async () => {

    const qty = Number(amount.value || 0);

    if (qty <= 0) return;

    const totalPrice = Number(service.value) * qty;

    if (totalPrice > userBalance) {

        showToast("error", "Yetersiz Bakiye", "Lütfen bakiye yükleyiniz.");
        return;

    }

    try {

        const order = {
            uid: currentUser.uid,
            email: currentUser.email,
            platform: platform.value,
            service: service.options[service.selectedIndex].text,
            quantity: qty,
            username: username.value,
            link: link.value,
            note: note.value,
            unitPrice: Number(service.value),
            totalPrice,
            status: "Bekliyor",
            payment: "Bakiye",
            createdAt: serverTimestamp()
        };

        await addDoc(collection(db, "orders"), order);

        const userRef = doc(db, "users", currentUser.uid);

        userBalance -= totalPrice;

        await updateDoc(userRef, {
            balance: userBalance
        });

        updateBalanceUI();

        amount.value = "";
        username.value = "";
        link.value = "";
        note.value = "";

        calculate();

        showToast("success", "Sipariş Oluşturuldu", "Sipariş başarıyla alındı.");

    } catch (err) {

        console.error(err);
        showToast("error", "Hata", "Sipariş oluşturulamadı.");

    }

});

/* =======================
   TOAST SYSTEM (BU DOSYAYA DAHİL)
======================= */

function showToast(type, title, message) {

    let container = document.getElementById("toastContainer");

    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        document.body.appendChild(container);
    }

    const el = document.createElement("div");

    el.className = `toast ${type}`;

    el.innerHTML = `
        <b>${title}</b><br>
        <small>${message}</small>
    `;

    container.appendChild(el);

    setTimeout(() => el.remove(), 3500);
}