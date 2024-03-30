document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const loadingScreen = document.getElementById('loadingScreen');

    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Show loading screen
            loadingScreen.style.display = 'block';

            // Send signup request to the server
            fetch('http://0.tcp.ngrok.io:10955/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Signup failed');
                }
                return response.json();
            })
            .then(data => {
                // Hide loading screen
                loadingScreen.style.display = 'none';
                alert(data.message);
                // Optionally, redirect to another page after successful signup
                // window.location.href = '/dashboard.html';
            })
            .catch(error => {
                // Hide loading screen
                loadingScreen.style.display = 'none';
                console.error('Error signing up:', error);
                alert('Signup failed. Please try again.');
            });
        });
    } else {
        console.error('Signup form not found');
    });
