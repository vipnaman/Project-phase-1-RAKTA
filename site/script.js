const STORAGE_KEYS = {
  donors: 'raktaDonors',
  requests: 'raktaRequests',
  accounts: 'raktaAccounts',
  notifications: 'raktaNotifications',
  activeUser: 'raktaActiveUser',
  activities: 'raktaActivities',
  settings: 'raktaSiteSettings'
};

const uttarPradeshCities = [
  'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amroha', 'Amethi', 'Auraiya', 'Ayodhya', 'Azamgarh', 'Bagpat', 'Bahraich', 'Ballia',
  'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli',
  'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur',
  'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj',
  'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar', 'Lakhimpur Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba',
  'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj',
  'Rae Bareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur',
  'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'
];

const dashboardRole = document.getElementById('dashboardRole');
const dashboardRequests = document.getElementById('dashboardRequests');
const dashboardMatches = document.getElementById('dashboardMatches');

const defaultAccounts = [
  {
    id: 'acc-donor-demo',
    name: 'Aarav Singh',
    email: 'donor@rakta.com',
    password: 'rakta123',
    role: 'donor',
    phone: '+91 98765 43210'
  },
  {
    id: 'acc-requester-demo',
    name: 'Priya Verma',
    email: 'requester@rakta.com',
    password: 'rakta123',
    role: 'requester',
    phone: '+91 98765 90909'
  },
  {
    id: 'acc-admin-demo',
    name: 'RAKTA Administrator',
    email: 'admin@rakta.com',
    password: 'rakta123',
    role: 'admin',
    phone: '+91 98765 00000'
  }
];

const defaultDonors = [
  { id: 'donor-1', accountId: 'acc-donor-demo', name: 'Aarav Singh', bloodGroup: 'O+', city: 'Lucknow', area: 'Hazratganj', availability: 'AVAILABLE', phone: '+91 98765 43210', donationCount: 3, verified: true, status: 'Approved' },
  { id: 'donor-2', accountId: 'acc-requester-demo', name: 'Mehak Verma', bloodGroup: 'B+', city: 'Kanpur', area: 'Swaroop Nagar', availability: 'RECENTLY_ACTIVE', phone: '+91 98765 11111', donationCount: 2, verified: true, status: 'Approved' },
  { id: 'donor-3', accountId: 'acc-donor-demo', name: 'Rohit Tiwari', bloodGroup: 'A-', city: 'Varanasi', area: 'Assi', availability: 'AVAILABLE', phone: '+91 98765 22222', donationCount: 1, verified: false, status: 'Pending' }
];

const defaultRequests = [
  { id: 'req-1', patient: 'Riya Sharma', bloodGroup: 'O+', city: 'Lucknow', units: 2, urgency: 'Critical', phone: '+91 90000 11111' },
  { id: 'req-2', patient: 'Aman Khan', bloodGroup: 'B+', city: 'Kanpur', units: 4, urgency: 'Urgent', phone: '+91 90000 22222' },
  { id: 'req-3', patient: 'Sana Ali', bloodGroup: 'AB-', city: 'Varanasi', units: 3, urgency: 'Critical', phone: '+91 90000 33333' }
];

const defaultNotifications = [
  {
    id: 'note-1',
    userId: 'acc-donor-demo',
    type: 'success',
    message: 'Your account is active. We will notify you about nearby requests and donation milestones.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'note-2',
    userId: 'acc-requester-demo',
    type: 'info',
    message: 'A blood donor match for your area is available. Please review the donor list and contact them.',
    createdAt: new Date().toISOString()
  }
];

const state = {
  donors: loadFromStorage(STORAGE_KEYS.donors, defaultDonors),
  requests: loadFromStorage(STORAGE_KEYS.requests, defaultRequests),
  accounts: loadFromStorage(STORAGE_KEYS.accounts, defaultAccounts),
  notifications: loadFromStorage(STORAGE_KEYS.notifications, defaultNotifications),
  activeUserId: loadFromStorage(STORAGE_KEYS.activeUser, null),
  activities: loadFromStorage(STORAGE_KEYS.activities, []),
  settings: loadFromStorage(STORAGE_KEYS.settings, { announcement: 'Every drop can save a life.', status: 'Available', donorDirectory: 'Visible', requestBoard: 'Open' })
};

defaultAccounts.forEach((account) => {
  if (!state.accounts.some((savedAccount) => savedAccount.id === account.id)) {
    state.accounts.push(account);
  }
});

