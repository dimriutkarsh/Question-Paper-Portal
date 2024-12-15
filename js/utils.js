const StorageUtil = {
    get: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    remove: (key) => localStorage.removeItem(key),
    
    getUsers: () => StorageUtil.get(CONFIG.STORAGE_KEYS.USERS) || [CONFIG.DEFAULT_ADMIN],
    getPapers: () => StorageUtil.get(CONFIG.STORAGE_KEYS.PAPERS) || [],
    getCurrentUser: () => StorageUtil.get(CONFIG.STORAGE_KEYS.CURRENT_USER),
    getDownloads: () => StorageUtil.get(CONFIG.STORAGE_KEYS.DOWNLOADS) || {}
};

const AuthUtil = {
    requireAuth: () => {
        const currentUser = StorageUtil.getCurrentUser();
        if (!currentUser) {
            document.getElementById('login-prompt').classList.remove('hidden');
            return false;
        }
        return true;
    },
    
    logout: () => {
        StorageUtil.remove(CONFIG.STORAGE_KEYS.CURRENT_USER);
        window.location.href = '/index.html';
    }
};