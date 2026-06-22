/* ==========================================================
   AIZAWA ANIMATIONS V1
   Premium Smooth Scroll
========================================================== */

(function () {

    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function smoothScroll(targetY, duration = 1100) {

        const startY = window.pageYOffset;
        const distance = targetY - startY;

        let startTime = null;

        function step(currentTime) {

            if (!startTime)
                startTime = currentTime;

            const elapsed = currentTime - startTime;

            const progress = Math.min(elapsed / duration, 1);

            const eased = easeInOutCubic(progress);

            window.scrollTo(
                0,
                startY + (distance * eased)
            );

            if (progress < 1) {
                requestAnimationFrame(step);
            }

        }

        requestAnimationFrame(step);

    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", e => {

            const href = link.getAttribute("href");

            const target = document.querySelector(href);

            if (!target) return;

            e.preventDefault();

            const navbar = document.querySelector(".navbar");

            const offset =
                navbar
                    ? navbar.offsetHeight + 18
                    : 18;

            smoothScroll(
                target.offsetTop - offset,
                1100
            );

        });

    });

})();