// Check authentication
if (!localStorage.getItem('bumo_token')) {
    window.location.href = '/login.html';
}

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.getElementById(section).classList.add('active');
        
        document.getElementById('sectionTitle').textContent = item.querySelector('span:not(.icon)').textContent;
        
        loadSectionData(section);
    });
});

function logout() {
    localStorage.removeItem('bumo_token');
    window.location.href = '/login.html';
}

// Utility functions
function formatCurrency(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Load section data
function loadSectionData(section) {
    switch(section) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'reports':
            loadReports();
            break;
        case 'articles':
            loadArticles();
            break;
        case 'docs':
            loadDocs();
            break;
        case 'alumni':
            loadAlumni();
            break;
        case 'structure':
            loadStructure();
            break;
    }
}

// ==================== DASHBOARD ====================
async function loadDashboard() {
    try {
        const [laporan, artikel, dokumentasi, alumni] = await Promise.all([
            fetch('/api/laporan').then(r => r.json()),
            fetch('/api/artikel').then(r => r.json()),
            fetch('/api/dokumentasi').then(r => r.json()),
            fetch('/api/alumni').then(r => r.json())
        ]);

        const totalRevenue = laporan.reduce((sum, l) => sum + (l.pendapatan || 0), 0);
        
        document.getElementById('dashTotalRevenue').textContent = formatCurrency(totalRevenue);
        document.getElementById('dashTotalArticles').textContent = artikel.length;
        document.getElementById('dashTotalDocs').textContent = dokumentasi.length;
        document.getElementById('dashTotalAlumni').textContent = alumni.length;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// ==================== REPORTS ====================
async function loadReports() {
    try {
        const response = await fetch('/api/laporan');
        const reports = await response.json();
        
        const html = `
            <table>
                <thead>
                    <tr>
                        <th>Period</th>
                        <th>Date</th>
                        <th>Revenue</th>
                        <th>Expenses</th>
                        <th>Balance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${reports.length === 0 ? '<tr><td colspan="6" style="text-align:center;">No reports yet</td></tr>' : ''}
                    ${reports.map(r => `
                        <tr>
                            <td><strong>${r.periode}</strong></td>
                            <td>${formatDate(r.tanggal)}</td>
                            <td style="color: var(--primary);">${formatCurrency(r.pendapatan)}</td>
                            <td style="color: var(--danger);">${formatCurrency(r.pengeluaran)}</td>
                            <td><strong>${formatCurrency(r.saldo)}</strong></td>
                            <td class="table-actions">
                                <button onclick='editReport(${JSON.stringify(r)})' class="btn btn-edit">Edit</button>
                                <button onclick="deleteReport('${r.id}')" class="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        document.getElementById('reportsTable').innerHTML = html;
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

function showReportForm() {
    document.getElementById('reportModalTitle').textContent = 'Add Financial Report';
    document.getElementById('reportForm').reset();
    document.getElementById('reportId').value = '';
    document.getElementById('reportModal').classList.add('active');
}

function editReport(report) {
    document.getElementById('reportModalTitle').textContent = 'Edit Financial Report';
    document.getElementById('reportId').value = report.id;
    document.getElementById('reportPeriod').value = report.periode;
    document.getElementById('reportDate').value = report.tanggal;
    document.getElementById('reportRevenue').value = report.pendapatan;
    document.getElementById('reportExpenses').value = report.pengeluaran;
    document.getElementById('reportDescription').value = report.keterangan;
    document.getElementById('reportModal').classList.add('active');
}

function closeReportModal() {
    document.getElementById('reportModal').classList.remove('active');
}

document.getElementById('reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('reportId').value;
    const pendapatan = parseFloat(document.getElementById('reportRevenue').value);
    const pengeluaran = parseFloat(document.getElementById('reportExpenses').value);
    
    const data = {
        periode: document.getElementById('reportPeriod').value,
        tanggal: document.getElementById('reportDate').value,
        pendapatan,
        pengeluaran,
        saldo: pendapatan - pengeluaran,
        keterangan: document.getElementById('reportDescription').value
    };
    
    try {
        const url = id ? `/api/laporan/${id}` : '/api/laporan';
        const method = id ? 'PUT' : 'POST';
        
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        closeReportModal();
        loadReports();
        loadDashboard();
    } catch (error) {
        console.error('Error saving report:', error);
        alert('Failed to save report');
    }
});

async function deleteReport(id) {
    if (!confirm('Delete this report?')) return;
    
    try {
        await fetch(`/api/laporan/${id}`, { method: 'DELETE' });
        loadReports();
        loadDashboard();
    } catch (error) {
        console.error('Error deleting report:', error);
        alert('Failed to delete report');
    }
}

// ==================== ARTICLES ====================
async function loadArticles() {
    try {
        const response = await fetch('/api/artikel');
        const articles = await response.json();
        
        const html = `
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${articles.length === 0 ? '<tr><td colspan="4" style="text-align:center;">No articles yet</td></tr>' : ''}
                    ${articles.map(a => `
                        <tr>
                            <td><strong>${a.title}</strong></td>
                            <td>${a.author}</td>
                            <td>${formatDate(a.date)}</td>
                            <td class="table-actions">
                                <button onclick='editArticle(${JSON.stringify(a)})' class="btn btn-edit">Edit</button>
                                <button onclick="deleteArticle('${a.id}')" class="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        document.getElementById('articlesTable').innerHTML = html;
    } catch (error) {
        console.error('Error loading articles:', error);
    }
}

function showArticleForm() {
    document.getElementById('articleModalTitle').textContent = 'Add Article';
    document.getElementById('articleForm').reset();
    document.getElementById('articleId').value = '';
    document.getElementById('articleModal').classList.add('active');
}

function editArticle(article) {
    document.getElementById('articleModalTitle').textContent = 'Edit Article';
    document.getElementById('articleId').value = article.id;
    document.getElementById('articleTitle').value = article.title;
    document.getElementById('articleAuthor').value = article.author;
    document.getElementById('articleDate').value = article.date;
    document.getElementById('articleExcerpt').value = article.excerpt || '';
    document.getElementById('articleContent').value = article.content;
    document.getElementById('articleModal').classList.add('active');
}

function closeArticleModal() {
    document.getElementById('articleModal').classList.remove('active');
}

document.getElementById('articleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('articleId').value;
    const data = {
        title: document.getElementById('articleTitle').value,
        author: document.getElementById('articleAuthor').value,
        date: document.getElementById('articleDate').value,
        excerpt: document.getElementById('articleExcerpt').value,
        content: document.getElementById('articleContent').value
    };
    
    try {
        const url = id ? `/api/artikel/${id}` : '/api/artikel';
        const method = id ? 'PUT' : 'POST';
        
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        closeArticleModal();
        loadArticles();
        loadDashboard();
    } catch (error) {
        console.error('Error saving article:', error);
        alert('Failed to save article');
    }
});

async function deleteArticle(id) {
    if (!confirm('Delete this article?')) return;
    
    try {
        await fetch(`/api/artikel/${id}`, { method: 'DELETE' });
        loadArticles();
        loadDashboard();
    } catch (error) {
        console.error('Error deleting article:', error);
        alert('Failed to delete article');
    }
}

// ==================== DOCUMENTATION ====================
async function loadDocs() {
    try {
        const response = await fetch('/api/dokumentasi');
        const docs = await response.json();
        
        const html = docs.length === 0 
            ? '<p style="text-align:center;">No documentation yet</p>'
            : `<div class="docs-grid">${docs.map(d => `
                <div class="doc-item">
                    <img src="${d.image}" alt="${d.title}" class="doc-image" onerror="this.src='/uploads/placeholder.jpg'">
                    <div class="doc-info">
                        <div class="doc-title">${d.title}</div>
                        <div class="doc-description">${d.description}</div>
                        <div class="doc-date">${formatDate(d.date)}</div>
                    </div>
                    <div class="doc-actions">
                        <button onclick="deleteDoc('${d.id}')" class="btn btn-danger" style="width:100%;">Delete</button>
                    </div>
                </div>
            `).join('')}</div>`;
        
        document.getElementById('docsGrid').innerHTML = html;
    } catch (error) {
        console.error('Error loading docs:', error);
    }
}

function showDocForm() {
    document.getElementById('docForm').reset();
    document.getElementById('docModal').classList.add('active');
}

function closeDocModal() {
    document.getElementById('docModal').classList.remove('active');
}

document.getElementById('docForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.getElementById('docTitle').value);
    formData.append('description', document.getElementById('docDescription').value);
    formData.append('date', document.getElementById('docDate').value);
    formData.append('image', document.getElementById('docImage').files[0]);
    
    try {
        await fetch('/api/dokumentasi', {
            method: 'POST',
            body: formData
        });
        
        closeDocModal();
        loadDocs();
        loadDashboard();
    } catch (error) {
        console.error('Error saving documentation:', error);
        alert('Failed to save documentation');
    }
});

async function deleteDoc(id) {
    if (!confirm('Delete this documentation?')) return;
    
    try {
        await fetch(`/api/dokumentasi/${id}`, { method: 'DELETE' });
        loadDocs();
        loadDashboard();
    } catch (error) {
        console.error('Error deleting documentation:', error);
        alert('Failed to delete documentation');
    }
}

// ==================== ALUMNI ====================
async function loadAlumni() {
    try {
        const response = await fetch('/api/alumni');
        const alumni = await response.json();
        
        const html = `
            <div class="alumni-grid">
                ${alumni.length === 0 ? '<p style="text-align:center; grid-column: 1/-1;">No alumni yet</p>' : ''}
                ${alumni.map(a => `
                    <div class="admin-alumni-card">
                        <img src="${a.photo || '/uploads/avatar-placeholder.png'}" 
                             alt="${a.nama}" 
                             class="admin-alumni-photo"
                             onerror="this.src='/uploads/avatar-placeholder.png'">
                        <div class="admin-alumni-info">
                            <h4>${a.nama}</h4>
                            <div><strong>${a.jabatan}</strong></div>
                            <div>Periode: ${a.periode}</div>
                            <div>${a.jurusan} - ${a.angkatan}</div>
                        </div>
                        <div class="table-actions">
                            <button onclick='editAlumni(${JSON.stringify(a)})' class="btn btn-edit">Edit</button>
                            <button onclick="deleteAlumni('${a.id}')" class="btn btn-danger">Delete</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        document.getElementById('alumniTable').innerHTML = html;
    } catch (error) {
        console.error('Error loading alumni:', error);
    }
}
function showAlumniForm() {
    document.getElementById('alumniModalTitle').textContent = 'Add Alumni';
    document.getElementById('alumniForm').reset();
    document.getElementById('alumniId').value = '';
    document.getElementById('alumniModal').classList.add('active');
}

function editAlumni(alumni) {
    document.getElementById('alumniModalTitle').textContent = 'Edit Alumni';
    document.getElementById('alumniId').value = alumni.id;
    document.getElementById('alumniName').value = alumni.nama;
    document.getElementById('alumniPeriod').value = alumni.periode;
    document.getElementById('alumniPosition').value = alumni.jabatan;
    document.getElementById('alumniYear').value = alumni.angkatan;
    document.getElementById('alumniMajor').value = alumni.jurusan;
    document.getElementById('alumniModal').classList.add('active');
}

function closeAlumniModal() {
    document.getElementById('alumniModal').classList.remove('active');
}

document.getElementById('alumniForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('alumniId').value;
    const formData = new FormData();
    
    formData.append('nama', document.getElementById('alumniName').value);
    formData.append('periode', document.getElementById('alumniPeriod').value);
    formData.append('jabatan', document.getElementById('alumniPosition').value);
    formData.append('angkatan', document.getElementById('alumniYear').value);
    formData.append('jurusan', document.getElementById('alumniMajor').value);
    
    const photoFile = document.getElementById('alumniPhoto').files[0];
    if (photoFile) {
        formData.append('photo', photoFile);
    }
    
    try {
        const url = id ? `/api/alumni/${id}` : '/api/alumni';
        const method = id ? 'PUT' : 'POST';
        
        await fetch(url, {
            method,
            body: formData
        });
        
        closeAlumniModal();
        loadAlumni();
        loadDashboard();
    } catch (error) {
        console.error('Error saving alumni:', error);
        alert('Failed to save alumni');
    }
});
async function deleteAlumni(id) {
    if (!confirm('Delete this alumni?')) return;
    
    try {
        await fetch(`/api/alumni/${id}`, { method: 'DELETE' });
        loadAlumni();
        loadDashboard();
    } catch (error) {
        console.error('Error deleting alumni:', error);
        alert('Failed to delete alumni');
    }
}

