// Function to authenticate a user
async function authenticateUser(username, password) {
    try {
        const response = await fetch('/login', { // Updated URL to reflect the public folder
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            throw new Error('Authentication failed');
        }

        const data = await response.json();

        if (data.authenticated) {
            localStorage.setItem('username', username);
            return true;
        } else {
            throw new Error('Invalid username or password');
        }
    } catch (error) {
        console.error('Error authenticating user:', error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const authenticated = await authenticateUser(username, password);

            if (authenticated) {
                window.location.href = 'index.html';
            } else {
                console.error('Invalid username or password');
            }
        });
    } else {
        console.error('Login form not found');
    }
});
