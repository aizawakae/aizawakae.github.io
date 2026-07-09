// =========================================
// IMPORTS
// =========================================

import { auth, db } from "./firebase/config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    getCountFromServer,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// =========================================
// ELEMENTS
// =========================================


const totalUsers = document.getElementById("totalUsers");
const totalOrders = document.getElementById("totalOrders");
const activeOrders = document.getElementById("activeOrders");
const totalBalance = document.getElementById("totalBalance");




// =========================================
// DASHBOARD
// =========================================

async function loadDashboard() {

    try {

        // USERS

        const usersSnapshot = await getCountFromServer(
            collection(db, "users")
        );

        totalUsers.textContent = usersSnapshot.data().count;

        // ORDERS

        const ordersSnapshot = await getCountFromServer(
            collection(db, "orders")
        );

        totalOrders.textContent = ordersSnapshot.data().count;

// ACTIVE ORDERS

const activeWaitingQuery = query(
    collection(db, "orders"),
    where("status", "==", "Beklemede")
);

const activeProcessingQuery = query(
    collection(db, "orders"),
    where("status", "==", "İşleniyor")
);

const waitingSnapshot = await getCountFromServer(activeWaitingQuery);

const processingSnapshot = await getCountFromServer(activeProcessingQuery);

console.log("Beklemede:", waitingSnapshot.data().count);
console.log("İşleniyor:", processingSnapshot.data().count);

const activeCount =
    waitingSnapshot.data().count +
    processingSnapshot.data().count;

console.log("Toplam aktif:", activeCount);

activeOrders.innerText = activeCount;

        // TOTAL BALANCE

        const users = await getDocs(
            collection(db, "users")
        );

        let balance = 0;

        users.forEach((doc) => {

            const data = doc.data();

            balance += Number(data.balance || 0);

        });

        totalBalance.textContent =
            "₺" + balance.toLocaleString("tr-TR");

    }

    catch (error) {

        console.error(error);

    }

}
// =========================================
// USER SEARCH
// =========================================

const searchInput = document.getElementById("searchUser");
const searchButton = document.getElementById("searchButton");

const adminUsername = document.getElementById("adminUsername");
const adminEmail = document.getElementById("adminEmail");
const adminPremium = document.getElementById("adminPremium");

let selectedUserId = null;
let selectedUserData = null;

searchButton.addEventListener("click", searchUser);

searchInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        searchUser();

    }

});

async function searchUser() {

    const keyword = searchInput.value.trim().toLowerCase();

    if (!keyword) return;

    try {

        const usersSnapshot = await getDocs(collection(db, "users"));

        let found = false;

        usersSnapshot.forEach((userDoc) => {

            if (found) return;

            const data = userDoc.data();

            const username = (data.username || "").toLowerCase();
            const email = (data.email || "").toLowerCase();

if (
    username === keyword ||
    email === keyword
) {

    found = true;

    selectedUserId = userDoc.id;
    selectedUserData = data;

    adminUsername.innerHTML =
        `${data.username || "-"}

        ${data.verified
            ? '<i class="fa-solid fa-circle-check" style="color:#1d9bf0;font-size:16px;"></i>'
            : ""}`;

    adminEmail.textContent =
        data.email || "-";

        console.log(data);

    adminPremium.textContent =
        data.premium
            ? "👑 Premium Üye"
            : "Standart Üye";

}

        });

        if (!found) {

            selectedUserId = null;
            selectedUserData = null;

            adminUsername.textContent =
                "Kullanıcı bulunamadı";

            adminEmail.textContent = "-";

        }

    }

    catch (error) {

        console.error(error);

    }

}
// =========================================
// USER ACTIONS
// =========================================

