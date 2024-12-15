// Local Storage Keys
const USERS_KEY = 'qpms_users';
const PAPERS_KEY = 'qpms_papers';
const CURRENT_USER_KEY = 'qpms_current_user';

// Initialize local storage with some default data
if (!localStorage.getItem(USERS_KEY)) {
    const defaultAdmin = {
        id: 'admin',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123', // In a real app, this should be hashed
        isAdmin: true
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([defaultAdmin]));
}

if (!localStorage.getItem(PAPERS_KEY)) {
    localStorage.setItem(PAPERS_KEY, JSON.stringify([]));
}

// Utility Functions
function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function getPapers() {
    return JSON.parse(localStorage.getItem(PAPERS_KEY) || '[]');
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function savePapers(papers) {
    localStorage.setItem(PAPERS_KEY, JSON.stringify(papers));
}

// Auth Functions
function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return true;
    }
    return false;
}

function register(name, email, password) {
    const users = getUsers();
    if (users.some(u => u.email === email)) {
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
    saveUsers(users);
    return true;
}

function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    showAuthContainer();
}

// UI Functions
function toggleForm() {
    const authBoxes = document.querySelectorAll('.auth-box');
    authBoxes.forEach(box => box.classList.toggle('hidden'));
}

function showMainContainer() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('main-container').classList.remove('hidden');
    const currentUser = getCurrentUser();
    document.getElementById('user-name').textContent = currentUser.name;
    
    if (currentUser.isAdmin) {
        document.getElementById('admin-panel').classList.remove('hidden');
        updateAdminPanel();
    }
    
    loadPapers();
}

function showAuthContainer() {
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('main-container').classList.add('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
}

function loadPapers() {
    const papers = getPapers();
    const container = document.getElementById('papers-container');
    container.innerHTML = '';

    papers.forEach(paper => {
        const card = document.createElement('div');
        card.className = 'paper-card';
        card.innerHTML = `
            <h3>${paper.title}</h3>
            <div class="details">
                <p>Subject: ${paper.subject}</p>
                <p>Year: ${paper.year}</p>
                <p>Type: ${paper.type}</p>
                <p>Uploaded by: ${paper.uploaderName}</p>
            </div>
            <button onclick="downloadPaper('${paper.id}')">Download</button>
            ${getCurrentUser().isAdmin ? `<button onclick="deletePaper('${paper.id}')">Delete</button>` : ''}
        `;
        container.appendChild(card);
    });
}

function uploadPaper() {
    const title = document.getElementById('paper-title').value;
    const subject = document.getElementById('paper-subject').value;
    const year = document.getElementById('paper-year').value;
    const type = document.getElementById('paper-type').value;
    const file = document.getElementById('paper-file').files[0];

    if (!title || !subject || !year || !type || !file) {
        alert('Please fill all fields');
        return;
    }

    const currentUser = getCurrentUser();
    const newPaper = {
        id: Date.now().toString(),
        title,
        subject,
        year,
        type,
        fileName: file.name,
        uploaderId: currentUser.id,
        uploaderName: currentUser.name,
        uploadDate: new Date().toISOString()
    };

    const papers = getPapers();
    papers.push(newPaper);
    savePapers(papers);
    loadPapers();
    document.getElementById('upload-form').classList.add('hidden');
}

function downloadPaper(paperId) {
    const papers = getPapers();
    const paper = papers.find(p => p.id === paperId);
    if (paper) {
        // In a real app, this would download the actual file
        alert(`Downloading ${paper.fileName}`);
    }
}

function deletePaper(paperId) {
    if (!getCurrentUser().isAdmin) return;
    
    const papers = getPapers();
    const newPapers = papers.filter(p => p.id !== paperId);
    savePapers(newPapers);
    loadPapers();
}

function updateAdminPanel() {
    const users = getUsers();
    const papers = getPapers();
    
    document.getElementById('total-users').textContent = users.length;
    document.getElementById('total-papers').textContent = papers.length;
    
    const userList = document.querySelector('.user-list');
    userList.innerHTML = '';
    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        userItem.innerHTML = `
            <div>${user.name} (${user.email})</div>
            ${user.isAdmin ? '<span>Admin</span>' : ''}
        `;
        userList.appendChild(userItem);
    });
}

// Event Listeners
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (login(email, password)) {
        showMainContainer();
    } else {
        alert('Invalid credentials');
    }
});

document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    if (register(name, email, password)) {
        alert('Registration successful! Please login.');
        toggleForm();
    } else {
        alert('Email already exists');
    }
});

document.getElementById('upload-btn').addEventListener('click', () => {
    document.getElementById('upload-form').classList.toggle('hidden');
});

document.getElementById('search-input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const papers = getPapers();
    const filteredPapers = papers.filter(paper => 
        paper.title.toLowerCase().includes(searchTerm) ||
        paper.subject.toLowerCase().includes(searchTerm)
    );
    loadFilteredPapers(filteredPapers);
});

// Initialize the app
const currentUser = getCurrentUser();
if (currentUser) {
    showMainContainer();
} else {
    showAuthContainer();
}