/* =============================================
   stud-profile.js
   Student Portal — Profile & Complaint Panels

   Two panels:
     • "All Submitted"   → complaints with status 'open'        (freshly filed)
     • "Open Complaints" → complaints with status 'in_progress' (admin is working on it)
   ============================================= */

let allSubmittedLoaded = false;
let inProgressLoaded = false;

/* ---------- Helpers ---------- */

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getAuthHeaders() {
  const token = localStorage.getItem('token') || '';
  return { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };
}

/* ---------- Dashboard stats ---------- */

async function fetchDashboardStats() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('https://web-wizards-backend.onrender.com/complaints/complaint/student/stats', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) throw new Error('Server error: ' + res.status);

    const stats = await res.json();
    console.log("Dashboard stats received:", stats);

    const submitted = stats.total_complaints ?? stats.total ?? 0;
    const resolved = stats.resolved ?? 0;
    const open = stats.open ?? stats.pending ?? (submitted - resolved);

    document.getElementById('countSubmitted').textContent = submitted;
    document.getElementById('countResolved').textContent = resolved;
    document.getElementById('countPending').textContent = open;

    const badge = document.getElementById('pendingBadge');
    if (badge) badge.textContent = open;

    document.querySelectorAll('.stat-loading').forEach(el => el.classList.remove('stat-loading'));

    const base = submitted || 1;
    document.getElementById('fillSubmitted').style.width = '100%';
    document.getElementById('fillResolved').style.width = Math.round((resolved / base) * 100) + '%';
    document.getElementById('fillPending').style.width = Math.round((open / base) * 100) + '%';

  } catch (err) {
    console.error('Failed to fetch dashboard stats:', err);
  }
}

/* ---------- Profile info ---------- */

/* ---------- Resolve avatar URL from backend ---------- */
function resolveAvatarUrl(raw) {
  if (!raw) return null;
  // Cloudinary URLs and other absolute URLs come through as-is
  if (raw.startsWith('http')) return raw;
  // Relative paths are served directly from the backend
  return 'https://web-wizards-backend.onrender.com/' + raw;
}

/* ---------- Apply avatar everywhere (profile circle + navbar icon) ---------- */
function applyAvatar(url) {
  if (!url) return;
  const img = document.getElementById('profilePhotoImg');
  if (img) img.src = url;
  const navIcon = document.getElementById('nav-profile-icon');
  if (navIcon) navIcon.src = url;
}

async function updateProfileInfo() {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('https://web-wizards-backend.onrender.com/student/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.ok) {
      const data = await res.json();
      document.querySelector('.profile-name').textContent = data.username;
      document.querySelectorAll('.meta-value')[0].textContent = data.sch_id;
      document.querySelectorAll('.meta-value')[1].textContent = data.college_email;

      // Backend returns the Cloudinary URL under `profile_pic`
      applyAvatar(resolveAvatarUrl(data.profile_pic));
    }
  } catch (e) {
    console.error("Profile update error:", e);
  }
}

/* ---------- Upload avatar to backend ---------- */
async function uploadAvatar(input) {
  const file = input.files[0];
  if (!file) return;

  // Validate: images only, max 5 MB
  if (!file.type.startsWith('image/')) {
    showUploadStatus('Only image files are allowed.', 'error');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showUploadStatus('Image must be smaller than 5 MB.', 'error');
    return;
  }

  // Optimistic preview immediately
  const localUrl = URL.createObjectURL(file);
  applyAvatar(localUrl);

  showUploadStatus('Uploading…', 'loading');

  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('https://web-wizards-backend.onrender.com/student/avatar', {
      method: 'PATCH',
      headers: { 'Authorization': 'Bearer ' + token },
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      const finalUrl = resolveAvatarUrl(data.profile_pic || data.avatar || data.avatar_url || data.url);
      if (finalUrl) applyAvatar(finalUrl);
      showUploadStatus('Photo updated!', 'success');
    } else {
      const err = await res.json().catch(() => ({}));
      showUploadStatus(err.detail || 'Upload failed.', 'error');
      // Revert preview on failure
      updateProfileInfo();
    }
  } catch (e) {
    console.error('Avatar upload error:', e);
    showUploadStatus('Upload failed. Check your connection.', 'error');
    updateProfileInfo();
  }

  // Reset input so same file can be re-selected if needed
  input.value = '';
}

/* ---------- Upload status message ---------- */
function showUploadStatus(msg, type) {
  const el = document.getElementById('uploadStatus');
  if (!el) return;
  el.textContent = msg;
  el.className = 'upload-status upload-status--' + type;
  if (type !== 'loading') {
    setTimeout(() => { el.textContent = ''; el.className = 'upload-status'; }, 3000);
  }
}

/* ---------- Shared: fetch all complaints once ---------- */

let _allComplaints = null;

