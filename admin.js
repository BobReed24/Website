document.addEventListener('DOMContentLoaded', function() {
    // Secret for accessing admin panel
    const secret = '=<~!@$$;*]'; // 'boogabooga' in Malbolge code

    // Counter for secret input
    let secretInputCount = 0;

    // Lockdown button
    const lockdownButton = document.getElementById('lockdown-button');
    // Unlock button
    const unlockButton = document.getElementById('unlock-button');

    // Function to handle lockdown
    function lockdown() {
        // Redirect only users on index.html and windows96page.html to lockdown.html
        const currentPage = window.location.href;
        if (currentPage.includes('index.html') || currentPage.includes('windows96page.html')) {
            window.location.href = 'lockdown.html';
        } else {
            console.log('Lockdown does not apply on this page.');
        }
    }

    // Function to handle unlocking
    function unlock() {
        // Redirect only users on index.html and windows96page.html to index-admin.html
        const currentPage = window.location.href;
        if (currentPage.includes('index.html') || currentPage.includes('windows96page.html')) {
            window.location.href = 'index-admin.html';
        } else {
            console.log('Unlocking is not applicable on this page.');
        }
    }

    // Add event listener to lockdown button
    if (lockdownButton) {
        lockdownButton.addEventListener('click', lockdown);
    } else {
        console.error('Lockdown button not found');
    }

    // Add event listener to unlock button
    if (unlockButton) {
        unlockButton.addEventListener('click', unlock);
    } else {
        console.error('Unlock button not found');
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

    // Check for secret input
    document.addEventListener('keydown', function(event) {
        // Convert key code to character
        const character = String.fromCharCode(event.keyCode);
        // Increment secret input count if character matches secret
        if (character === secret[secretInputCount]) {
            secretInputCount++;
            // If all characters of the secret are entered, redirect to index-admin.html
            if (secretInputCount === secret.length) {
                window.location.href = 'index-admin.html';
            }
        } else {
            // Reset input count if character does not match secret
            secretInputCount = 0;
        }
    });
});
