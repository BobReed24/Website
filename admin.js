document.addEventListener('DOMContentLoaded', function() {
    // Lockdown button
    const lockdownButton = document.getElementById('lockdown-button');

    if (lockdownButton) {
        lockdownButton.addEventListener('click', function() {
            // Implement lockdown feature here
            alert('Site is now locked down');
        });
    } else {
        console.error('Lockdown button not found');
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