async function _fetchAllComplaints() {
  if (_allComplaints !== null) return _allComplaints;
  const token = localStorage.getItem('token');
  const res = await fetch('https://web-wizards-backend.onrender.com/complaints/student/my-complaints', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (!res.ok) throw new Error('Server error: ' + res.status);
  _allComplaints = await res.json();
  return _allComplaints;
}

/* ---------- Build a status chip ---------- */

function statusChip(status) {
  const s = status.toLowerCase();
  let color, bg, border;
  if (s === 'resolved') {
    color = '#7A958F'; bg = 'rgba(122,149,143,0.12)'; border = 'rgba(122,149,143,0.3)';
  } else if (s === 'in_progress' || s === 'in progress') {
    color = '#A75F37'; bg = 'rgba(167,95,55,0.12)'; border = 'rgba(167,95,55,0.3)';
  } else {
    color = '#E8834A'; bg = 'rgba(232,131,74,0.1)'; border = 'rgba(232,131,74,0.3)';
  }
  const display = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  return '<span class="status-chip" style="background:' + bg + '; color:' + color + '; border-color:' + border + ';">' + display + '</span>';
}

/* ---------- Build table rows ---------- */

function buildRows(complaints, tbody) {
  tbody.innerHTML = '';

  if (!complaints || complaints.length === 0) {
    tbody.innerHTML = '<tr class="table-state-row"><td colspan="4">No complaints here.</td></tr>';
    return;
  }

  complaints.forEach((c, i) => {
    const row = document.createElement('tr');
    row.style.animationDelay = (i * 0.03) + 's';
    row.innerHTML =
      '<td><span class="row-id">' + (c.id || c.complaintId || 'N/A') + '</span></td>' +
      '<td class="row-title">' + (c.title || c.description || 'N/A') + '</td>' +
      '<td class="row-date">' + formatDate(c.created_at || c.date) + '</td>' +
      '<td>' + statusChip(c.status || 'Open') + '</td>';
    tbody.appendChild(row);
  });
}

/* ---------- "All Submitted" panel (status: open) ---------- */

async function fetchAllSubmitted() {
  const tbody = document.getElementById('allSubmittedBody');
  tbody.innerHTML = '<tr class="table-state-row"><td colspan="4">Loading…</td></tr>';
  try {
    const complaints = await _fetchAllComplaints();
    const openOnes = complaints.filter(c => (c.status || '').toLowerCase() === 'open');
    buildRows(openOnes, tbody);
    allSubmittedLoaded = true;
  } catch (err) {
    console.error('Failed to fetch all submitted:', err);
    tbody.innerHTML = '<tr class="table-state-row error"><td colspan="4">Failed to load complaints.</td></tr>';
  }
}

/* ---------- "Open Complaints" panel (status: in_progress) ---------- */

async function fetchPendingComplaints() {
  const tbody = document.getElementById('pendingTableBody');
  tbody.innerHTML = '<tr class="table-state-row"><td colspan="4">Loading…</td></tr>';
  try {
    const complaints = await _fetchAllComplaints();
    const inProgressOnes = complaints.filter(c => {
      const s = (c.status || '').toLowerCase();
      return s === 'in_progress' || s === 'in progress';
    });

    const badge = document.getElementById('pendingBadge');
    if (badge) badge.textContent = inProgressOnes.length;

    buildRows(inProgressOnes, tbody);
    inProgressLoaded = true;
  } catch (err) {
    console.error('Failed to fetch in-progress complaints:', err);
    tbody.innerHTML = '<tr class="table-state-row error"><td colspan="4">Failed to load complaints.</td></tr>';
  }
}

/* ---------- Toggle: "All Submitted" panel ---------- */

function toggleAllSubmitted() {
  const panel = document.getElementById('allSubmittedPanel');
  const btn = document.getElementById('toggleAllSubmittedBtn');
  const isOpen = panel.classList.toggle('open');

  btn.innerHTML = (isOpen ? 'Close' : 'View all submitted') +
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"' +
    ' style="transition:transform 0.3s; transform:' + (isOpen ? 'rotate(90deg)' : 'rotate(0deg)') + '">' +
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/>' +
    '</svg>';

  if (isOpen && !allSubmittedLoaded) fetchAllSubmitted();
}

/* ---------- Toggle: "Open Complaints" panel (in_progress) ---------- */

function togglePendingList() {
  const panel = document.getElementById('pendingPanel');
  const btn = document.getElementById('togglePendingBtn');
  const isOpen = panel.classList.toggle('open');

  btn.innerHTML = (isOpen ? 'Close' : 'View open complaints') +
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"' +
    ' style="transition:transform 0.3s; transform:' + (isOpen ? 'rotate(90deg)' : 'rotate(0deg)') + '">' +
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/>' +
    '</svg>';

  if (isOpen && !inProgressLoaded) fetchPendingComplaints();
}

/* ---------- Init ---------- */

document.addEventListener('DOMContentLoaded', () => {
  updateProfileInfo();
  fetchDashboardStats();
});