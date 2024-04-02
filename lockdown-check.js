// Check lockdown status every 5 seconds
setInterval(checkLockdown, 5000);

function checkLockdown() {
    fetch('lockdown-status.txt')
    .then(response => response.text())
    .then(data => {
        if (data.trim() === 'true') {
            window.location.href = 'lockdown.html';
        }
    })
    .catch(error => {
        console.error('Error checking lockdown status:', error);
    });
}
