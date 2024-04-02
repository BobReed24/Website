async function sendUserDataToGitHub(userData) {
    const token = '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';
    const owner = 'bobreed24';
    const repo = 'users';
    const path = 'users.json';

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Add new user',
                content: btoa(JSON.stringify(userData)),
                branch: 'main',
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to add user: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log('User data successfully added:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const loadingScreen = document.getElementById('loadingScreen');
    const togglePasswordBtn = document.getElementById('togglePassword');

    if (signupForm) {
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Show loading screen
            loadingScreen.style.display = 'block';

            // Send signup request to GitHub
            try {
                await sendUserDataToGitHub({ username, password });
                loadingScreen.style.display = 'none';
                alert('Signup successful!');
            } catch (error) {
                loadingScreen.style.display = 'none';
                console.error('Error signing up:', error);
                alert('Signup failed. Please try again.');
            }
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
