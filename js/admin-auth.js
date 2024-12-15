// Admin authentication handling
function handleAdminLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    const users = StorageUtil.getUsers();
    const admin = users.find(u => u.email === email && u.password === password && u.isAdmin);
    
    if (admin) {
        StorageUtil.set(CONFIG.STORAGE_KEYS.CURRENT_USER, admin);
        window.location.href = '../pages/admin-dashboard.html';
    } else {
        alert('Invalid admin credentials');
    }
    return false;
}