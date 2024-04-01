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

            // Data to be sent to GitHub
            const data = {
                username: username,
                password: password
            };

            // Send data to GitHub using fetch
            fetch('https://api.github.com/repos/bobreed24/users/contents/users.json', {
                method: 'GET',
                headers: {
                    'Authorization': '#`XU8({S!Py%9#oJ.i"!V%2[{W)DUS
', // Replace YOUR_GITHUB_TOKEN with your personal access token
                    'Accept': 'application/vnd.github.v3+json'
                }
            })
            .then(response => response.json())
            .then(json => {
                const content = atob(json.content); // Decode content from base64
                const users = JSON.parse(content);
                users.push(data); // Add new user data

                // Update users.json on GitHub
                return fetch('https://api.github.com/repos/bobreed24/users/contents/users.json', {
                    method: 'PUT',
                    headers: {
                        'Authorization': '#`XU8({S!Py%9#oJ.i"!V%2[{W)DUS
', // Replace YOUR_GITHUB_TOKEN with your personal access token
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: 'Add new user',
                        content: btoa(JSON.stringify(users)), // Encode content to base64
                        sha: json.sha // SHA of the existing users.json file
                    })
                });
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
                alert('Signup successful!');

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
