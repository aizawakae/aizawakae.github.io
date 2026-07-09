import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    getDoc,
    updateDoc,
    increment
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/*=========================================================
    AIZAWAKAE SERVICES
=========================================================*/

"use strict";

/*=========================================================
    DOM ELEMENTS
=========================================================*/

const form = document.getElementById("serviceForm");

const platformSelect = document.getElementById("platform");

const categorySelect = document.getElementById("category");

const serviceSelect = document.getElementById("service");

const targetLabel = document.getElementById("targetLabel");

const targetInput = document.getElementById("targetInput");

const quantityInput = document.getElementById("quantity");

const estimatedPrice = document.getElementById("estimatedPrice");

const submitButton = document.querySelector(".service-submit");

/*=========================================================
    SERVICES DATABASE
=========================================================*/

const services = {

    instagram: {

        label: "Kullanıcı Adı",

        categories: {

            followers: {

                title: "Takipçi",

                services: [

                    "Premium Takipçi",

                    "Gerçek Takipçi",

                    "Hızlı Takipçi"

                ]

            },

            likes: {

                title: "Beğeni",

                services: [

                    "Premium Beğeni",

                    "Gerçek Beğeni"

                ]

            },

            views: {

                title: "Görüntülenme",

                services: [

                    "Video Görüntülenme",

                    "Reels Görüntülenme"

                ]

            },

            comments: {

                title: "Yorum",

                services: [

                    "Rastgele Yorum",

                    "Özel Yorum"

                ]

            }

        }

    },

    tiktok: {

        label: "Kullanıcı Adı",

        categories: {

            followers: {

                title: "Takipçi",

                services: [

                    "TikTok Takipçi"

                ]

            },

            likes: {

                title: "Beğeni",

                services: [

                    "TikTok Beğeni"

                ]

            },

            views: {

                title: "İzlenme",

                services: [

                    "Video İzlenme"

                ]

            }

        }

    },

    youtube: {

        label: "Video Linki",

        categories: {

            subscribers: {

                title: "Abone",

                services: [

                    "Premium Abone"

                ]

            },

            views: {

                title: "İzlenme",

                services: [

                    "Premium İzlenme"

                ]

            },

            likes: {

                title: "Beğeni",

                services: [

                    "Video Beğeni"

                ]

            }

        }

    },

    discord: {

        label: "Sunucu Davet Linki",

        categories: {

            members: {

                title: "Üye",

                services: [

                    "Gerçek Üye"

                ]

            },

            boosts: {

                title: "Boost",

                services: [

                    "Server Boost"

                ]

            }

        }

    }

};

/*=========================================================
    RESET SELECTS
=========================================================*/

function resetCategory(){

    categorySelect.innerHTML = `
        <option value="">Kategori Seçin</option>
    `;

}

function resetService(){

    serviceSelect.innerHTML = `
        <option value="">Hizmet Seçin</option>
    `;

}

/*=========================================================
    START
=========================================================*/

resetCategory();

resetService();

/*=========================================================
    LOAD CATEGORIES
=========================================================*/

function loadCategories(){

    resetCategory();

    resetService();

    const platform = platformSelect.value;

    if(!platform) return;

    const data = services[platform];

    if(!data) return;

    Object.keys(data.categories).forEach(key=>{

        const category = data.categories[key];

        const option = document.createElement("option");

        option.value = key;

        option.textContent = category.title;

        categorySelect.appendChild(option);

    });

}

/*=========================================================
    LOAD SERVICES
=========================================================*/

function loadServices(){

    resetService();

    const platform = platformSelect.value;

    const category = categorySelect.value;

    if(!platform || !category) return;

    const data = services[platform];

    if(!data) return;

    const list = data.categories[category].services;

    list.forEach(service=>{

        const option = document.createElement("option");

        option.value = service;

        option.textContent = service;

        serviceSelect.appendChild(option);

    });

}

/*=========================================================
    UPDATE TARGET
=========================================================*/

function updateTarget(){

    const platform = platformSelect.value;

    if(!platform) return;

    const label = services[platform].label;

    targetLabel.textContent = label;

    switch(platform){

        case "instagram":

            targetInput.placeholder = "@kullaniciadi";

        break;

        case "tiktok":

            targetInput.placeholder = "@kullaniciadi";

        break;

        case "youtube":

            targetInput.placeholder = "https://youtube.com/...";

        break;

        case "discord":

            targetInput.placeholder = "https://discord.gg/...";

        break;

    }

}

/*=========================================================
    EVENTS
=========================================================*/

platformSelect.addEventListener("change",()=>{

    loadCategories();

    updateTarget();

});

categorySelect.addEventListener("change",()=>{

    loadServices();

});

/*=========================================================
    SERVICE PRICES
=========================================================*/

const servicePrices = {

    "Premium Takipçi": { price:75, per:1000 },

    "Gerçek Takipçi": { price:180, per:1000 },

    "Hızlı Takipçi": { price:45, per:1000 },

    "Premium Beğeni": { price:50, per:1000 },

    "Gerçek Beğeni": { price:80, per:1000 },

    "Video Görüntülenme": { price:100, per:100000 },

    "Reels Görüntülenme": { price:100, per:100000 },

    "Rastgele Yorum": { price:170, per:100 },

    "Özel Yorum": { price:170, per:100 },

    "Kaydetme": { price:45, per:1000 },

    "Paylaşım": { price:30, per:1000 },

    "Repost": { price:100, per:1000 },

    "Kapanan Hesabı Açma": { price:6499, per:1 },

    "Meta Verified": { price:3600, per:1 },

    "Premium Abone": { price:500, per:1000 },

    "Video Beğeni": { price:250, per:1000 },

    "Premium İzlenme": { price:100, per:1000 },

    "Online Üye": { price:120, per:1000 },

    "Offline Üye": { price:85, per:1000 },

    "Nitro Plus": { price:145, per:1 },

    "Özel Sunucu Botu": { price:3390, per:1 },

    "TikTok Takipçi": { price:225, per:1000 },

    "TikTok Beğeni": { price:45, per:1000 },

    "TikTok İzlenme": { price:100, per:10000 },

    "TikTok Paylaşım": { price:45, per:1000 },

    "TikTok Yorum": { price:180, per:100 }

};

