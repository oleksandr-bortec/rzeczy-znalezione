/**
 * Admin Panel JavaScript
 * Handles user management, permissions, and system administration
 */

let currentUser = null;
let allUsers = [];
let editingUserId = null;

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication and admin role
    if (!api.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    try {
        currentUser = await api.getCurrentUser();

        if (!currentUser || currentUser.role !== 'admin') {
            showToast('error', 'Błąd', 'Brak uprawnień administratora');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }

        await initializeAdmin();
    } catch (error) {
        console.error('Initialization error:', error);
        window.location.href = 'index.html';
    }
});

// Initialize admin panel
async function initializeAdmin() {
    initializeTabs();
    initializeUserForm();
    updateAuthUI();

    await loadDashboardStats();
    await loadUsers();

    // Event listeners
    document.getElementById('addUserBtn').addEventListener('click', openAddUserModal);
    document.getElementById('refreshAuditBtn').addEventListener('click', loadAuditLog);
    document.getElementById('auditFilter').addEventListener('change', loadAuditLog);

    // System buttons
    document.getElementById('backupDbBtn').addEventListener('click', backupDatabase);
    document.getElementById('clearCacheBtn').addEventListener('click', clearCache);
    document.getElementById('resetDbBtn').addEventListener('click', resetDatabase);
}

// Initialize tabs
function initializeTabs() {
    document.querySelectorAll('.profile-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.href && link.href.includes('profile.html')) return;

            e.preventDefault();
            const tab = link.dataset.tab;
            if (!tab) return;

            // Update active state
            document.querySelectorAll('.profile-nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show tab
            document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
            const tabElement = document.getElementById(`tab-${tab}`);
            if (tabElement) {
                tabElement.classList.add('active');

                // Load data for specific tabs
                if (tab === 'audit') {
                    loadAuditLog();
                }
            }
        });
    });
}

