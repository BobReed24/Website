// account-info.js

// In-memory database to store user information (for demonstration purposes)
let users = [];

// Function to check if a user already exists
function userExists(username) {
    return users.some(user => user.username === username);
}

// Function to add a new user
function addUser(username, password) {
    users.push({ username, password });
}

// Function to authenticate a user
function authenticateUser(username, password) {
    const user = users.find(user => user.username === username && user.password === password);
    return !!user;
}

// Export the functions
module.exports = { userExists, addUser, authenticateUser };