const donorForm = document.getElementById('donorForm');
const requestForm = document.getElementById('requestForm');
const searchForm = document.getElementById('searchForm');
const searchResults = document.getElementById('searchResults');
const requestBoard = document.getElementById('requestBoard');
const donorMessage = document.getElementById('donorMessage');
const requestMessage = document.getElementById('requestMessage');
const donorCount = document.getElementById('donorCount');
const requestCount = document.getElementById('requestCount');
const notificationList = document.getElementById('notificationList');
const profilePanel = document.getElementById('profilePanel');
const adminQueue = document.getElementById('adminQueue');
const adminTotalDonors = document.getElementById('adminTotalDonors');
const adminVerifiedCount = document.getElementById('adminVerifiedCount');
const adminPendingCount = document.getElementById('adminPendingCount');
const loginForm = document.getElementById('loginForm');
const registerAccountForm = document.getElementById('registerAccountForm');
const loginMessage = document.getElementById('loginMessage');
const registerAccountMessage = document.getElementById('registerAccountMessage');
const currentUserLabel = document.getElementById('currentUserLabel');
const logoutButton = document.getElementById('logoutButton');
const notificationBell = document.getElementById('notificationBell');
const headerNotificationCount = document.getElementById('headerNotificationCount');
const authTabs = document.querySelectorAll('.auth-tab');
const notificationFilters = document.querySelectorAll('[data-notification-filter]');
const markAllNotifications = document.getElementById('markAllNotifications');
const deleteReadNotifications = document.getElementById('deleteReadNotifications');
let notificationFilter = 'all';
const adminActivity = document.getElementById('adminActivity');
const adminSettingsForm = document.getElementById('adminSettingsForm');
const adminSettingsMessage = document.getElementById('adminSettingsMessage');
const donorDirectoryStatus = document.getElementById('donorDirectoryStatus');
const requestBoardStatus = document.getElementById('requestBoardStatus');
const adminActivitySummary = document.getElementById('adminActivitySummary');
const heroAnnouncement = document.getElementById('heroAnnouncement');
const heroStatus = document.querySelector('.status-pill');

function loadFromStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    const parsed = JSON.parse(item);
    return parsed ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.donors, JSON.stringify(state.donors));
  localStorage.setItem(STORAGE_KEYS.requests, JSON.stringify(state.requests));
  localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(state.accounts));
  localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(state.notifications));
  localStorage.setItem(STORAGE_KEYS.activeUser, JSON.stringify(state.activeUserId));
  localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(state.activities));
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(state.settings));
}

function logActivity(type, details) {
  state.activities.unshift({ id: `activity-${Date.now()}`, type, details, createdAt: new Date().toISOString() });
  state.activities = state.activities.slice(0, 100);
  saveState();
}

