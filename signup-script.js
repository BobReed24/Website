// signup-script.js

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const loadingScreen = document.getElementById('loadingScreen');
    const togglePasswordBtn = document.getElementById('togglePassword');

    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Show loading screen
            loadingScreen.style.display = 'block';

            // Simulate loading for 5 seconds
            setTimeout(function() {
                // Send signup request to the server
                fetch('/register', {
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
            }, 5000); // 5 seconds
        });
    } else {
        console.error('Signup form not found');
    }

    // Handle back to login button click
    const backToLoginBtn = document.getElementById('backToLogin');
    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', function() {
            // Redirect to login.html
            window.location.href = 'login.html';
        });
    } else {
        console.error('Back to login button not found');
    }

    // Toggle password visibility
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.textContent = 'Hide Password';
            } else {
                passwordInput.type = 'password';
                this.textContent = 'Show Password';
            }
        });
    } else {
        console.error('Toggle password button not found');
    }
});
