// ==UserScript==
// @name        Animations gitsha
// @version     1.0.0
// @namespace   Violentmonkey Scripts
// @description Runs animations
// @match       https://github.com/*
// @grant       none
// ==/UserScript==

(function () {
    'use strict';


    function addAnimation() {
        const pinnedItems = document.querySelectorAll('.pinned-item-list-item:not(.animated)');
        pinnedItems.forEach(item => {
            item.classList.add('animated', 'animate-on-load');
            item.addEventListener('animationend', () => {
                item.classList.remove('animate-on-load');
            });
        });
    }

    // Inject styles for the animation
    const style = document.createElement('style');
    style.textContent = `
        .pinned-item-list-item.animate-on-load {
            animation: animateDownBouncy 2s linear;
        }

        @keyframes animateDownBouncy {
            0% {
                transform: translateY(-20px);
                opacity: 0;
                filter: blur(4px);
            }
            30% {
                transform: translateY(10px);
                opacity: 0.7;
                filter: blur(2px);
            }
            50% {
                transform: translateY(-5px);
                opacity: 1;
                filter: blur(0);
            }
            80% {
                transform: translateY(0);
                opacity: 1;
                filter: blur(0);
            }
            100% {
                transform: translateY(0);
                opacity: 1;
                filter: blur(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Observe DOM changes to detect navigation or dynamically added content
    const observer = new MutationObserver(() => {
        addAnimation();
    });

    // Start observing the main content container for changes
    const observeTarget = document.querySelector('#js-pjax-container') || document.body;
    if (observeTarget) {
        observer.observe(observeTarget, { childList: true, subtree: true });
    }

    // Run animation on initial load
    addAnimation();
})();
