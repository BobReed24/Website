document.addEventListener('DOMContentLoaded', function() {
    // Lockdown button
    const lockdownButton = document.getElementById('lockdown-button');

    if (lockdownButton) {
        lockdownButton.addEventListener('click', function() {
            // Redirect only users on index.html and windows96page.html to lockdown.html
            const currentPage = window.location.href;
            if (currentPage.includes('index.html') || currentPage.includes('windows96page.html')) {
                window.location.href = 'lockdown.html';
            } else {
                console.log('Lockdown does not apply on this page.');
            }
        });
    } else {
        console.error('Lockdown button not found');
    }

    // Disable Lockdown button
    const disableLockdownButton = document.getElementById('disable-lockdown-button');

    if (disableLockdownButton) {
        disableLockdownButton.addEventListener('click', function() {
            // Redirect only users on index-admin.html to index.html
            const currentPage = window.location.href;
            if (currentPage.includes('index-admin.html')) {
                window.location.href = 'index.html';
            } else {
                console.log('Lockdown is already disabled.');
            }
        });
    } else {
        console.error('Disable Lockdown button not found');
    }

    // Display console logs
    const consoleLogsContainer = document.getElementById('console-logs');

    if (consoleLogsContainer) {
        // Hook into console.log to display logs on the page
        const oldLog = console.log;
        console.log = function(message) {
            oldLog.apply(console, arguments);
            const logElement = document.createElement('div');
            logElement.textContent = message;
            consoleLogsContainer.appendChild(logElement);
        };
    } else {
        console.error('Console logs container not found');
    }
});
