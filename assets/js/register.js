import { auth, db } from "../../firebase/config.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const form = document.getElementById("registerForm");
const messageBox = document.getElementById("messageBox");

function showMessage(message, type){

    messageBox.textContent = message;
    messageBox.className = "message-box " + type;

    setTimeout(() => {
        messageBox.className = "message-box";
    }, 3000);

}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;

    if (password !== password2) {
        showMessage("Şifreler uyuşmuyor.", "error");
        return;
    }

    try {

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        await updateProfile(user, {
            displayName: name
        });

        await setDoc(doc(db, "users", user.uid), {

            uid: user.uid,
            username: name,
            email: email,

            plan: "standard",
            admin: false,
            banned: false,

            balance: 0,
            wallet: 0,
            totalOrders: 0,

            avatar: "",
            verified: false,
            vip: false,

            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()

        });

        showMessage("Kayıt başarılı.", "success");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);

    } catch (error) {

        switch (error.code) {

            case "auth/email-already-in-use":
                showMessage("Bu e-posta zaten kayıtlı.", "error");
                break;

            case "auth/weak-password":
                showMessage("Şifre en az 6 karakter olmalı.", "error");
                break;

            default:
                console.error(error);
                showMessage(error.message, "error");

        }

    }

});