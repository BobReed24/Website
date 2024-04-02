document.addEventListener('DOMContentLoaded', function() {
    // Lockdown button
    const lockdownButton = document.getElementById('lockdown-button');
    // Disable Lockdown button
    const disableLockdownButton = document.getElementById('disable-lockdown-button');

    if (lockdownButton && disableLockdownButton) {
        lockdownButton.addEventListener('click', function() {
            // Redirect only users on index.html and windows96page.html to lockdown.html
            const currentPage = window.location.href;
            if (currentPage.includes('index.html') || currentPage.includes('windows96page.html')) {
                window.location.href = 'lockdown.html';
            } else {
                console.log('Lockdown does not apply on this page.');
            }
        });

        disableLockdownButton.addEventListener('click', function() {
            // Implement logic to disable lockdown
            console.log('Lockdown disabled.');
            // You can add code here to revert the lockdown if necessary
        });
    } else {
        console.error('Lockdown buttons not found');
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
