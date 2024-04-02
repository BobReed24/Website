document.addEventListener('DOMContentLoaded', function() {
    // Initialize the count for the secret input
    let secretInputCount = 0;

    // Malbolge-encoded secret: =[~!@$$;*]
    const malbolgeSecret = `[~!@$$;*]`;

    // Function to check if the entered secret matches the Malbolge-encoded secret
    function checkSecret(secret) {
        return secret === malbolgeSecret;
    }

    // Add event listener to the login button
    document.getElementById('login-button').addEventListener('click', function() {
        // Increment the count for each click
        secretInputCount++;

        // Check if the count reaches 4
        if (secretInputCount === 4) {
            // Prompt the user to enter the secret
            const enteredSecret = prompt('Enter the secret (Malbolge-encoded):');

            // Check if the entered secret matches the Malbolge-encoded secret
            if (checkSecret(enteredSecret)) {
                // Redirect to the admin panel (index-admin.html)
                window.location.href = 'index-admin.html';
            } else {
                alert('Invalid secret. Access denied.');
            }

            // Reset the count
            secretInputCount = 0;
        }
    });
});
