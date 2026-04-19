// ─── Avatar helpers ──────────────────────────────────────────────────────────

/* Resolve avatar URL — Cloudinary URLs come as-is; relative paths get the backend base */
function resolveAvatarUrl(raw) {
  if (!raw) return null;
  if (raw.startsWith('http')) return raw;
  return 'https://web-wizards-backend.onrender.com/' + raw;
}

/* Apply avatar to profile circle + navbar icon */
function applyAvatar(url) {
  if (!url) return;
  const img = document.getElementById('profilePhotoImg');
  if (img) img.src = url;
  const navIcon = document.getElementById('nav-profile-icon');
  if (navIcon) navIcon.src = url;
}

/* Upload avatar to backend then update everywhere */
async function uploadAvatar(input) {
  const file = input.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showUploadStatus('Only image files are allowed.', 'error');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showUploadStatus('Image must be smaller than 5 MB.', 'error');
    return;
  }

  // Optimistic preview
  applyAvatar(URL.createObjectURL(file));
  showUploadStatus('Uploading…', 'loading');

  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('https://web-wizards-backend.onrender.com/admin/avatar', {
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
      loadAdminProfile(); // revert on failure
    }
  } catch (e) {
    console.error('Avatar upload error:', e);
    showUploadStatus('Upload failed. Check your connection.', 'error');
    loadAdminProfile();
  }

  input.value = '';
}

/* Show a timed status message below the photo */
function showUploadStatus(msg, type) {
  const el = document.getElementById('uploadStatus');
  if (!el) return;
  el.textContent = msg;
  el.className = 'upload-status upload-status--' + type;
  if (type !== 'loading') {
    setTimeout(() => { el.textContent = ''; el.className = 'upload-status'; }, 3000);
  }
}

// ─── Element refs ────────────────────────────────────────────────────────────
const pendingCard = document.getElementById('pendingCard');
const allRegisteredCard = document.getElementById('allRegisteredCard');
const tableWrapper = document.getElementById('tableWrapper');
const allRegisteredWrapper = document.getElementById('allRegisteredWrapper');
const closeBtn = document.getElementById('closeBtn');
const closeAllBtn = document.getElementById('closeAllBtn');
const adminArrow = document.getElementById('adminArrow');
const allArrow = document.getElementById('allArrow');

// ─── Toggle: "View open complaints" (in_progress table) ──────────────────────
pendingCard.addEventListener('click', function () {
  const isHidden = tableWrapper.classList.toggle('hidden');
  adminArrow.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(90deg)';
});

closeBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  tableWrapper.classList.add('hidden');
  adminArrow.style.transform = 'rotate(0deg)';
});

// ─── Toggle: "View all registered" (open status table) ───────────────────────
allRegisteredCard.addEventListener('click', function () {
  const isHidden = allRegisteredWrapper.classList.toggle('hidden');
  allArrow.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(90deg)';
});

closeAllBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  allRegisteredWrapper.classList.add('hidden');
  allArrow.style.transform = 'rotate(0deg)';
});

// ─── Filter rows by complaint ID ─────────────────────────────────────────────
function filterTable(tbodyId, inputId) {
  const query = document.getElementById(inputId).value.toLowerCase();
  document.querySelectorAll('#' + tbodyId + ' .row').forEach(row => {
    const id = row.getAttribute('data-id').toLowerCase();
    row.style.display = id.includes(query) ? '' : 'none';
  });
}

// Keep old name as alias so any inline onkeyup="filterComplaints()" still works
function filterComplaints() { filterTable('complaintsBody', 'searchInput'); }

// ─── Status dropdown colour update ───────────────────────────────────────────
function updateStatus(select) {
  const colors = {
    'open': '#E8834A',
    'in_progress': '#A75F37',
    'resolved': '#7A958F'
  };
  select.style.borderColor = colors[select.value] || 'rgba(217,185,159,0.15)';
  select.style.color = colors[select.value] || 'rgba(217,185,159,0.8)';
}

// ─── Build a single table row ─────────────────────────────────────────────────
function buildRow(complaint) {
  const row = document.createElement('tr');
  const cId = complaint.id || complaint.complaintId;
  row.classList.add('row');
  row.setAttribute('data-id', cId);

  row.innerHTML =
    '<td>' + cId + '</td>' +
    '<td>' + (complaint.description || complaint.title || 'N/A') + '</td>' +
    '<td>' + (complaint.date || formatDate(complaint.created_at)) + '</td>' +
    '<td>' +
    '<select class="status-select status-drop" onchange="updateComplaintStatus(\'' + cId + '\', this.value, this)">' +
    '<option value="open"        ' + (complaint.status === 'open' ? 'selected' : '') + '>Open</option>' +
    '<option value="in_progress" ' + (complaint.status === 'in_progress' ? 'selected' : '') + '>In Progress</option>' +
    '<option value="resolved"    ' + (complaint.status === 'resolved' ? 'selected' : '') + '>Resolved</option>' +
    '</select>' +
    '</td>';
  return row;
}

// ─── Empty-state placeholder row ─────────────────────────────────────────────
function emptyRow(msg) {
  return '<tr><td colspan="4" style="padding:28px 18px; text-align:center; color:rgba(217,185,159,0.55); font-size:0.875rem;">' + msg + '</td></tr>';
}

