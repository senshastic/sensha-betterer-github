// ==UserScript==
// @name        sensha's betterer GitHub Sidebar
// @version     1.0.0
// @namespace   Violentmonkey Scripts
// @description blablabla
// @match       https://github.com/*
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    function loadRepositories(sidebar) {
        const repoListGroup = sidebar.querySelector('internal-nav-list-group[data-src*="repositories"]');
        if (repoListGroup) {
            console.log("Repository section found, displaying repositories...");
            repoListGroup.style.display = 'block';
            const showMoreButton = sidebar.querySelector('button#filter-button-filter-repositories');
            if (showMoreButton) {
                console.log("Expanding repository list...");
                showMoreButton.click();
            }
        } else {
            const repoLink = sidebar.querySelector('a[href*="/repositories"]');
            if (repoLink) {
                console.log("Clicking repository link to load section...");
                repoLink.click();
            }
        }
    }

    function initializeSidebar() {
        let sidebar = document.querySelector('.SidePanel');
        let sidebarToggleButton = document.querySelector('button[aria-label="Open global navigation menu"]');

        if (sidebar && sidebarToggleButton) {
            console.log("Sidebar and toggle button found, setting up...");
            sidebar.style.cssText = `
                opacity: 0;
                pointer-events: none;
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 280px;
                height: 100vh;
                background-color: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(25px) saturate(200%) contrast(90%);
                color: white;
                transition: opacity 0.3s ease-in-out;
                z-index: 1001;
                overflow-y: auto;
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            `;

            let triggerZone = document.createElement('div');
            triggerZone.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 50px;
                height: 100vh;
                background-color: rgba(255, 255, 255, 0);
                z-index: 999;
                pointer-events: auto;
                transition: background-color 0.3s ease-in-out, opacity 0.3s ease-in-out;
            `;
            document.body.appendChild(triggerZone);

            function showSidebar() {
                sidebar.style.opacity = '1';
                sidebar.style.pointerEvents = 'auto';
                sidebar.style.display = 'block';
                triggerZone.style.opacity = '0';
                sidebarToggleButton.click();
            }

            function hideSidebar() {
                sidebar.style.opacity = '0';
                sidebar.style.pointerEvents = 'none';
                sidebar.style.display = 'none';
                triggerZone.style.opacity = '1';
            }

            triggerZone.addEventListener('mouseenter', showSidebar);
            sidebar.addEventListener('mouseleave', hideSidebar);
            document.addEventListener('mousemove', e => {
                const opacity = Math.max(0, (300 - e.clientX) / 300);
                triggerZone.style.backgroundColor = `rgba(255, 255, 255, ${opacity * 0.1})`;
            });

        } else {
            setTimeout(initializeSidebar, 1000);
        }
    }

    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('.SidePanel') && document.querySelector('button[aria-label="Open global navigation menu"]')) {
            obs.disconnect();  // Stop observing when elements are loaded
            initializeSidebar();  // Initialize once elements are present
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();