// ==================== STRUCTURE ====================
async function loadStructure() {
    try {
        const response = await fetch('/api/struktur');
        const structure = await response.json();
        
        const html = `
            <div class="struktur-admin-grid">
                ${structure.length === 0 ? '<p style="text-align:center; grid-column: 1/-1;">No structure members yet</p>' : ''}
                ${structure.map(s => `
                    <div class="admin-struktur-card">
                        <img src="${s.photo || '/uploads/avatar-placeholder.png'}" 
                             alt="${s.nama}" 
                             class="admin-struktur-photo"
                             onerror="this.src='/uploads/avatar-placeholder.png'">
                        <div class="admin-struktur-info">
                            <h4>${s.nama}</h4>
                            <div><strong>${s.jabatan}</strong></div>
                            <div>Divisi: ${s.divisi}</div>
                            <div>Periode: ${s.periode}</div>
                        </div>
                        <div class="table-actions">
                            <button onclick='editStructure(${JSON.stringify(s)})' class="btn btn-edit">Edit</button>
                            <button onclick="deleteStructure('${s.id}')" class="btn btn-danger">Delete</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        document.getElementById('structureTable').innerHTML = html;
    } catch (error) {
        console.error('Error loading structure:', error);
    }
}
function showStructureForm() {
    document.getElementById('structureModalTitle').textContent = 'Add Structure Member';
    document.getElementById('structureForm').reset();
    document.getElementById('structureId').value = '';
    document.getElementById('structureModal').classList.add('active');
}

