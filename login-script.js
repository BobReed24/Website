// Function to authenticate a user
async function authenticateUser(username, password) {
    try {
        // Fetch user data from GitHub
        const response = await fetch('https://api.github.com/repos/bobreed24/users/contents/users.json', {
            method: 'GET',
            headers: {
                'Authorization': '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', // Replace with your GitHub PAT
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        const users = JSON.parse(atob(userData.content)); // Decode base64 content

        // Check if username and password match
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
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
    const loginForm = document.getElementById('secretForm'); // Changed to match the form id in login.html

    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            // For login.html, there's no username and password fields, so we use the secret field directly
            const secret = document.getElementById('secret').value;

            // Check if the secret matches the expected value
            if (secret === 'HqR5Z0SNgWkYGOaRGz61xxFKbDMKNFWd') {
                // Redirect to index.html after successful login
                window.location.href = 'index.html';
            } else {
                console.error('Invalid secret');
                // Optionally display an error message
                // document.getElementById('errorMessage').style.display = 'block';
            }
        });
    } else {
        console.error('Login form not found');
    }
});
