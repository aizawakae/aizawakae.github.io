import { db } from "./firebase/config.js";

import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const ordersContainer = document.getElementById("ordersContainer");
const orderCount = document.getElementById("orderCount");

async function loadAdminOrders() {

    try {

        const snapshot = await getDocs(
            query(
                collection(db, "orders"),
                orderBy("createdAt", "desc"),
                limit(5)
            )
        );

        ordersContainer.innerHTML = "";

        orderCount.textContent =
            `${snapshot.size} Sipariş`;

        snapshot.forEach((docSnap) => {

            const order = docSnap.data();

            const orderId = docSnap.id;

            const row = document.createElement("div");

            row.className = "admin-order";

            row.innerHTML = `

                <span>${order.platform || "-"}</span>

                <span>${order.target || "-"}</span>

                <span>${order.status || "-"}</span>

                <div class="admin-order-actions">

                    <button class="order-processing">
                        <i class="fa-solid fa-spinner"></i>
                    </button>

                    <button class="order-complete">
                        <i class="fa-solid fa-check"></i>
                    </button>

                    <button class="order-delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            `;

            row.querySelector(".order-complete").addEventListener("click", async () => {

    await updateDoc(
        doc(db, "orders", orderId),
        {
            status: "Tamamlandı"
        }
    );

    loadAdminOrders();

});

row.querySelector(".order-processing").addEventListener("click", async () => {

    await updateDoc(
        doc(db, "orders", orderId),
        {
            status: "İşleniyor"
        }
    );

    loadAdminOrders();

});

row.querySelector(".order-delete").addEventListener("click", async () => {

    if (!confirm("Bu sipariş silinsin mi?")) return;

    await deleteDoc(
        doc(db, "orders", orderId)
    );

    loadAdminOrders();

});

            ordersContainer.appendChild(row);

        });

    }

    catch (error) {

        console.error(error);

    }

}

loadAdminOrders();