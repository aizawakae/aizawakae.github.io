import { auth } from "../../firebase/config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const messageBox = document.getElementById("messageBox");

function showMessage(message, type){

    messageBox.textContent = message;

    messageBox.className = "message-box " + type;

    setTimeout(()=>{

        messageBox.className="message-box";

    },3000);

}

loginForm.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const email=document.getElementById("email").value.trim();
    const password=document.getElementById("password").value;

    try{

        showMessage("Giriş yapılıyor...","success");

        await signInWithEmailAndPassword(auth,email,password);

        showMessage("Giriş başarılı.","success");

        setTimeout(()=>{

            window.location.href="index.html";

        },1000);

    }catch(error){

        switch(error.code){

            case "auth/invalid-email":
                showMessage("Geçersiz e-posta adresi.","error");
                break;

            case "auth/invalid-credential":
                showMessage("E-posta veya şifre hatalı.","error");
                break;

            case "auth/user-disabled":
                showMessage("Bu hesap devre dışı bırakılmış.","error");
                break;

            default:
                showMessage(error.message,"error");

        }

    }

});