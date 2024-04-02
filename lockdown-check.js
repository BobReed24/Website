// Function to check lockdown status
function checkLockdown() {
    fetch('lockdown-status.txt') // Fetch the lockdown status from the server
        .then(response => response.text()) // Convert the response to text
        .then(data => {
            if (data.trim() === 'true') { // Check if lockdown is enabled
                window.location.href = 'lockdown.html'; // Redirect to lockdown page if lockdown is enabled
            }
        })
        .catch(error => {
            console.error('Error checking lockdown status:', error); // Log any errors
        });
}

// Check lockdown status every 5 seconds
setInterval(checkLockdown, 5000);
