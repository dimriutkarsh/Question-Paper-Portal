// Check if user is admin
const currentUser = StorageUtil.getCurrentUser();
if (!currentUser || !currentUser.isAdmin) {
    window.location.href = '../index.html';
}

// Dashboard functionality
function updateStats() {
    const users = StorageUtil.getUsers();
    const papers = StorageUtil.getPapers();
    const downloads = StorageUtil.getDownloads();
    
    document.getElementById('total-users').textContent = users.length;
    document.getElementById('total-papers').textContent = papers.length;
    document.getElementById('total-downloads').textContent = 
        Object.values(downloads).reduce((total, userDownloads) => total + userDownloads.length, 0);
}

function loadPapersList() {
    const papers = StorageUtil.getPapers();
    const container = document.getElementById('papers-list');
    container.innerHTML = `
        <div class="add-paper">
            <button onclick="showAddPaperForm()" class="add-btn">Add New Paper</button>
        </div>
        <div id="paper-form" class="paper-form hidden">
            <h3>Add/Edit Paper</h3>
            <form onsubmit="return handlePaperSubmit(event)">
                <input type="hidden" id="paper-id">
                <input type="text" id="paper-title" placeholder="Paper Title" required>
                <input type="text" id="paper-subject" placeholder="Subject" required>
                <select id="paper-year" required>
                    ${generateYearOptions()}
                </select>
                <select id="paper-semester" required>
                    <option value="">Select Semester</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                </select>
                <select id="paper-type" required>
                    <option value="">Select Type</option>
                    <option value="Final">Final Exam</option>
                    <option value="Mid-Term">Mid-Term</option>
                    <option value="Sessional">Sessional</option>
                </select>
                <input type="file" id="paper-file" accept=".pdf" required>
                <div class="form-actions">
                    <button type="submit">Save Paper</button>
                    <button type="button" onclick="hidePaperForm()">Cancel</button>
                </div>
            </form>
        </div>
        <div class="papers-list">
            ${papers.map(paper => `
                <div class="list-item">
                    <div class="paper-info">
                        <h4>${paper.title}</h4>
                        <p>${paper.subject} - Year ${paper.year}, Semester ${paper.semester} (${paper.type})</p>
                    </div>
                    <div class="list-item-actions">
                        <button class="edit-btn" onclick="editPaper('${paper.id}')">Edit</button>
                        <button class="delete-btn" onclick="deletePaper('${paper.id}')">Delete</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    let options = '<option value="">Select Year</option>';
    for (let year = currentYear; year >= currentYear - 10; year--) {
        options += `<option value="${year}">${year}</option>`;
    }
    return options;
}

function showAddPaperForm() {
    document.getElementById('paper-form').classList.remove('hidden');
    document.getElementById('paper-id').value = '';
    document.getElementById('paper-form').querySelector('form').reset();
}

function hidePaperForm() {
    document.getElementById('paper-form').classList.add('hidden');
}

function handlePaperSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const paperId = form.querySelector('#paper-id').value;
    const paperData = {
        id: paperId || Date.now().toString(),
        title: form.querySelector('#paper-title').value,
        subject: form.querySelector('#paper-subject').value,
        year: form.querySelector('#paper-year').value,
        semester: form.querySelector('#paper-semester').value,
        type: form.querySelector('#paper-type').value,
        uploadedBy: currentUser.id,
        uploadDate: new Date().toISOString()
    };

    const papers = StorageUtil.getPapers();
    if (paperId) {
        const index = papers.findIndex(p => p.id === paperId);
        papers[index] = { ...papers[index], ...paperData };
    } else {
        papers.push(paperData);
    }
    
    StorageUtil.set(CONFIG.STORAGE_KEYS.PAPERS, papers);
    hidePaperForm();
    loadPapersList();
    updateStats();
    return false;
}

function editPaper(paperId) {
    const papers = StorageUtil.getPapers();
    const paper = papers.find(p => p.id === paperId);
    if (paper) {
        document.getElementById('paper-id').value = paper.id;
        document.getElementById('paper-title').value = paper.title;
        document.getElementById('paper-subject').value = paper.subject;
        document.getElementById('paper-year').value = paper.year;
        document.getElementById('paper-semester').value = paper.semester;
        document.getElementById('paper-type').value = paper.type;
        document.getElementById('paper-form').classList.remove('hidden');
    }
}

function deletePaper(paperId) {
    if (confirm('Are you sure you want to delete this paper?')) {
        const papers = StorageUtil.getPapers();
        const newPapers = papers.filter(p => p.id !== paperId);
        StorageUtil.set(CONFIG.STORAGE_KEYS.PAPERS, newPapers);
        loadPapersList();
        updateStats();
    }
}

// Initialize with example papers if none exist
function initializeExamplePapers() {
    const papers = StorageUtil.getPapers();
    if (papers.length === 0) {
        const examplePapers = [
            {
                id: '1',
                title: 'Data Structures Final Exam 2023',
                subject: 'Data Structures',
                year: '2023',
                semester: '1',
                type: 'Final',
                uploadedBy: currentUser.id,
                uploadDate: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Database Management Mid-Term',
                subject: 'Database Management',
                year: '2023',
                semester: '2',
                type: 'Mid-Term',
                uploadedBy: currentUser.id,
                uploadDate: new Date().toISOString()
            },
            {
                id: '3',
                title: 'Computer Networks Sessional',
                subject: 'Computer Networks',
                year: '2023',
                semester: '1',
                type: 'Sessional',
                uploadedBy: currentUser.id,
                uploadDate: new Date().toISOString()
            }
        ];
        StorageUtil.set(CONFIG.STORAGE_KEYS.PAPERS, examplePapers);
    }
}

// Initialize dashboard
initializeExamplePapers();
updateStats();
loadPapersList();
loadUsersList();