import {
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const giveBalance = document.getElementById("giveBalance");
const removeBalance = document.getElementById("removeBalance");

const givePremium = document.getElementById("givePremium");
const removePremium = document.getElementById("removePremium");

const verifyUser = document.getElementById("verifyUser");
const removeVerify = document.getElementById("removeVerify");

const banUser = document.getElementById("banUser");
const unbanUser = document.getElementById("unbanUser");

// =========================================
// BALANCE +
// =========================================

giveBalance.addEventListener("click", async () => {

    if (!selectedUserId) return;

    const amount = Number(prompt("Eklenecek bakiye"));

    if (!amount || amount <= 0) return;

    await updateDoc(doc(db, "users", selectedUserId), {

        balance: Number(selectedUserData.balance || 0) + amount

    });

    selectedUserData.balance =
        Number(selectedUserData.balance || 0) + amount;

    alert("Bakiye eklendi.");

});

// =========================================
// BALANCE -
// =========================================

removeBalance.addEventListener("click", async () => {

    if (!selectedUserId) return;

    const amount = Number(prompt("Silinecek bakiye"));

    if (!amount || amount <= 0) return;

    let newBalance =
        Number(selectedUserData.balance || 0) - amount;

    if (newBalance < 0)
        newBalance = 0;

    await updateDoc(doc(db, "users", selectedUserId), {

        balance: newBalance

    });

    selectedUserData.balance = newBalance;

    alert("Bakiye güncellendi.");

});

// =========================================
// PREMIUM
// =========================================

givePremium.addEventListener("click", async () => {

    if (!selectedUserId) return;

    await updateDoc(doc(db, "users", selectedUserId), {

        premium: true

    });

    alert("Premium verildi.");

});

removePremium.addEventListener("click", async () => {

    if (!selectedUserId) return;

    await updateDoc(doc(db, "users", selectedUserId), {

        premium: false

    });

    alert("Premium kaldırıldı.");

});

// =========================================
// VERIFIED
// =========================================

verifyUser.addEventListener("click", async () => {

    if (!selectedUserId) return;

    await updateDoc(doc(db, "users", selectedUserId), {

        verified: true

    });

    alert("Mavi tik verildi.");

});

removeVerify.addEventListener("click", async () => {

    if (!selectedUserId) return;

    await updateDoc(doc(db, "users", selectedUserId), {

        verified: false

    });

    alert("Mavi tik kaldırıldı.");

});

// =========================================
// BAN
// =========================================

banUser.addEventListener("click", async () => {

    if (!selectedUserId) return;

    await updateDoc(doc(db, "users", selectedUserId), {

        banned: true

    });

    alert("Kullanıcı banlandı.");

});

unbanUser.addEventListener("click", async () => {

    if (!selectedUserId) return;

    await updateDoc(doc(db, "users", selectedUserId), {

        banned: false

    });

    alert("Ban kaldırıldı.");

});
// =========================================
// LOAD USERS
// =========================================

const usersContainer = document.getElementById("usersContainer");

async function loadUsers() {

    try {

        usersContainer.innerHTML = "";

        const snapshot = await getDocs(collection(db, "users"));

        snapshot.forEach((userDoc) => {

            const data = userDoc.data();

            const card = document.createElement("div");

            card.className = "user-list-item";

            card.innerHTML = `

                <div class="user-list-left">

                    <div class="user-list-avatar">

                        <img src="assets/img/logo.png">

                    </div>

                    <div class="user-list-info">

                        <h4>

                            ${data.username || "İsimsiz"}

                        </h4>

                        <span>

                            ${data.email || "-"}

                        </span>

                    </div>

                </div>

                <div class="user-list-right">

                    <button data-id="${userDoc.id}" class="select-user">

                        <i class="fa-solid fa-arrow-pointer"></i>

                    </button>

                </div>

            `;

            usersContainer.appendChild(card);

        });

        document
        .querySelectorAll(".select-user")
        .forEach(button=>{

            button.addEventListener("click",()=>{

                searchInput.value="";

                selectedUserId=button.dataset.id;

                loadSelectedUser();

            });

        });

    }

    catch(error){

        console.error(error);

    }

}

// =========================================
// LOAD SELECTED USER
// =========================================

async function loadSelectedUser(){

    if(!selectedUserId) return;

    try{

        const snap=await getDoc(
            doc(db,"users",selectedUserId)
        );

        if(!snap.exists()) return;

        selectedUserData=snap.data();

        adminUsername.textContent=
        selectedUserData.username || "-";

        adminEmail.textContent=
        selectedUserData.email || "-";

    }

    catch(error){

        console.error(error);

    }

}

// =========================================
// START
// =========================================

loadUsers();
// =========================================
// ADMIN CHECK
// =========================================

async function checkAdmin(uid){

    try{

        const snap = await getDoc(
            doc(db,"users",uid)
        );

        if(!snap.exists()){

            location.href="panel.html";
            return;

        }

        const data = snap.data();

        // Şimdilik kullanıcı adına göre kontrol
        // Sonra admin:true yapacağız

        if(data.username !== "aizawakae"){

            location.href="panel.html";
            return;

        }

    }

    catch(error){

        console.error(error);

        location.href="panel.html";

    }

}

// =========================================
// REFRESH
// =========================================

async function refreshDashboard(){

    await loadDashboard();

    await loadUsers();

}

// =========================================
// AUTO REFRESH
// =========================================

setInterval(()=>{

    refreshDashboard();

},30000);

// =========================================
// LOGOUT
// =========================================

const logoutButton=document.getElementById("logoutButton");

if(logoutButton){

    logoutButton.addEventListener("click",async()=>{

        await auth.signOut();

        location.href="login.html";

    });

}

// =========================================
// WINDOW
// =========================================

window.refreshDashboard=refreshDashboard;

window.searchUser=searchUser;

// =========================================
// START
// =========================================

onAuthStateChanged(auth,async(user)=>{

    if(!user){

        location.href="login.html";
        return;

    }

    await checkAdmin(user.uid);

    await loadDashboard();

    await loadUsers();

});