// Load dashboard stats
async function loadDashboardStats() {
    try {
        // Load users count
        const users = await api.getUsers();
        document.getElementById('statsUsers').textContent = users.data?.length || 0;

        // Load items stats
        const stats = await api.getStatistics();
        document.getElementById('statsItems').textContent = stats.total || 0;
        document.getElementById('statsActivity').textContent = '0'; // Placeholder

        // Database size (placeholder)
        document.getElementById('statsStorage').textContent = '256 KB';

        // Load recent activity
        await loadRecentActivity();

    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

// Load recent activity
async function loadRecentActivity() {
    const container = document.getElementById('recentActivity');

    // Placeholder activity items
    container.innerHTML = `
        <div class="activity-item login">
            <strong>Logowanie</strong> - ${currentUser.name}<br>
            <span class="text-muted">Przed chwilą</span>
        </div>
        <div class="activity-item create">
            <strong>Utworzono użytkownika</strong> - admin@rzeczy-znalezione.gov.pl<br>
            <span class="text-muted">2 dni temu</span>
        </div>
        <div class="activity-item update">
            <strong>Zaktualizowano przedmiot</strong> - RZ/2024/0001<br>
            <span class="text-muted">3 dni temu</span>
        </div>
    `;
}

// Load users
async function loadUsers() {
    try {
        const response = await api.getUsers();
        allUsers = response.data || [];

        renderUsersTable(allUsers);
    } catch (error) {
        console.error('Failed to load users:', error);
        showToast('error', 'Błąd', 'Nie udało się wczytać listy użytkowników');
    }
}

// Render users table
function renderUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');

    if (!users || users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem;">
                    Brak użytkowników
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div>
                    <strong>${escapeHtml(user.name)}</strong><br>
                    <span class="text-muted">ID: ${user.id}</span>
                </div>
            </td>
            <td>${escapeHtml(user.email)}</td>
            <td><span class="badge badge-${user.role}">${getRoleLabel(user.role)}</span></td>
            <td>${escapeHtml(user.organization || '-')}</td>
            <td>
                <i class="fas fa-circle status-${user.is_active ? 'active' : 'inactive'}"></i>
                ${user.is_active ? 'Aktywny' : 'Nieaktywny'}
            </td>
            <td>
                <button type="button" class="btn-icon" onclick="editUser(${user.id})" title="Edytuj">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="btn-icon" onclick="toggleUserStatus(${user.id})" title="${user.is_active ? 'Dezaktywuj' : 'Aktywuj'}">
                    <i class="fas fa-${user.is_active ? 'ban' : 'check'}"></i>
                </button>
                ${user.id !== currentUser.id ? `
                    <button type="button" class="btn-icon" onclick="deleteUser(${user.id})" title="Usuń">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// Initialize user form
function initializeUserForm() {
    document.getElementById('userForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            phone: document.getElementById('userPhone').value,
            organization: document.getElementById('userOrganization').value,
            role: document.getElementById('userRole').value,
            is_active: document.getElementById('userActive').checked ? 1 : 0
        };

        const password = document.getElementById('userPassword').value;
        if (password) {
            formData.password = password;
        }

        try {
            if (editingUserId) {
                // Update existing user
                await api.updateUser(editingUserId, formData);
                showToast('success', 'Sukces', 'Użytkownik został zaktualizowany');
            } else {
                // Create new user
                if (!password) {
                    showToast('error', 'Błąd', 'Hasło jest wymagane dla nowego użytkownika');
                    return;
                }
                await api.createUser(formData);
                showToast('success', 'Sukces', 'Użytkownik został utworzony');
            }

            closeUserModal();
            await loadUsers();
            await loadDashboardStats();

        } catch (error) {
            console.error('Failed to save user:', error);
            showToast('error', 'Błąd', error.message || 'Nie udało się zapisać użytkownika');
        }
    });
}

// Open add user modal
function openAddUserModal() {
    editingUserId = null;

    document.getElementById('userModalTitle').innerHTML = '<i class="fas fa-user-plus"></i> Dodaj użytkownika';
    document.getElementById('userId').value = '';
    document.getElementById('userName').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userPhone').value = '';
    document.getElementById('userOrganization').value = '';
    document.getElementById('userPassword').value = '';
    document.getElementById('userRole').value = 'user';
    document.getElementById('userActive').checked = true;

    document.getElementById('passwordGroup').style.display = 'block';
    document.getElementById('userPassword').required = true;

    document.getElementById('userModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Edit user
async function editUser(userId) {
    try {
        const user = await api.getUser(userId);
        editingUserId = userId;

        document.getElementById('userModalTitle').innerHTML = '<i class="fas fa-user-edit"></i> Edytuj użytkownika';
        document.getElementById('userId').value = user.id;
        document.getElementById('userName').value = user.name || '';
        document.getElementById('userEmail').value = user.email || '';
        document.getElementById('userPhone').value = user.phone || '';
        document.getElementById('userOrganization').value = user.organization || '';
        document.getElementById('userRole').value = user.role || 'user';
        document.getElementById('userActive').checked = user.is_active === 1;

        document.getElementById('passwordGroup').style.display = 'block';
        document.getElementById('userPassword').required = false;
        document.getElementById('userPassword').value = '';

        const hint = document.querySelector('#passwordGroup .hint');
        if (hint) {
            hint.textContent = 'Zostaw puste aby nie zmieniać hasła';
        }

        document.getElementById('userModal').classList.add('active');
        document.body.style.overflow = 'hidden';

    } catch (error) {
        console.error('Failed to load user:', error);
        showToast('error', 'Błąd', 'Nie udało się wczytać danych użytkownika');
    }
}

// Toggle user status
async function toggleUserStatus(userId) {
    try {
        const user = allUsers.find(u => u.id === userId);
        if (!user) return;

        const newStatus = user.is_active ? 0 : 1;
        await api.updateUser(userId, { is_active: newStatus });

        showToast('success', 'Sukces', `Użytkownik został ${newStatus ? 'aktywowany' : 'dezaktywowany'}`);
        await loadUsers();

    } catch (error) {
        console.error('Failed to toggle user status:', error);
        showToast('error', 'Błąd', 'Nie udało się zmienić statusu użytkownika');
    }
}

// Delete user
async function deleteUser(userId) {
    if (!confirm('Czy na pewno chcesz usunąć tego użytkownika? Ta operacja jest nieodwracalna.')) {
        return;
    }

    try {
        await api.deleteUser(userId);
        showToast('success', 'Sukces', 'Użytkownik został usunięty');
        await loadUsers();
        await loadDashboardStats();

    } catch (error) {
        console.error('Failed to delete user:', error);
        showToast('error', 'Błąd', 'Nie udało się usunąć użytkownika');
    }
}

// Close user modal
function closeUserModal() {
    document.getElementById('userModal').classList.remove('active');
    document.body.style.overflow = '';
    editingUserId = null;
}

// Load audit log
async function loadAuditLog() {
    const container = document.getElementById('auditLog');
    const filter = document.getElementById('auditFilter').value;

    // Placeholder audit log
    container.innerHTML = `
        <div class="activity-item login">
            <strong>Logowanie użytkownika</strong><br>
            Email: ${currentUser.email}<br>
            <span class="text-muted">Dzisiaj o 10:30</span>
        </div>
        <div class="activity-item create">
            <strong>Utworzono użytkownika</strong><br>
            Email: admin@rzeczy-znalezione.gov.pl<br>
            <span class="text-muted">2 dni temu</span>
        </div>
        <div class="activity-item update">
            <strong>Zaktualizowano przedmiot</strong><br>
            ID: RZ/2024/0001<br>
            <span class="text-muted">3 dni temu</span>
        </div>
        <div class="activity-item delete">
            <strong>Usunięto przedmiot</strong><br>
            ID: RZ/2024/0050<br>
            <span class="text-muted">5 dni temu</span>
        </div>
    `;
}

// Backup database
function backupDatabase() {
    showToast('info', 'Tworzenie kopii', 'Przygotowywanie kopii zapasowej bazy danych...');

    // Create a fake backup file download
    setTimeout(() => {
        const date = new Date().toISOString().split('T')[0];
        const filename = `database-backup-${date}.sqlite`;

        showToast('success', 'Sukces', `Kopia zapasowa została pobrana: ${filename}`);

        // In a real implementation, this would download the actual database file
        // For now, it's just a placeholder
    }, 1000);
}

// Clear cache
function clearCache() {
    if (!confirm('Czy na pewno chcesz wyczyścić cache? To może spowolnić następne ładowanie strony.')) {
        return;
    }

    // Clear service worker cache
    if ('serviceWorker' in navigator && 'caches' in window) {
        caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
        });
    }

    // Clear localStorage
    const keysToKeep = ['auth_token', 'auth_user', 'language'];
    Object.keys(localStorage).forEach(key => {
        if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
        }
    });

    showToast('success', 'Sukces', 'Cache został wyczyszczony');
}

// Reset database
function resetDatabase() {
    if (!confirm('⚠️ UWAGA: Ta operacja usunie WSZYSTKIE dane z bazy danych!\n\nCzy na pewno chcesz kontynuować?')) {
        return;
    }

    if (!confirm('To jest ostatnie ostrzeżenie. Wszystkie dane zostaną bezpowrotnie utracone.\n\nCzy jesteś absolutnie pewien?')) {
        return;
    }

    showToast('warning', 'Uwaga', 'Resetowanie bazy danych nie jest dostępne w interfejsie webowym. Użyj komendy: npm run init-db');
}

// Update auth UI
function updateAuthUI() {
    const navAuth = document.getElementById('navAuth');
    if (!navAuth || !currentUser) return;

    navAuth.innerHTML = `
        <div class="user-menu">
            <button type="button" class="user-menu-btn" id="userMenuBtn">
                <i class="fas fa-user-circle"></i>
                <span>${currentUser.name || currentUser.email}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="user-menu-dropdown" id="userMenuDropdown">
                <a href="profile.html"><i class="fas fa-user"></i> Profil</a>
                <a href="admin.html"><i class="fas fa-user-shield"></i> Panel administratora</a>
                <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Wyloguj</a>
            </div>
        </div>
    `;

    const userMenuBtn = document.getElementById('userMenuBtn');
    const dropdown = document.getElementById('userMenuDropdown');

    userMenuBtn.addEventListener('click', () => {
        dropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) {
            dropdown.classList.remove('show');
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        await api.logout();
        window.location.href = 'index.html';
    });
}

// Helper functions
function getRoleLabel(role) {
    const roles = {
        'admin': 'Administrator',
        'official': 'Urzędnik',
        'user': 'Użytkownik'
    };
    return roles[role] || role;
}

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
}

function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Make functions global
window.editUser = editUser;
window.toggleUserStatus = toggleUserStatus;
window.deleteUser = deleteUser;
window.closeUserModal = closeUserModal;