// ─── Load department metrics ──────────────────────────────────────────────────
async function loadDepartmentStats(department) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      'https://web-wizards-backend.onrender.com/complaints/complaint/admin/stats?department=' + encodeURIComponent(department),
      { headers: { "Authorization": 'Bearer ' + token } }
    );
    const data = await res.json();
    console.log("Admin department stats received:", data);

    const total = data.total_complaints ?? data.total ?? 0;
    const resolved = data.resolved ?? 0;
    const open = data.open ?? data.pending ?? (total - resolved);

    document.getElementById('totalCount').textContent = total;
    document.getElementById('resolvedCount').textContent = resolved;
    document.getElementById('pendingCount').textContent = open;

    document.querySelectorAll('.metric-loading').forEach(el => el.classList.remove('metric-loading'));

    const base = total || 1;
    document.getElementById('fillTotal').style.width = '100%';
    document.getElementById('fillResolved').style.width = Math.round((resolved / base) * 100) + '%';
    document.getElementById('fillOpen').style.width = Math.round((open / base) * 100) + '%';

  } catch (err) {
    console.error('Failed to load department stats:', err);
  }
}

// ─── Load & split complaints into two tables ──────────────────────────────────
//
//   "All Registered" table  → status === 'open'        (freshly filed, not yet actioned)
//   "Open Complaints" table → status === 'in_progress'  (admin is actively working on it)
//   'resolved' complaints   → hidden from both tables
//
async function loadComplaints(department) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      'https://web-wizards-backend.onrender.com/complaints/admin/my-complaints?department=' + encodeURIComponent(department),
      { headers: { "Authorization": 'Bearer ' + token } }
    );
    const data = await res.json();

    const allBody = document.getElementById('allRegisteredBody');
    const openBody = document.getElementById('complaintsBody');
    allBody.innerHTML = '';
    openBody.innerHTML = '';

    if (!data || data.length === 0) {
      allBody.innerHTML = emptyRow('No registered complaints found.');
      openBody.innerHTML = emptyRow('No open complaints found.');
      return;
    }

    let allCount = 0;
    let openCount = 0;

    data.forEach(complaint => {
      const status = (complaint.status || 'open').toLowerCase();
      const row = buildRow(complaint);

      if (status === 'open') {
        allBody.appendChild(row);
        allCount++;
      } else if (status === 'in_progress') {
        openBody.appendChild(row);
        openCount++;
      }
      // resolved → omit from both tables
    });

    if (allCount === 0) allBody.innerHTML = emptyRow('No registered complaints found.');
    if (openCount === 0) openBody.innerHTML = emptyRow('No open complaints found.');

    document.querySelectorAll('.status-drop').forEach(s => updateStatus(s));

  } catch (err) {
    console.error('Failed to load complaints:', err);
  }
}

// ─── Update status + live-migrate row between tables ─────────────────────────
async function updateComplaintStatus(complaintId, newStatus, selectEl) {
  const token = localStorage.getItem("token");
  try {
    const url = 'https://web-wizards-backend.onrender.com/complaints/complaint/' + complaintId + '/status?status_data=' + encodeURIComponent(newStatus);
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { "Authorization": 'Bearer ' + token, "Accept": "application/json" }
    });

    if (res.ok) {
      updateStatus(selectEl);

      const row = selectEl.closest('tr');
      const allBody = document.getElementById('allRegisteredBody');
      const openBody = document.getElementById('complaintsBody');

      if (newStatus === 'in_progress') {
        // open → in_progress: move row to "Open Complaints" table
        openBody.appendChild(row);
        _checkEmpty(allBody, 'No registered complaints found.');
        _clearEmpty(openBody);
      } else if (newStatus === 'open') {
        // in_progress → open: move row back to "All Registered" table
        allBody.appendChild(row);
        _checkEmpty(openBody, 'No open complaints found.');
        _clearEmpty(allBody);
      } else if (newStatus === 'resolved') {
        // resolved: remove from whichever table it's in
        row.remove();
        _checkEmpty(allBody, 'No registered complaints found.');
        _checkEmpty(openBody, 'No open complaints found.');
      }

      // Refresh metric counts
      const dept = document.querySelectorAll('.detail-value')[1].textContent.trim();
      loadDepartmentStats(dept);

    } else {
      const errData = await res.json();
      alert("Failed to update status: " + (errData.detail || "Server error"));
    }
  } catch (e) {
    console.error("Status update error:", e);
    alert("An error occurred while updating status.");
  }
}

// ─── Empty-state helpers ──────────────────────────────────────────────────────
function _checkEmpty(tbody, msg) {
  if (tbody.querySelectorAll('tr.row').length === 0) {
    const old = tbody.querySelector('tr:not(.row)');
    if (old) old.remove();
    tbody.innerHTML = emptyRow(msg);
  }
}

function _clearEmpty(tbody) {
  const placeholder = tbody.querySelector('tr:not(.row)');
  if (placeholder) placeholder.remove();
}

// ─── Utility ─────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Load admin profile ───────────────────────────────────────────────────────
async function loadAdminProfile() {
  const token = localStorage.getItem("token");
  if (!token) { window.location.href = "login.html"; return; }

  try {
    const res = await fetch('https://web-wizards-backend.onrender.com/admin/me', {
      headers: { "Authorization": 'Bearer ' + token }
    });
    if (res.ok) {
      const data = await res.json();
      document.querySelector('.admin-name').textContent = data.username;
      document.querySelectorAll('.detail-value')[0].textContent = data.position || 'Administrator';
      document.querySelectorAll('.detail-value')[1].textContent = data.department || 'General';

      // Backend returns the Cloudinary URL under `profile_pic`
      applyAvatar(resolveAvatarUrl(data.profile_pic || data.avatar));

      const dept = data.department || 'General';
      loadDepartmentStats(dept);
      loadComplaints(dept);

    } else {
      localStorage.clear();
      window.location.href = "login.html";
    }
  } catch (e) {
    console.error("Admin profile load error:", e);
  }
}

// Bootstrap
document.addEventListener("DOMContentLoaded", loadAdminProfile);