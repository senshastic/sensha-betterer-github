// ==UserScript==
// @name        sensha's betterer GitHub Sidebar
// @version     0.0.0
// @namespace   Violentmonkey Scripts
// @description blabla
// @match       https://github.com/*
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    // Attempt to load repositories in the sidebar
    function loadRepositories(sidebar) {
        const repoListGroup = sidebar.querySelector('internal-nav-list-group[data-src*="repositories"]');

        if (repoListGroup) {
            console.log("Repository section found, displaying repositories...");
            repoListGroup.style.display = 'block'; // Make sure repository section is visible

            const showMoreButton = sidebar.querySelector('button#filter-button-filter-repositories');
            if (showMoreButton) {
                console.log("Expanding repository list...");
                showMoreButton.click(); // Click 'Show More' if present
            }
        } else {
            console.log("Repository list not found, checking sidebar structure...");
            console.log(sidebar.innerHTML);

            // Attempt to load repository list by clicking relevant link
            const repoLink = sidebar.querySelector('a[href*="/repositories"]');
            if (repoLink) {
                console.log("Clicking repository link to load section...");
                repoLink.click();
            }
        }
    }

    // Initialize sidebar styling and interactions
    function initializeSidebar() {
        let sidebar = document.querySelector('.SidePanel');
        let sidebarToggleButton = document.querySelector('button[aria-label="Open global navigation menu"]');

        if (sidebar && sidebarToggleButton) {
            console.log("Sidebar toggle button found.");

            // Sidebar styling and behavior settings
            sidebar.style.opacity = '0';
            sidebar.style.pointerEvents = 'none';
            sidebar.style.display = 'none';
            sidebar.style.position = 'fixed';
            sidebar.style.top = '0';
            sidebar.style.left = '0';
            sidebar.style.width = '280px';
            sidebar.style.height = '100vh';
            sidebar.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            sidebar.style.backdropFilter = 'blur(25px) saturate(200%) contrast(90%)';
            sidebar.style.webkitBackdropFilter = 'blur(25px) saturate(200%) contrast(90%)';
            sidebar.style.color = 'white';
            sidebar.style.transition = 'opacity 0.3s ease-in-out';
            sidebar.style.zIndex = '1001';
            sidebar.style.overflowY = 'auto';
            sidebar.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            sidebar.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

            // Trigger zone for opening sidebar
            let triggerZone = document.createElement('div');
            triggerZone.style.position = 'fixed';
            triggerZone.style.top = '0';
            triggerZone.style.left = '0';
            triggerZone.style.width = '50px';
            triggerZone.style.height = '100vh';
            triggerZone.style.backgroundColor = 'rgba(255, 255, 255, 0.0)';
            triggerZone.style.zIndex = '999';
            triggerZone.style.pointerEvents = 'auto';
            triggerZone.style.transition = 'background-color 0.3s ease-in-out, opacity 0.3s ease-in-out';

            document.body.appendChild(triggerZone);

            // Adjust trigger zone opacity based on mouse proximity to the edge
            function updateTriggerZoneOpacity(distance) {
                let opacity = Math.max(0, (300 - distance) / 300);
                triggerZone.style.backgroundColor = rgba(255, 255, 255, ${opacity * 0.1});
            }

            // Show the sidebar and load repositories
            function showSidebar() {
                sidebar.style.opacity = '1';
                sidebar.style.pointerEvents = 'auto';
                sidebar.style.display = 'block';
                console.log("Sidebar displayed.");
                triggerZone.style.opacity = '0'; // Hide trigger zone when sidebar is open

                sidebarToggleButton.click(); // Open sidebar if repositories aren’t loaded
            }

            // Hide the sidebar
            function hideSidebar() {
                sidebar.style.opacity = '0';
                sidebar.style.pointerEvents = 'none';
                sidebar.style.display = 'none';
                console.log("Sidebar hidden.");
                triggerZone.style.opacity = '1'; // Restore trigger zone visibility
            }

            // Show sidebar when hovering over trigger zone
            triggerZone.addEventListener('mouseenter', showSidebar);

            // Hide sidebar when mouse leaves the sidebar
            sidebar.addEventListener('mouseleave', hideSidebar);

            // Adjust trigger zone visibility based on mouse position
            document.addEventListener('mousemove', function(e) {
                const leftEdgeDistance = e.clientX;
                updateTriggerZoneOpacity(leftEdgeDistance);
            });

        } else {
            console.log("Sidebar toggle button not found. Retrying...");
            setTimeout(initializeSidebar, 1000); // Retry if button isn't present yet
        }
    }

    // Delay sidebar initialization to ensure page loads fully
    setTimeout(initializeSidebar, 2000);
})();