function editStructure(member) {
    document.getElementById('structureModalTitle').textContent = 'Edit Structure Member';
    document.getElementById('structureId').value = member.id;
    document.getElementById('structureName').value = member.nama;
    document.getElementById('structurePosition').value = member.jabatan;
    document.getElementById('structurePeriod').value = member.periode;
    document.getElementById('structureDivision').value = member.divisi;
    document.getElementById('structureModal').classList.add('active');
}

function closeStructureModal() {
    document.getElementById('structureModal').classList.remove('active');
}

document.getElementById('structureForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('structureId').value;
    const formData = new FormData();
    
    formData.append('nama', document.getElementById('structureName').value);
    formData.append('jabatan', document.getElementById('structurePosition').value);
    formData.append('periode', document.getElementById('structurePeriod').value);
    formData.append('divisi', document.getElementById('structureDivision').value);
    
    const photoFile = document.getElementById('structurePhoto').files[0];
    if (photoFile) {
        formData.append('photo', photoFile);
    }
    
    try {
        const url = id ? `/api/struktur/${id}` : '/api/struktur';
        const method = id ? 'PUT' : 'POST';
        
        await fetch(url, {
            method,
            body: formData
        });
        
        closeStructureModal();
        loadStructure();
    } catch (error) {
        console.error('Error saving structure member:', error);
        alert('Failed to save structure member');
    }
});
async function deleteStructure(id) {
    if (!confirm('Delete this structure member?')) return;
    
    try {
        await fetch(`/api/struktur/${id}`, { method: 'DELETE' });
        loadStructure();
    } catch (error) {
        console.error('Error deleting structure member:', error);
        alert('Failed to delete structure member');
    }
}

// Initialize
loadDashboard();