// ==UserScript==
// @name        sensha's betterer GitHub Sidebar with Enhanced Debugging for Repository Loading
// @version     2.9.0
// @namespace   Violentmonkey Scripts
// @description Trigger clicks and try to load the repository list interactively.
// @match       https://github.com/*
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    // Function to load repositories manually
    function loadRepositories(sidebar) {
        const repoListGroup = sidebar.querySelector('internal-nav-list-group[data-src*="repositories"]');  // Locate the repository section

        if (repoListGroup) {
            console.log("Repository section found, attempting to display repositories...");

            // Unhide the repository section if it's hidden
            repoListGroup.style.display = 'block';

            // Simulate interaction if needed (we may not need this anymore)
            let showMoreButton = sidebar.querySelector('button#filter-button-filter-repositories');
            if (showMoreButton) {
                console.log("Clicking the 'Show More' button to display full repository list...");
                showMoreButton.click();  // Simulate the click to load more repositories
            }

        } else {
            console.log("No repository list found. Logging the sidebar contents again for deeper analysis.");
            console.log(sidebar.innerHTML);  // Log sidebar HTML structure for analysis

            // Try clicking on any potential repository-related link to trigger repository loading
            const repoLink = sidebar.querySelector('a[href*="/repositories"]');
            if (repoLink) {
                console.log("Simulating a click on the repository link to load the repository section...");
                repoLink.click();  // Trigger a click on repository link if available
            }
        }
    }

    // Function to initialize sidebar styling and interactions
    function initializeSidebar() {
        // Sidebar element
        let sidebar = document.querySelector('.SidePanel');
        // Sidebar toggle button
        let sidebarToggleButton = document.querySelector('button[aria-label="Open global navigation menu"]');

        if (sidebar && sidebarToggleButton) {
            console.log("Sidebar toggle button found.");

            // Remove automatic sidebar display on load, sidebar starts hidden
            sidebar.style.opacity = '0';  // Hidden initially
            sidebar.style.pointerEvents = 'none';  // Non-interactive initially
            sidebar.style.display = 'none';  // Hide sidebar on load

            // Apply acrylic effect to the sidebar
            sidebar.style.position = 'fixed';
            sidebar.style.top = '0';
            sidebar.style.left = '0';
            sidebar.style.width = '280px';
            sidebar.style.height = '100vh';
            sidebar.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';  // Semi-transparent background
            sidebar.style.backdropFilter = 'blur(25px) saturate(200%) contrast(90%)';  // Acrylic blur effect
            sidebar.style.webkitBackdropFilter = 'blur(25px) saturate(200%) contrast(90%)';  // Webkit fallback
            sidebar.style.color = 'white';
            sidebar.style.transition = 'opacity 0.3s ease-in-out';  // Smooth fade in/out
            sidebar.style.zIndex = '1001';  // Sidebar now has a higher z-index to stay above the trigger zone
            sidebar.style.overflowY = 'auto';  // Scrollable if content overflows
            sidebar.style.border = '1px solid rgba(255, 255, 255, 0.2)';  // Subtle border
            sidebar.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';  // Light shadow

            // Create and append trigger zone for sidebar interaction on body
            let triggerZone = document.createElement('div');
            triggerZone.style.position = 'fixed';
            triggerZone.style.top = '0';
            triggerZone.style.left = '0';
            triggerZone.style.width = '50px';  // Set width of the trigger zone on the left
            triggerZone.style.height = '100vh';
            triggerZone.style.backgroundColor = 'rgba(255, 255, 255, 0.0)';  // Initially invisible
            triggerZone.style.zIndex = '999';  // Lower z-index to ensure it is behind the sidebar
            triggerZone.style.pointerEvents = 'auto';  // Enable interactions
            triggerZone.style.transition = 'background-color 0.3s ease-in-out, opacity 0.3s ease-in-out';  // Smooth transition for opacity changes

            document.body.appendChild(triggerZone);  // Attach to body

            // Show the trigger zone with opacity based on mouse position, just like in the Todoist script
            function updateTriggerZoneOpacity(distance) {
                let opacity = Math.max(0, (300 - distance) / 300);
                triggerZone.style.backgroundColor = `rgba(255, 255, 255, ${opacity * 0.1})`;  // Gradual opacity increase as the mouse nears the edge
            }

            // Function to show the sidebar
            function showSidebar() {
                sidebar.style.opacity = '1';
                sidebar.style.pointerEvents = 'auto';
                sidebar.style.display = 'block';
                console.log("Sidebar displayed via trigger zone.");
                // Set trigger zone opacity to 0 when the sidebar is open
                triggerZone.style.opacity = '0';  // Make trigger zone completely invisible when the sidebar is open

                // Attempt to load repositories after showing the sidebar
                setTimeout(() => loadRepositories(sidebar), 1000);  // Delayed call to allow for dynamic content loading
            }

            // Function to hide the sidebar
            function hideSidebar() {
                sidebar.style.opacity = '0';
                sidebar.style.pointerEvents = 'none';
                sidebar.style.display = 'none';
                console.log("Sidebar hidden via trigger zone.");
                // Restore trigger zone opacity when the sidebar is closed
                triggerZone.style.opacity = '1';  // Restore trigger zone visibility
            }

            // Show sidebar on mouse enter (hover) over the trigger zone
            triggerZone.addEventListener('mouseenter', showSidebar);

            // Hide sidebar when the mouse leaves the sidebar area
            sidebar.addEventListener('mouseleave', hideSidebar);

            // Update trigger zone opacity based on mouse movement, as in the original Todoist script
            document.addEventListener('mousemove', function(e) {
                const leftEdgeDistance = e.clientX;  // Get the mouse's X position (distance from left edge)
                updateTriggerZoneOpacity(leftEdgeDistance);
            });

        } else {
            console.log("Sidebar toggle button not found. Retrying...");
            setTimeout(initializeSidebar, 1000);  // Retry after 1 second if the button is not yet found
        }
    }

    // Initialize the sidebar after a short delay to ensure the page is fully loaded
    setTimeout(initializeSidebar, 2000);  // 2-second delay to ensure the button is present
})();
