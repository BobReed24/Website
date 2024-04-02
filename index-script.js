document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the Windows 96 button
    document.getElementById('windows96-button').addEventListener('click', function() {
        // Redirect to windows96page.html
        window.location.href = 'windows96page.html';
    });

    // Add event listener to the Debug button
    document.getElementById('debug-button').addEventListener('click', function() {
        // Open a new window with Windows Command Prompt
        window.open('cmd.exe');
    });

    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;

            // Check if the user credentials are valid
            authenticateUser(username, password)
            .then(authenticated => {
                if (authenticated) {
                    alert('Login successful');
                    // Redirect to index.html after successful login
                    window.location.href = 'index.html';
                } else {
                    alert('Invalid username or password');
                }
            });
        });
    } else {
        console.error('Login form not found');
    }
});
