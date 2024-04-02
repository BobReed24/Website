// Function to send user data to private repository on GitHub
async function sendUserDataToGitHub(userData) {
    const token = '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';
    const owner = 'bobreed24';
    const repo = 'users';
    const path = 'users.json';

    const apiUrl = `https://api.github.com/repos/bobreed24/users/contents/users.json`;

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Update user data',
                content: btoa(JSON.stringify(userData)),
                branch: 'main',
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to send user data: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log('User data successfully sent:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error sending user data to GitHub:', error);
        throw error;
    }
}

// Example usage:
const userData = { username: 'example', password: 'password123' };
sendUserDataToGitHub(userData);
