/*=========================================================
    AIZAWAKAE
    KAE.JS
=========================================================*/

"use strict";

/*=========================================================
    SELECTORS
=========================================================*/

const body = document.body;

const header = document.querySelector(".header");

const loader = document.getElementById("loader");

const mouseGlow = document.querySelector(".mouse-glow");

const cursorDot = document.querySelector(".cursor-dot");

const cursorGlow = document.querySelector(".cursor-glow");

const scrollTopButton = document.getElementById("scrollTop");

const revealElements = document.querySelectorAll(
    ".reveal,.reveal-left,.reveal-right,.reveal-scale"
);

const counters = document.querySelectorAll(".counter");

/*=========================================================
    LOADER
=========================================================*/

window.addEventListener("load", () => {

    setTimeout(() => {

        loader.style.opacity = "0";

        loader.style.visibility = "hidden";

        loader.style.pointerEvents = "none";

    }, 700);

});

/*=========================================================
    HEADER
=========================================================*/

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});

/*=========================================================
    SCROLL TOP
=========================================================*/

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        scrollTopButton.classList.add("show");

    } else {

        scrollTopButton.classList.remove("show");

    }

});

scrollTopButton?.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

/*=========================================================
    CURSOR
=========================================================*/

window.addEventListener("mousemove", e => {

    const x = e.clientX;

    const y = e.clientY;

    if (cursorDot) {

        cursorDot.style.left = x + "px";

        cursorDot.style.top = y + "px";

    }

    if (cursorGlow) {

        cursorGlow.animate({

            left: x + "px",

            top: y + "px"

        }, {

            duration: 250,

            fill: "forwards"

        });

    }

    if (mouseGlow) {

        mouseGlow.style.left = x + "px";

        mouseGlow.style.top = y + "px";

    }

});

/*=========================================================
    CURSOR HOVER
=========================================================*/

const hoverItems = document.querySelectorAll(

    "a,button,.skill-card,.setup-card,.project-card,.social-card,.gallery-card"

);

hoverItems.forEach(item => {

    item.addEventListener("mouseenter", () => {

        if (cursorGlow) {

            cursorGlow.style.width = "80px";

            cursorGlow.style.height = "80px";

            cursorGlow.style.borderColor = "#ff2d55";

            cursorGlow.style.background = "rgba(255,45,85,.08)";

        }

    });

    item.addEventListener("mouseleave", () => {

        if (cursorGlow) {

            cursorGlow.style.width = "46px";

            cursorGlow.style.height = "46px";

            cursorGlow.style.borderColor = "rgba(255,255,255,.25)";

            cursorGlow.style.background = "transparent";

        }

    });

});

/*=========================================================
    REVEAL
=========================================================*/

const revealObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("active");

        }

    });

}, {

    threshold: .15

});

revealElements.forEach(item => {

    revealObserver.observe(item);

});

/*=========================================================
    COUNTER
=========================================================*/

const counterObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const counter = entry.target;

        const target = Number(counter.dataset.target);

        let current = 0;

        const increment = target / 120;

        const update = () => {

            current += increment;

            if (current < target) {

                counter.textContent = Math.floor(current);

                requestAnimationFrame(update);

            } else {

                counter.textContent = target.toLocaleString();

            }

        };

        update();

        counterObserver.unobserve(counter);

    });

});

counters.forEach(counter => {

    counterObserver.observe(counter);

});