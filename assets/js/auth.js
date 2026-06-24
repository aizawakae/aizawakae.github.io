console.log("auth.js çalışıyor");
// =======================================================
// AIZAWAKAE AUTH SYSTEM V1 (CLEAN)
// LOGIN + REGISTER + FIREBASE
// =======================================================

import { auth, db } from "./firebase/config.js";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    doc,
    setDoc,
    query,
    where,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ===============================
// ELEMENTS
// ===============================

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const regUsername = document.getElementById("regUsername");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const regPassword2 = document.getElementById("regPassword2");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const togglePasswordBtn = document.getElementById("togglePassword");


// ===============================
// STATE
// ===============================

let isLoading = false;


// ===============================
// TOGGLE LOGIN / REGISTER
// ===============================

showRegister?.addEventListener("click", (e) => {
    e.preventDefault();

    loginForm.style.display = "none";
    registerForm.style.display = "flex";
});

showLogin?.addEventListener("click", (e) => {
    e.preventDefault();

    registerForm.style.display = "none";
    loginForm.style.display = "flex";
});


// ===============================
// PASSWORD TOGGLE
// ===============================

togglePasswordBtn?.addEventListener("click", () => {

    const isPass = passwordInput.type === "password";

    passwordInput.type = isPass ? "text" : "password";

    togglePasswordBtn.innerHTML = isPass
        ? `<i class="fa-solid fa-eye-slash"></i>`
        : `<i class="fa-solid fa-eye"></i>`;
});


// ===============================
// HELPERS
// ===============================

async function getEmailFromUsername(username) {

    const q = query(
        collection(db, "users"),
        where("username", "==", username)
    );

    const snap = await getDocs(q);

    if (snap.empty) return null;

    let email = null;

    snap.forEach(doc => {
        email = doc.data().email;
    });

    return email;
}


// ===============================
// LOGIN
// ===============================

async function loginUser(username, password) {

    const email = await getEmailFromUsername(username);

    if (!email) {
        alert("Kullanıcı bulunamadı");
        return;
    }

    await signInWithEmailAndPassword(auth, email, password);

    window.location.href = "index.html";
}


// ===============================
// REGISTER
// ===============================

async function registerUser(username, email, password, password2) {

    if (password !== password2) {
        alert("Şifreler uyuşmuyor");
        return;
    }

    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    const uid = userCred.user.uid;

    await setDoc(doc(db, "users", uid), {
        username,
        email,
        balance: 0,
        premium: false,
        createdAt: serverTimestamp()
    });

    alert("Kayıt başarılı!");

    registerForm.style.display = "none";
    loginForm.style.display = "flex";
}


// ===============================
// LOGIN SUBMIT
// ===============================

loginForm?.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (isLoading) return;

    isLoading = true;

    try {

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            alert("Boş alan bırakma");
            return;
        }

        await loginUser(username, password);

    } catch (err) {
        console.error(err);
        alert("Giriş başarısız");
    }

    isLoading = false;
});


// ===============================
// REGISTER SUBMIT
// ===============================

registerForm?.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (isLoading) return;

    isLoading = true;

    try {

        const username = regUsername.value.trim();
        const email = regEmail.value.trim();
        const password = regPassword.value.trim();
        const password2 = regPassword2.value.trim();

        if (!username || !email || !password) {
            alert("Boş alan bırakma");
            return;
        }

        await registerUser(username, email, password, password2);

    } catch (err) {
        console.error(err);
        alert("Kayıt başarısız");
    }

    isLoading = false;
});


// ===============================
// FORGOT PASSWORD (basic)
// ===============================

window.forgotPassword = async function(email) {

    if (!email) return alert("Email gir");

    await sendPasswordResetEmail(auth, email);

    alert("Şifre sıfırlama maili gönderildi");
};
