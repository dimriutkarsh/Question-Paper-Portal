// Initialize storage
if (!StorageUtil.get(CONFIG.STORAGE_KEYS.USERS)) {
    StorageUtil.set(CONFIG.STORAGE_KEYS.USERS, [CONFIG.DEFAULT_ADMIN]);
}

if (!StorageUtil.get(CONFIG.STORAGE_KEYS.PAPERS)) {
    StorageUtil.set(CONFIG.STORAGE_KEYS.PAPERS, []);
}

// Load papers into grid
function loadPapers(filters = {}) {
    const papers = StorageUtil.getPapers();
    const container = document.getElementById('papers-container');
    container.innerHTML = '';

    const filteredPapers = papers.filter(paper => {
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            if (!paper.title.toLowerCase().includes(searchTerm) && 
                !paper.subject.toLowerCase().includes(searchTerm)) {
                return false;
            }
        }
        if (filters.subject && paper.subject !== filters.subject) return false;
        if (filters.year && paper.year !== filters.year) return false;
        if (filters.semester && paper.semester !== filters.semester) return false;
        return true;
    });

    filteredPapers.forEach(paper => {
        const card = document.createElement('div');
        card.className = 'paper-card';
        card.innerHTML = `
            <h3>${paper.title}</h3>
            <div class="paper-details">
                <p>Subject: ${paper.subject}</p>
                <p>Year: ${paper.year}</p>
                <p>Semester: ${paper.semester}</p>
                <p>Type: ${paper.type}</p>
            </div>
            <div class="paper-actions">
                <button onclick="downloadPaper('${paper.id}')">Download</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Handle paper download
function downloadPaper(paperId) {
    if (!AuthUtil.requireAuth()) return;

    const papers = StorageUtil.getPapers();
    const paper = papers.find(p => p.id === paperId);
    if (paper) {
        const downloads = StorageUtil.getDownloads();
        const userId = StorageUtil.getCurrentUser().id;
        if (!downloads[userId]) downloads[userId] = [];
        downloads[userId].push({
            paperId,
            downloadDate: new Date().toISOString()
        });
        StorageUtil.set(CONFIG.STORAGE_KEYS.DOWNLOADS, downloads);
        alert(`Downloading ${paper.title}`);
    }
}

// Event Listeners
document.getElementById('search-input').addEventListener('input', (e) => {
    loadPapers({ search: e.target.value });
});

// Initialize the page
loadPapers();