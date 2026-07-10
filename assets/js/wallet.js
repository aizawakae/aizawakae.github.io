/*=========================================================
    IMPORTS
=========================================================*/

import { auth, db } from "./firebase/config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {

    doc,
    getDoc,
    collection,
    getDocs,
    query,
    orderBy,
    limit

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/*=========================================================
    ELEMENTS
=========================================================*/

const walletBalance = document.getElementById("walletBalance");

const totalOrders = document.getElementById("totalOrders");

const totalSpent = document.getElementById("totalSpent");

const pendingTransactions = document.getElementById("pendingTransactions");

const transactionTable = document.getElementById("transactionTable");

const depositBtn = document.getElementById("depositBtn");

const historyBtn = document.getElementById("historyBtn");

const depositModal = document.getElementById("depositModal");

const depositClose = document.getElementById("depositClose");

const depositContinue = document.getElementById("depositContinue");

const depositAmount = document.getElementById("depositAmount");

/*=========================================================
    VARIABLES
=========================================================*/

let currentUser = null;

/*=========================================================
    AUTH CHECK
=========================================================*/

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "auth.html";

        return;

    }

    currentUser = user;

    await loadWallet();

});

/*=========================================================
    LOAD
=========================================================*/

async function loadWallet(){

    await loadUserData();

    await loadTransactions();

}
/*=========================================================
    LOAD USER DATA
=========================================================*/

async function loadUserData(){

    try{

        const userRef = doc(db, "users", currentUser.uid);

        const userSnap = await getDoc(userRef);

        if(!userSnap.exists()){

            console.error("User document not found.");

            return;

        }

        const userData = userSnap.data();

        const balance = Number(userData.balance || 0);

        walletBalance.textContent = `₺${balance.toFixed(2)}`;

const ordersQuery = query(
    collection(db, "orders")
);

const ordersSnap = await getDocs(ordersQuery);

let orderCount = 0;
let totalPrice = 0;
let pendingCount = 0;

ordersSnap.forEach((doc)=>{

    const order = doc.data();

    if(order.uid !== currentUser.uid) return;

    orderCount++;

    const price = Number(
        String(order.total || "0")
            .replace(/[₺.,]/g,"")
    ) / 100;

    totalPrice += price;

    if(order.status === "Beklemede"){

        pendingCount++;

    }

});

totalOrders.textContent = orderCount;

totalSpent.textContent = formatPrice(totalPrice);

pendingTransactions.textContent = pendingCount;

    }

    catch(error){

        console.error("Wallet Error:", error);

    }

}

/*=========================================================
    LOAD TRANSACTIONS
=========================================================*/

async function loadTransactions(){

    try{

        const ordersQuery = query(
            collection(db,"orders")
        );

        const ordersSnap = await getDocs(ordersQuery);

        let html = "";

        ordersSnap.forEach((doc)=>{

            const order = doc.data();

            if(order.uid !== currentUser.uid) return;

            html += `

                <tr>

                    <td>${formatDate(order.createdAt)}</td>

                    <td>${order.service || "-"}</td>

                    <td>${order.total || "₺0,00"}</td>

                    <td>

                        <span class="status ${getStatusClass(order.status)}">

                            ${order.status}

                        </span>

                    </td>

                </tr>

            `;

        });

        if(html===""){

            html=`

                <tr>

                    <td colspan="4">

                        Henüz işlem bulunmuyor.

                    </td>

                </tr>

            `;

        }

        transactionTable.innerHTML = html;

    }

    catch(error){

        console.error(error);

    }

}

function getStatusClass(status){

    switch(status){

        case "Tamamlandı":
            return "success";

        case "Beklemede":
            return "pending";

        case "İptal":
        case "İptal Edildi":
            return "failed";

        default:
            return "pending";

    }

}
/*=========================================================
    EVENTS
=========================================================*/

depositBtn?.addEventListener("click", () => {

    openDepositModal();

});

historyBtn?.addEventListener("click", () => {

    scrollToHistory();

});

/*=========================================================
    DEPOSIT
=========================================================*/

function openDepositModal(){

    depositModal.style.display = "flex";

    depositAmount.focus();

}

/*=========================================================
    HISTORY
=========================================================*/

function scrollToHistory(){

    const historySection = document.querySelector(".wallet-history");

    if(!historySection) return;

    historySection.scrollIntoView({

        behavior:"smooth",

        block:"start"

    });

}

/*=========================================================
    FORMAT
=========================================================*/

function formatPrice(value){

    return new Intl.NumberFormat("tr-TR",{

        style:"currency",

        currency:"TRY",

        minimumFractionDigits:2

    }).format(Number(value));

}

/*=========================================================
    REFRESH
=========================================================*/

async function refreshWallet(){

    await loadUserData();

    await loadTransactions();

}
/*=========================================================
    LIVE BALANCE UPDATE
=========================================================*/

async function updateBalance(){

    try{

        const userRef = doc(db, "users", currentUser.uid);

        const userSnap = await getDoc(userRef);

        if(!userSnap.exists()) return;

        const balance = Number(userSnap.data().balance || 0);

        walletBalance.textContent = formatPrice(balance);

    }

    catch(error){

        console.error(error);

    }

}

/*=========================================================
    AUTO REFRESH
=========================================================*/

setInterval(async()=>{

    if(!currentUser) return;

    await updateBalance();

},30000);

/*=========================================================
    WINDOW
=========================================================*/

window.addEventListener("focus",async()=>{

    if(!currentUser) return;

    await refreshWallet();

});

/*=========================================================
    FUNCTIONS
=========================================================*/

window.wallet={

    refresh:refreshWallet,

    balance:updateBalance,

    deposit:openDepositModal

};

/*=========================================================
    READY
=========================================================*/

console.log("Wallet loaded successfully.");


/*=========================================================
    KK
=========================================================*/


function formatDate(timestamp){

    if(!timestamp) return "-";

    const date = timestamp.toDate();

    return date.toLocaleString("tr-TR",{

        day:"2-digit",
        month:"2-digit",
        year:"numeric",
        hour:"2-digit",
        minute:"2-digit"

    });

}

/*=========================================================
    QUICK BALANCE
=========================================================*/

let selectedAmount = 0;

const quickBalanceButtons = document.querySelectorAll(".quick-balance");

quickBalanceButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        quickBalanceButtons.forEach(btn=>{

            btn.classList.remove("active");

        });

        button.classList.add("active");

        selectedAmount = Number(button.dataset.amount);

    });

});

/*=========================================================
    DEPOSIT MODAL
=========================================================*/

depositClose?.addEventListener("click",()=>{

    depositModal.style.display="none";

});

depositModal?.addEventListener("click",(e)=>{

    if(e.target===depositModal){

        depositModal.style.display="none";

    }

});