function notifyUser(userId, message, type = 'info') {
  if (!userId) return;
  state.notifications.unshift({
    id: `note-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    userId,
    type,
    message,
    read: false,
    createdAt: new Date().toISOString()
  });
  saveState();
  renderNotifications();
}

function getActiveUser() {
  return state.accounts.find((account) => account.id === state.activeUserId) || null;
}

function isAdmin() {
  return getActiveUser()?.role === 'admin';
}

function populateCitySelectors() {
  document.querySelectorAll('select[id$="City"]').forEach((select) => {
    const currentValue = select.value;
    const includeAny = select.id === 'searchCity';
    select.innerHTML = includeAny ? '<option value="">Any city</option>' : '';
    uttarPradeshCities.forEach((city) => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      select.appendChild(option);
    });
    select.value = uttarPradeshCities.includes(currentValue) ? currentValue : (includeAny ? '' : uttarPradeshCities[0]);
  });
}

function applySiteSettings() {
  const directoryHidden = state.settings.donorDirectory === 'Hidden';
  const requestsReadOnly = state.settings.requestBoard === 'Read-only';
  document.getElementById('searchForm').style.opacity = directoryHidden ? '0.55' : '1';
  document.getElementById('searchForm').querySelector('button').disabled = directoryHidden;
  document.getElementById('searchResults').innerHTML = directoryHidden
    ? '<div class="donor-card"><h3>Directory temporarily unavailable</h3><p class="donor-meta">The admin has temporarily hidden the verified donor directory.</p></div>'
    : document.getElementById('searchResults').innerHTML;
  document.getElementById('requestForm').style.opacity = requestsReadOnly ? '0.55' : '1';
  document.getElementById('requestForm').querySelector('button').disabled = requestsReadOnly;
}

function getAvailabilityLabel(value) {
  return value === 'AVAILABLE' ? 'Available' : value === 'RECENTLY_ACTIVE' ? 'Recently active' : 'Unavailable';
}

function renderStats() {
  donorCount.textContent = String(state.donors.length);
  requestCount.textContent = String(state.requests.length);
  const activeCount = state.notifications.filter((note) => note.userId === state.activeUserId).length;
  headerNotificationCount.textContent = String(Math.max(activeCount, 0));

  const user = getActiveUser();
  if (user) {
    dashboardRole.textContent = user.role;
    dashboardRequests.textContent = String(state.requests.filter((request) => request.requesterId === user.id || user.role === 'donor' ? true : true).length);
    const userDonor = state.donors.find((donor) => donor.accountId === user.id);
    dashboardMatches.textContent = String(userDonor ? state.requests.filter((request) => request.bloodGroup === userDonor.bloodGroup && request.city === userDonor.city).length : 0);
  } else {
    dashboardRole.textContent = '—';
    dashboardRequests.textContent = '0';
    dashboardMatches.textContent = '0';
  }
}

function renderNotifications() {
  const user = getActiveUser();
  const userNotifications = user ? state.notifications.filter((note) => note.userId === user.id) : [];
  const visibleNotifications = userNotifications.filter((note) => notificationFilter === 'all' || (notificationFilter === 'unread' && !note.read) || (notificationFilter === 'read' && note.read));

  if (!user) {
    notificationList.innerHTML = '<div class="notification-item info"><div class="notification-top"><strong>Account required</strong><span class="notification-pill">Info</span></div><p>Sign in to receive alerts for donor matches, donation updates, and request responses.</p></div>';
    currentUserLabel.textContent = 'Not signed in';
    logoutButton.disabled = true;
    logoutButton.style.opacity = '0.5';
    renderStats();
    renderProfile();
    renderAdminPanel();
    return;
  }

  currentUserLabel.textContent = `${user.name} • ${user.role}`;
  logoutButton.disabled = false;
  logoutButton.style.opacity = '1';

  if (!visibleNotifications.length) {
    notificationList.innerHTML = '<div class="notification-item info"><div class="notification-top"><strong>No notifications yet</strong><span class="notification-pill">Info</span></div><p>Your account will receive updates whenever any donor or requester responds to your action.</p></div>';
    renderStats();
    renderProfile();
    renderAdminPanel();
    return;
  }

  notificationList.innerHTML = visibleNotifications.map((note) => `
    <div class="notification-item ${note.type} ${note.read ? 'is-read' : 'is-unread'}">
      <div class="notification-top">
        <strong>${note.type === 'success' ? 'Success' : note.type === 'warning' ? 'Alert' : 'Update'}</strong>
        <div class="notification-item-actions"><span class="notification-pill">${note.read ? 'Read' : 'New'}</span><button type="button" class="notification-action" data-notification-action="delete" data-notification-id="${note.id}">Delete</button>${note.read ? '' : `<button type="button" class="notification-action" data-notification-action="read" data-notification-id="${note.id}">Mark read</button>`}</div>
      </div>
      <p>${note.message}</p>
      <time>${new Date(note.createdAt).toLocaleString()}</time>
    </div>
  `).join('');

  renderStats();
  renderProfile();
  renderAdminPanel();
}

notificationFilters.forEach((button) => {
  button.addEventListener('click', () => {
    notificationFilter = button.dataset.notificationFilter || 'all';
    notificationFilters.forEach((item) => item.classList.toggle('active', item === button));
    renderNotifications();
  });
});

markAllNotifications.addEventListener('click', () => {
  const user = getActiveUser();
  if (!user) return;
  state.notifications.forEach((note) => { if (note.userId === user.id) note.read = true; });
  saveState();
  renderNotifications();
});

deleteReadNotifications.addEventListener('click', () => {
  const user = getActiveUser();
  if (!user) return;
  state.notifications = state.notifications.filter((note) => note.userId !== user.id || !note.read);
  saveState();
  renderNotifications();
});

notificationList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-notification-action]');
  if (!button) return;
  const user = getActiveUser();
  const note = state.notifications.find((entry) => entry.id === button.dataset.notificationId && entry.userId === user?.id);
  if (!note) return;
  if (button.dataset.notificationAction === 'read') note.read = true;
  if (button.dataset.notificationAction === 'delete') state.notifications = state.notifications.filter((entry) => entry.id !== note.id);
  saveState();
  renderNotifications();
});

function renderProfile() {
  const user = getActiveUser();
  if (!user) {
    profilePanel.innerHTML = '<div class="profile-card"><h3>Profile unavailable</h3><p>Please sign in to view your donor or requester profile.</p></div>';
    return;
  }

  const donorProfile = state.donors.find((donor) => donor.accountId === user.id) || null;
  const status = donorProfile ? donorProfile.status || (donorProfile.verified ? 'Approved' : 'Pending') : 'Not registered';
  const verification = donorProfile ? (donorProfile.verified ? 'Verified donor' : 'Pending verification') : 'Requester profile';

  profilePanel.innerHTML = `
    <div class="profile-head">
      <div class="avatar">${user.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div>
      <div>
        <h3>${user.name}</h3>
        <span class="tag">${user.role}</span>
      </div>
    </div>
    <div class="profile-meta">
      <div class="profile-meta-row"><span>Email</span><strong>${user.email}</strong></div>
      <div class="profile-meta-row"><span>Phone</span><strong>${user.phone}</strong></div>
      <div class="profile-meta-row"><span>Verification</span><strong>${verification}</strong></div>
      <div class="profile-meta-row"><span>Status</span><strong>${status}</strong></div>
      ${donorProfile ? `<div class="profile-meta-row"><span>Blood group</span><strong>${donorProfile.bloodGroup}</strong></div>` : ''}
      ${donorProfile ? `<div class="profile-meta-row"><span>Location</span><strong>${donorProfile.city}, ${donorProfile.area}</strong></div>` : ''}
    </div>
  `;
}

function renderAdminPanel() {
  if (!isAdmin()) {
    adminSettingsForm.hidden = true;
    adminQueue.innerHTML = '<div class="verification-item"><div><h4>Admin access required</h4><p>Sign in with the admin account to review donors, record successful donations, and issue certificates.</p></div></div>';
    adminTotalDonors.textContent = '—';
    adminVerifiedCount.textContent = '—';
    adminPendingCount.textContent = '—';
    adminActivitySummary.textContent = 'Admin sign-in required.';
    adminActivity.innerHTML = '<div class="activity-item">Admin sign-in required to view activity.</div>';
    return;
  }

  adminSettingsForm.hidden = false;

  const totalDonors = state.donors.length;
  const verifiedCount = state.donors.filter((donor) => donor.verified).length;
  const pendingCount = state.donors.filter((donor) => !donor.verified).length;

  adminTotalDonors.textContent = String(totalDonors);
  adminVerifiedCount.textContent = String(verifiedCount);
  adminPendingCount.textContent = String(pendingCount);
  const activityItems = state.activities.slice(0, 20);
  const loginCount = state.activities.filter((activity) => activity.type === 'Login').length;
  const registrationCount = state.activities.filter((activity) => activity.type === 'Registration').length;
  const requestCount = state.activities.filter((activity) => activity.type === 'Blood request').length;
  const responseCount = state.activities.filter((activity) => activity.type === 'Request response').length;
  adminActivitySummary.textContent = `${loginCount} logins • ${registrationCount} registrations • ${requestCount} requests • ${responseCount} responses • ${state.activities.length} total events`;
  adminActivity.innerHTML = activityItems.length ? activityItems.map((activity) => `
    <div class="activity-item"><strong>${activity.type}</strong><span>${activity.details}</span><time>${new Date(activity.createdAt).toLocaleString()}</time></div>
  `).join('') : '<div class="activity-item">No activity recorded yet.</div>';

  const pendingDonors = state.donors.filter((donor) => !donor.verified);

  adminQueue.innerHTML = (pendingDonors.length ? pendingDonors.map((donor) => `
    <div class="verification-item">
      <div>
        <h4>${donor.name}</h4>
        <p>${donor.city} • ${donor.bloodGroup} • ${donor.area}</p>
      </div>
      <div class="verification-actions">
        <button type="button" class="btn btn-primary" data-admin-action="approve" data-donor-id="${donor.id}">Approve</button>
        <button type="button" class="btn btn-secondary" data-admin-action="reject" data-donor-id="${donor.id}">Reject</button>
      </div>
    </div>
  `).join('') : '<div class="verification-item"><div><h4>All clear</h4><p>No donor applications are waiting for review.</p></div></div>') + state.donors.filter((donor) => donor.verified).map((donor) => `
    <div class="verification-item">
      <div>
        <h4>${donor.name}</h4>
        <p>${donor.city} • ${donor.bloodGroup} • Successful donations: ${donor.donationCount}</p>
      </div>
      <div class="verification-actions">
        <button type="button" class="btn btn-secondary" data-admin-action="record-donation" data-donor-id="${donor.id}">Record donation</button>
        ${donor.donationCount >= 3 ? `<button type="button" class="btn btn-primary" data-admin-action="issue-certificate" data-donor-id="${donor.id}">Issue certificate</button>` : '<span class="small-pill">3 donations required</span>'}
      </div>
    </div>
  `).join('');

  adminQueue.querySelectorAll('[data-admin-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const donor = state.donors.find((entry) => entry.id === button.dataset.donorId);
      if (!donor) return;

      const action = button.dataset.adminAction;
      if (!isAdmin()) return;
      if (action === 'approve') {
        donor.verified = true;
        donor.status = 'Approved';
        logActivity('Donor approval', `Donor verification approved in ${donor.city}`);
        notifyUser(donor.accountId || donor.id, 'Your donor verification has been approved. You are now visible to requesters in live matching.', 'success');
      }

      if (action === 'reject') {
        donor.verified = false;
        donor.status = 'Rejected';
        logActivity('Donor review', `Donor verification rejected in ${donor.city}`);
        notifyUser(donor.accountId || donor.id, 'Your donor verification is pending additional review. Please update your profile and try again.', 'warning');
      }

      if (action === 'record-donation') {
        donor.donationCount = (donor.donationCount || 0) + 1;
        logActivity('Donation completed', `Successful donation recorded for a ${donor.bloodGroup} donor`);
        notifyUser(donor.accountId || donor.id, `A successful donation was recorded by RAKTA admin. Total verified donations: ${donor.donationCount}.`, 'success');
      }

      if (action === 'issue-certificate') {
        if (donor.donationCount < 3) {
          alert('A certificate can only be issued after 3 successful donations.');
          return;
        }
        donor.certificateIssued = true;
        logActivity('Certificate issued', `Certificate issued after ${donor.donationCount} successful donations`);
        notifyUser(donor.accountId || donor.id, 'Your RAKTA recognition certificate has been issued by an administrator.', 'success');
        createPremiumCertificate(donor);
      }

      saveState();
      renderAdminPanel();
      renderSearchResults(searchDonors());
      renderProfile();
      renderStats();
    });
  });
}

function renderSearchResults(matches = searchDonors()) {
  if (!matches.length) {
    searchResults.innerHTML = '<div class="donor-card"><h3>No donors found</h3><p class="donor-meta">Try another blood group or city.</p></div>';
    return;
  }

  searchResults.innerHTML = matches.map((donor) => `
    <article class="donor-card">
      <header>
        <div>
          <h3>${donor.name}</h3>
          <div class="tag">${getAvailabilityLabel(donor.availability)}</div>
        </div>
        <span class="blood-tag">${donor.bloodGroup}</span>
      </header>

      <div class="donor-meta">
        <span>📍 ${donor.city}, ${donor.area}</span>
        <span>☎ ${donor.phone}</span>
        <span>♥ Donation count: ${donor.donationCount}</span>
      </div>

      <div class="card-actions">
        <button type="button" class="btn btn-secondary" data-donor-id="${donor.id}" data-action="message-donor">Contact donor</button>
      </div>
    </article>
  `).join('');

  searchResults.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const donorId = button.dataset.donorId;
      const donor = state.donors.find((entry) => entry.id === donorId);
      if (!donor) return;

      if (button.dataset.action === 'message-donor') {
        const currentUser = getActiveUser();
        const message = currentUser
          ? `A requester named ${currentUser.name} is reaching out to you for emergency support.`
          : 'A new user wants to contact you for urgent support.';
        notifyUser(donor.accountId || donor.id, message, 'info');
        if (currentUser) {
          notifyUser(currentUser.id, `Your request message has been sent to ${donor.name}.`, 'success');
        }
        alert(`Message sent to ${donor.name}.`);
      }

    });
  });
}

function renderRequests() {
  requestBoard.innerHTML = state.requests.map((request) => {
    const donorMatch = state.donors.find((donor) => donor.bloodGroup === request.bloodGroup && donor.city === request.city);
    return `
      <article class="emergency-card">
        <header>
          <div>
            <h3>${request.patient}</h3>
            <p>${request.city}</p>
          </div>
          <span class="badge">${request.urgency}</span>
        </header>

        <div class="card-head" style="margin-top: 12px;">
          <span class="blood-tag">${request.bloodGroup}</span>
          <span class="tag">${request.units} units</span>
        </div>

        <ul>
          <li><span>Hospital</span><strong>Community Care</strong></li>
          <li><span>Contact</span><strong>${request.phone}</strong></li>
          <li><span>Match</span><strong>${donorMatch ? donorMatch.name : 'Awaiting donor'}</strong></li>
        </ul>

        <div class="emergency-actions">
          <button type="button" class="btn btn-secondary" data-request-id="${request.id}" data-action="respond-request">Respond</button>
          <button type="button" class="btn btn-primary" data-request-id="${request.id}" data-action="mark-resolved">Mark resolved</button>
        </div>
      </article>
    `;
  }).join('');

  requestBoard.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const requestId = button.dataset.requestId;
      const request = state.requests.find((entry) => entry.id === requestId);
      if (!request) return;

      if (button.dataset.action === 'respond-request') {
        const currentUser = getActiveUser();
        if (!currentUser) {
          alert('Please sign in to respond to a blood request.');
          return;
        }
        notifyUser(currentUser.id, `You responded to the request for ${request.patient}. The requester has been notified.`, 'success');
        logActivity('Request response', `A donor response was recorded for a ${request.bloodGroup} request in ${request.city}`);
        if (request.phone) {
          notifyUser(currentUser.id, `A response was recorded for ${request.patient} in ${request.city}.`, 'info');
        }
        alert(`Response recorded for ${request.patient}.`);
      }

      if (button.dataset.action === 'mark-resolved') {
        request.urgency = 'Resolved';
        logActivity('Request resolved', `Blood request resolved in ${request.city}`);
        saveState();
        renderRequests();
        renderStats();
        const currentUser = getActiveUser();
        if (currentUser) {
          notifyUser(currentUser.id, `The request for ${request.patient} has been marked as resolved.`, 'success');
        }
      }
    });
  });
}

function searchDonors(bloodGroup = '', city = '') {
  return state.donors.filter((donor) => {
    const isVerified = donor.verified !== false;
    const matchesBlood = !bloodGroup || donor.bloodGroup === bloodGroup;
    const matchesCity = !city || donor.city === city;
    return isVerified && matchesBlood && matchesCity;
  });
}

function createPremiumCertificate(donor) {
  const issuedDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>RAKTA Certificate</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: Georgia, serif; background: linear-gradient(135deg, #fff7ed, #fdf2f8, #fef2f2); color: #1f2937; padding: 32px;
          }
          .certificate {
            width: min(1100px, 92vw); min-height: 760px; background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,249,245,0.96)); border: 16px solid #7f1d1d; border-radius: 32px; position: relative; padding: 52px 56px 32px; box-shadow: 0 24px 60px rgba(69, 10, 10, 0.18); overflow: hidden;
          }
          .certificate::before, .certificate::after { content: ''; position: absolute; inset: 18px; border: 2px solid rgba(180, 122, 31, 0.75); border-radius: 20px; pointer-events: none; }
          .certificate::after { inset: 30px; border-color: rgba(180, 122, 31, 0.35); }
          .badge { width: 120px; height: 120px; margin: 0 auto 12px; border-radius: 50%; display: grid; place-items: center; border: 3px solid rgba(180, 122, 31, 0.8); background: radial-gradient(circle at center, #fffaf0 0%, #fef3c7 58%, #fbbf24 100%); color: #7f1d1d; font-weight: 700; letter-spacing: 0.18em; box-shadow: inset 0 0 18px rgba(255,255,255,0.9), 0 8px 22px rgba(180,122,31,0.25); }
          .eyebrow { margin: 0; text-align: center; font-size: 14px; letter-spacing: 0.3em; text-transform: uppercase; color: #7f1d1d; }
          h1 { margin: 18px 0 10px; text-align: center; font-size: clamp(3rem, 4vw, 5rem); letter-spacing: 0.1em; color: #4c0519; text-transform: uppercase; }
          .subtitle { margin: 0; text-align: center; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.18em; color: #6b7280; }
          .recognition { margin: 28px 0 8px; text-align: center; font-size: 1.05rem; letter-spacing: 0.08em; color: #4b5563; }
          .name { margin: 0; text-align: center; font-size: clamp(2.3rem, 3vw, 3.8rem); color: #7f1d1d; text-transform: uppercase; }
          .statement { max-width: 760px; margin: 24px auto 0; text-align: center; font-size: 1.15rem; line-height: 1.8; color: #374151; }
          .statement strong { color: #7f1d1d; }
          .details { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; margin-top: 38px; }
          .detail { border-top: 2px solid rgba(180, 122, 31, 0.7); padding-top: 14px; text-align: center; }
          .detail span { display: block; margin-bottom: 8px; font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase; color: #7c6e63; }
          .detail strong { font-size: 1rem; color: #1f2937; }
          .footer-bar { margin-top: 46px; display: flex; justify-content: space-between; align-items: end; }
          .signature { flex: 1; max-width: 230px; text-align: center; border-top: 2px solid rgba(31, 41, 55, 0.8); padding-top: 10px; }
          .signature .line { display: block; margin-bottom: 8px; font-size: 1.1rem; font-weight: 700; color: #1f2937; }
          .signature small { font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase; color: #6b7280; }
          .seal { width: 120px; height: 120px; border-radius: 50%; border: 3px solid rgba(180,122,31,0.7); display: grid; place-items: center; color: #7f1d1d; font-size: 10px; font-weight: 700; text-transform: uppercase; text-align: center; letter-spacing: 0.14em; line-height: 1.6; }
          @media (max-width: 760px) { .details { grid-template-columns: 1fr; } .footer-bar { flex-direction: column; gap: 18px; align-items: center; } }
        </style>
      </head>
      <body>
        <main class="certificate">
          <div class="badge">RAKTA</div>
          <p class="eyebrow">Certificate of Appreciation</p>
          <h1>RAKTA</h1>
          <p class="subtitle">Life-Saving Contribution</p>
          <p class="recognition">This certificate recognizes</p>
          <h2 class="name">${donor.name}</h2>
          <p class="statement">for completing <strong>${donor.donationCount}</strong> verified blood donations and helping save lives with compassion, courage, and community care.</p>
          <div class="details">
            <div class="detail"><span>Certificate ID</span><strong>CERT-${donor.id.toUpperCase()}</strong></div>
            <div class="detail"><span>Donation Count</span><strong>${donor.donationCount}</strong></div>
            <div class="detail"><span>Issued</span><strong>${issuedDate}</strong></div>
          </div>
          <div class="footer-bar">
            <div class="signature"><span class="line">Dr. Aanya Verma</span><small>Medical Director</small></div>
            <div class="seal">Certified<br />Hero</div>
            <div class="signature"><span class="line">RAKTA Foundation</span><small>Community Care</small></div>
          </div>
        </main>
      </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'text/html' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = `${donor.name.replace(/\s+/g, '-')}-certificate.html`;
  link.click();
  URL.revokeObjectURL(url);
}

donorForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const donor = {
    id: `donor-${Date.now()}`,
    accountId: getActiveUser()?.id || null,
    name: document.getElementById('donorName').value.trim(),
    bloodGroup: document.getElementById('donorBloodGroup').value,
    city: document.getElementById('donorCity').value,
    area: document.getElementById('donorArea').value.trim(),
    availability: document.getElementById('donorAvailability').value,
    phone: document.getElementById('donorPhone').value.trim(),
    donationCount: 0,
    verified: false,
    status: 'Pending'
  };

  if (!donor.name || !donor.area || !donor.phone) {
    donorMessage.textContent = 'Please fill in all donor details.';
    return;
  }

  const existing = state.donors.find((entry) => entry.accountId === donor.accountId && entry.name.toLowerCase() === donor.name.toLowerCase());
  if (existing) {
    donorMessage.textContent = 'You already submitted a donor profile for review.';
    return;
  }

  state.donors.unshift(donor);
  logActivity('Donor profile', `New donor profile submitted in ${donor.city}`);
  saveState();
  donorForm.reset();
  donorMessage.textContent = 'Donor profile submitted for verification.';
  if (donor.accountId) {
    notifyUser(donor.accountId, 'Your donor profile has been submitted for verification and is awaiting admin approval.', 'success');
  }
  renderSearchResults(searchDonors());
  renderProfile();
  renderAdminPanel();
  renderStats();
});

requestForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const request = {
    id: `req-${Date.now()}`,
    patient: document.getElementById('requestPatient').value.trim(),
    bloodGroup: document.getElementById('requestBloodGroup').value,
    city: document.getElementById('requestCity').value,
    units: Number(document.getElementById('requestUnits').value || 1),
    urgency: document.getElementById('requestUrgency').value,
    phone: document.getElementById('requestPhone').value.trim(),
    requesterId: getActiveUser()?.id || null,
    status: 'Open'
  };

  if (!request.patient || !request.phone) {
    requestMessage.textContent = 'Please enter patient and contact details.';
    return;
  }

  state.requests.unshift(request);
  logActivity('Blood request', `${request.urgency} ${request.bloodGroup} request posted in ${request.city}`);
  saveState();
  requestForm.reset();
  requestMessage.textContent = 'Blood request submitted successfully.';
  const currentUser = getActiveUser();
  if (currentUser) {
    notifyUser(currentUser.id, `Your ${request.bloodGroup} request for ${request.city} has been posted successfully.`, 'success');
  }

  const nearbyDonors = state.donors.filter((donor) => donor.city === request.city && donor.bloodGroup === request.bloodGroup);
  nearbyDonors.forEach((donor) => {
    notifyUser(donor.accountId || donor.id, `A new ${request.bloodGroup} blood request was posted in ${request.city}. Please review the request board.`, 'warning');
  });

  renderRequests();
  renderStats();
});

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const bloodGroup = document.getElementById('searchBloodGroup').value;
  const city = document.getElementById('searchCity').value;
  renderSearchResults(searchDonors(bloodGroup, city));
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value.trim();
  const account = state.accounts.find((entry) => entry.email.toLowerCase() === email && entry.password === password);

  if (!account) {
    loginMessage.textContent = 'Invalid email or password. Try donor@rakta.com / rakta123';
    return;
  }

  state.activeUserId = account.id;
  logActivity('Login', `A ${account.role} account signed in`);
  saveState();
  loginMessage.textContent = `Welcome back, ${account.name}.`;
  loginForm.reset();
  renderNotifications();
});

registerAccountForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('accountName').value.trim();
  const email = document.getElementById('accountEmail').value.trim().toLowerCase();
  const password = document.getElementById('accountPassword').value.trim();
  const role = document.getElementById('accountRole').value;

  if (!name || !email || !password) {
    registerAccountMessage.textContent = 'Please provide all account details.';
    return;
  }

  const existing = state.accounts.find((account) => account.email.toLowerCase() === email);
  if (existing) {
    registerAccountMessage.textContent = 'An account with this email already exists.';
    return;
  }

  const newAccount = { id: `acc-${Date.now()}`, name, email, password, role, phone: '+91 90000 12345' };
  state.accounts.unshift(newAccount);
  state.activeUserId = newAccount.id;
  logActivity('Registration', `New ${role} account registered`);
  saveState();
  registerAccountForm.reset();
  registerAccountMessage.textContent = `${name}, your ${role} account is ready.`;
  notifyUser(newAccount.id, `Welcome to RAKTA! Your ${role} account has been created and notifications are active.`, 'success');
  renderNotifications();
});

logoutButton.addEventListener('click', () => {
  state.activeUserId = null;
  saveState();
  renderNotifications();
});

adminSettingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!isAdmin()) return;
  state.settings.announcement = document.getElementById('siteAnnouncement').value.trim() || state.settings.announcement;
  state.settings.status = document.getElementById('siteStatus').value;
  state.settings.donorDirectory = donorDirectoryStatus.value;
  state.settings.requestBoard = requestBoardStatus.value;
  heroAnnouncement.textContent = state.settings.announcement;
  heroStatus.innerHTML = `<i></i>${state.settings.status}`;
  logActivity('Website settings', `Network ${state.settings.status}; donor directory ${state.settings.donorDirectory}; request board ${state.settings.requestBoard}`);
  adminSettingsMessage.textContent = 'Website settings saved for this browser.';
  applySiteSettings();
});

notificationBell.addEventListener('click', () => {
  window.location.hash = 'page-account';
});

document.querySelectorAll('.auth-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    const loginField = document.getElementById('loginForm');
    const registerField = document.getElementById('registerAccountForm');
    const isLogin = target === 'login';

    authTabs.forEach((item) => item.classList.toggle('active', item === tab));
    loginField.classList.toggle('hidden', !isLogin);
    registerField.classList.toggle('hidden', isLogin);
  });
});

const routeSections = document.querySelectorAll('[data-route]');
const routeToolbar = document.querySelector('.route-toolbar');
const routeTitle = document.getElementById('routeTitle');
const routeNames = {
  'page-search': 'Find a donor',
  'page-register': 'Become a donor',
  'page-login': 'Login',
  'page-account': 'Account dashboard',
  'page-profile': 'Donor profile',
  'page-request': 'Request blood',
  'page-emergency': 'Emergency support',
  'page-admin': 'Admin control center',
  'page-architecture': 'Platform architecture'
};

function renderRoute() {
  const rawRoute = window.location.hash.slice(1);
  const legacyRoutes = { search: 'page-search', register: 'page-register', account: 'page-account', request: 'page-request', emergency: 'page-emergency', admin: 'page-admin' };
  const route = legacyRoutes[rawRoute] || rawRoute;
  const isHome = !route || route === 'home';
  document.querySelectorAll('main > section').forEach((section) => {
    section.hidden = !isHome && section.dataset.route !== (route === 'page-login' || route === 'page-register' ? 'page-account' : route);
  });
  document.querySelector('.hero').hidden = !isHome;
  document.querySelector('.quick-grid')?.closest('.section').toggleAttribute('hidden', !isHome);
  routeToolbar.hidden = isHome;
  if (!isHome) {
    routeTitle.textContent = routeNames[route] || 'RAKTA workspace';
    if (route === 'page-login' || route === 'page-register') {
      const targetTab = document.querySelector(`.auth-tab[data-tab="${route === 'page-login' ? 'login' : 'register'}"]`);
      targetTab?.click();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

document.getElementById('backButton').addEventListener('click', () => {
  window.location.hash = 'home';
});
window.addEventListener('hashchange', renderRoute);

let previousScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  const topbar = document.querySelector('.topbar');
  const currentScrollY = window.scrollY;

  if (currentScrollY <= 80) {
    topbar.classList.remove('header-hidden');
  } else if (currentScrollY > previousScrollY && currentScrollY > 120) {
    topbar.classList.add('header-hidden');
  } else if (currentScrollY < previousScrollY) {
    topbar.classList.remove('header-hidden');
  }

  previousScrollY = currentScrollY;
}, { passive: true });

document.addEventListener('pointerdown', (event) => {
  const ripple = document.createElement('span');
  ripple.className = 'click-ripple';
  ripple.style.left = `${event.clientX}px`;
  ripple.style.top = `${event.clientY}px`;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 1100);
});

populateCitySelectors();
document.getElementById('siteAnnouncement').value = state.settings.announcement;
document.getElementById('siteStatus').value = state.settings.status;
donorDirectoryStatus.value = state.settings.donorDirectory || 'Visible';
requestBoardStatus.value = state.settings.requestBoard || 'Open';
heroAnnouncement.textContent = state.settings.announcement;
heroStatus.innerHTML = `<i></i>${state.settings.status}`;
applySiteSettings();
renderRoute();
renderSearchResults();
renderRequests();
renderStats();
renderProfile();
renderAdminPanel();
renderNotifications();
applySiteSettings();
