// Auth related functions for user login/register
function toggleForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
}

function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    const users = StorageUtil.getUsers();
    const user = users.find(u => u.email === email && u.password === password && !u.isAdmin);
    
    if (user) {
        StorageUtil.set(CONFIG.STORAGE_KEYS.CURRENT_USER, user);
        window.location.href = '../index.html';
    } else {
        alert('Invalid credentials');
    }
    return false;
}

function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    const users = StorageUtil.getUsers();
    if (users.some(u => u.email === email)) {
        alert('Email already exists');
        return false;
    }

    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        isAdmin: false
    };

    users.push(newUser);
    StorageUtil.set(CONFIG.STORAGE_KEYS.USERS, users);
    alert('Registration successful! Please login.');
    toggleForms();
    return false;
}