/*=========================================================
    FORMAT PRICE
=========================================================*/

function formatPrice(price){

    return "₺" + price.toLocaleString("tr-TR",{

        minimumFractionDigits:2,

        maximumFractionDigits:2

    });

}

/*=========================================================
    UPDATE PRICE
=========================================================*/

function updatePrice(){

    const service = serviceSelect.value;

    const quantity = Number(quantityInput.value);

if(!service || quantity<=0){

    estimatedPrice.textContent="--";

    return;

}

  const serviceData = servicePrices[service];

if(!serviceData){

    estimatedPrice.textContent="--";

    return;

}

const total =
(quantity / serviceData.per) * serviceData.price;

    estimatedPrice.textContent = formatPrice(total);



}

/*=========================================================
    EVENTS
=========================================================*/

serviceSelect.addEventListener("change",updatePrice);

quantityInput.addEventListener("input",updatePrice);

/*=========================================================
    VALIDATION
=========================================================*/

function validateOrder(){

    if(platformSelect.value===""){

        alert("Lütfen platform seçiniz.");

        platformSelect.focus();

        return false;

    }

    if(categorySelect.value===""){

        alert("Lütfen kategori seçiniz.");

        categorySelect.focus();

        return false;

    }

    if(serviceSelect.value===""){

        alert("Lütfen hizmet seçiniz.");

        serviceSelect.focus();

        return false;

    }

    if(targetInput.value.trim()===""){

        alert("Lütfen hedef bilgisini giriniz.");

        targetInput.focus();

        return false;

    }

    if(quantityInput.value===""){

        alert("Lütfen miktar giriniz.");

        quantityInput.focus();

        return false;

    }

    if(Number(quantityInput.value)<=0){

        alert("Geçerli bir miktar giriniz.");

        quantityInput.focus();

        return false;

    }

    return true;

}

/*=========================================================
    BUTTON
=========================================================*/

submitButton.addEventListener("click",createOrder);

/*=========================================================
    SHOW MESSAGE
=========================================================*/

function showMessage(title,message,type="success"){

    const old=document.querySelector(".service-popup");

    if(old){

        old.remove();

    }

    const popup=document.createElement("div");

    popup.className="service-popup";

    popup.innerHTML=`

        <div class="service-popup-box ${type}">

            <i class="fa-solid ${
                type==="success"
                ?"fa-circle-check"
                :"fa-circle-xmark"
            }"></i>

            <h3>${title}</h3>

            <p>${message}</p>

        </div>

    `;

    document.body.appendChild(popup);

    requestAnimationFrame(()=>{

        popup.classList.add("show");

    });

    setTimeout(()=>{

        popup.classList.remove("show");

        setTimeout(()=>{

            popup.remove();

        },300);

    },2500);

}

/*=========================================================
    RESET FORM
=========================================================*/

function resetForm(){

    form.reset();

    resetCategory();

    resetService();

    estimatedPrice.textContent = "--";

    targetLabel.textContent = "Username";

    targetInput.placeholder = "@kullaniciadi";

}

/*=========================================================
    CREATE ORDER
=========================================================*/

async function createOrder(){

    if(!validateOrder()){

        showMessage(
            "Eksik Bilgi",
            "Lütfen tüm alanları doldurun.",
            "error"
        );

        return;

    }

    try{

        const totalPrice = parseFloat(
    estimatedPrice.textContent
        .replace("₺", "")
        .replace(/\./g, "")
        .replace(",", ".")
);


const userRef = doc(db, "users", auth.currentUser.uid);

const userSnap = await getDoc(userRef);

if (!userSnap.exists()) {

    throw new Error("Kullanıcı bulunamadı.");

}

const userData = userSnap.data();

if (userData.balance < totalPrice) {

    showMessage(
        "Yetersiz Bakiye",
        "Bu siparişi oluşturmak için yeterli bakiyeniz yok.",
        "error"
    );

    return;

}

        const order = {

            uid: auth.currentUser.uid,

            platform: platformSelect.value,

            category: categorySelect.value,

            service: serviceSelect.value,

            target: targetInput.value,

            quantity: Number(quantityInput.value),

            total: estimatedPrice.textContent,

            status: "Beklemede",

            createdAt: serverTimestamp()

        };

        await addDoc(collection(db, "orders"), order);

        await updateDoc(userRef, {
    balance: increment(-totalPrice)
});

        console.log("Sipariş Firestore'a kaydedildi.");

        showMessage(
            "Başarılı",
            "Sipariş başarıyla oluşturuldu.",
            "success"
        );

        resetForm();

    }catch(error){

        console.error(error);

        showMessage(
            "Hata",
            error.message,
            "error"
        );

    }

}
/*=========================================================
    BUTTON
=========================================================*/

submitButton.removeEventListener("click",createOrder);

submitButton.addEventListener("click",createOrder);

/*=========================================================
    SAVE ORDER
=========================================================*/

function saveOrder(order){

    const orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    order.id = crypto.randomUUID();

    order.status = "Beklemede";

    order.date = new Date().toLocaleString("tr-TR");

    orders.push(order);

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

}