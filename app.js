// Supabase Configuration
// Appwrite Configuration
const APPWRITE_PROJECT_ID = '6964de76000ced6216b4';
const APPWRITE_ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const APPWRITE_DB_ID = 'ihwc_db'; // You must create this Database in Appwrite
const APPWRITE_COLLECTION_ID = 'certificates'; // You must create this Collection in Appwrite

// Admin password - Change this in production!
const ADMIN_PASSWORD = "IHWCF0928cbbee#";
let isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';

// Global state
let allCertificates = [];
let isLoading = false;

// ========== ERROR HANDLING UTILITIES ==========

class AppError extends Error {
  constructor(message, type = 'error', details = null) {
    super(message);
    this.type = type;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

function logError(error, context = '') {
  console.error(`[${new Date().toISOString()}] Error in ${context}:`, error);
  if (error.details) {
    console.error('Error details:', error.details);
  }
}

function validateCertificateNumber(certNo) {
  if (!certNo || typeof certNo !== 'string') {
    throw new AppError('Certificate number is required', 'validation');
  }

  const trimmed = certNo.trim();
  if (trimmed.length < 5) {
    throw new AppError('Certificate number must be at least 5 characters', 'validation');
  }

  if (trimmed.length > 50) {
    throw new AppError('Certificate number is too long (max 50 characters)', 'validation');
  }

  // Allow alphanumeric, hyphens, and forward slashes
  if (!/^[A-Z0-9\-\/]+$/i.test(trimmed)) {
    throw new AppError('Certificate number can only contain letters, numbers, hyphens, and slashes', 'validation');
  }

  return trimmed.toUpperCase();
}

function validateFormData(data) {
  const errors = [];

  if (!data.cert_number || data.cert_number.trim().length < 5) {
    errors.push('Certificate number is required (min 5 characters)');
  }

  if (!data.student_name || data.student_name.trim().length < 2) {
    errors.push('Student name is required (min 2 characters)');
  }

  if (data.student_name && data.student_name.length > 100) {
    errors.push('Student name is too long (max 100 characters)');
  }

  if (!data.course || data.course.trim().length < 3) {
    errors.push('Course name is required (min 3 characters)');
  }

  if (data.course && data.course.length > 200) {
    errors.push('Course name is too long (max 200 characters)');
  }

  if (!data.duration) {
    errors.push('Duration is required');
  }

  if (!data.institution || data.institution.trim().length < 3) {
    errors.push('Institution name is required (min 3 characters)');
  }

  if (data.institution && data.institution.length > 200) {
    errors.push('Institution name is too long (max 200 characters)');
  }

  if (!data.issue_date) {
    errors.push('Issue date is required');
  } else {
    const issueDate = new Date(data.issue_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (issueDate > today) {
      errors.push('Issue date cannot be in the future');
    }

    const minDate = new Date('1900-01-01');
    if (issueDate < minDate) {
      errors.push('Issue date is too far in the past');
    }
  }

  if (errors.length > 0) {
    throw new AppError(errors.join('\n'), 'validation', errors);
  }

  return true;
}

// Initialize Appwrite client with error handling
let client, databases;
try {
  if (!window.Appwrite) {
    throw new AppError('Appwrite library not loaded. Please check your internet connection.', 'initialization');
  }

  client = new window.Appwrite.Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

  databases = new window.Appwrite.Databases(client);
  console.log('✓ Appwrite initialized');

} catch (error) {
  logError(error, 'Appwrite Initialization');
  showGlobalError('Failed to initialize database connection. Please refresh the page.');
}

function showGlobalError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #fee;
    border: 2px solid #c00;
    color: #c00;
    padding: 1rem;
    border-radius: 8px;
    max-width: 400px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease-out;
  `;
  errorDiv.innerHTML = `<strong>⚠️ Error</strong><br>${message}`;
  document.body.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => errorDiv.remove(), 300);
  }, 5000);
}

// ========== LOADING STATES ==========

function showLoading(elementId, message = 'Loading...') {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `
      <div style="text-align:center; padding: 2rem; color: var(--primary-green);">
        <div class="spinner"></div>
        <p style="margin-top: 1rem;">${message}</p>
      </div>
    `;
  }
}

function setButtonLoading(button, isLoading, originalText = '') {
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = '<span class="spinner-small"></span> Loading...';
    button.style.opacity = '0.7';
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || originalText;
    button.style.opacity = '1';
  }
}

// Add spinner CSS dynamically
const spinnerStyles = document.createElement('style');
spinnerStyles.textContent = `
  .spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto;
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--primary-green);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .spinner-small {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid #fff;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(spinnerStyles);

// ========== IMAGE SLIDER ==========
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const sliderWrapper = document.getElementById('sliderWrapper');
const dotsContainer = document.getElementById('sliderDots');

try {
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
} catch (error) {
  logError(error, 'Slider Initialization');
}

function updateSlider() {
  try {
    sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelectorAll('.dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  } catch (error) {
    logError(error, 'Slider Update');
  }
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlider();
}

function goToSlide(index) {
  if (index >= 0 && index < totalSlides) {
    currentSlide = index;
    updateSlider();
  }
}

setInterval(nextSlide, 5000);

// ========== ROUTING ==========
function showPage(pageId) {
  try {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(pageId);
    if (page) {
      page.classList.add('active');
      window.scrollTo(0, 0);
    } else {
      throw new AppError(`Page not found: ${pageId}`, 'routing');
    }
  } catch (error) {
    logError(error, 'Page Navigation');
    showGlobalError('Navigation error. Please refresh the page.');
  }
}

function handleNavigation() {
  try {
    let hash = window.location.hash.slice(1).toLowerCase() || 'home';

    if (hash === 'adminlogin' || hash === 'adminpage' || hash === 'admin') {
      if (isAdminLoggedIn) {
        showPage('adminDashboardPage');
        loadDashboard();
      } else {
        showPage('adminLoginPage');
      }
    } else if (hash === 'home' || hash === 'verify' || hash === 'about') {
      showPage('homePage');
      if (hash === 'verify' || hash === 'about') {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      showPage('homePage');
    }
  } catch (error) {
    logError(error, 'Navigation Handler');
    showPage('homePage');
  }
}

window.addEventListener('hashchange', handleNavigation);
window.addEventListener('load', handleNavigation);

// Mobile menu toggle
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });

  document.querySelectorAll('nav a[href^="#"]').forEach(a => {
    a.addEventListener("click", () => {
      mainNav.classList.remove("open");
    });
  });
}

// ========== ADMIN LOGIN ==========
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const passwordInput = document.getElementById('adminPassword');
    const password = passwordInput.value;
    const alert = document.getElementById('loginAlert');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    try {
      if (!password) {
        throw new AppError('Please enter a password', 'validation');
      }

      setButtonLoading(submitBtn, true);

      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));

      if (password === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        sessionStorage.setItem('adminLoggedIn', 'true');
        window.location.hash = 'adminpage';
      } else {
        throw new AppError('Invalid password. Please try again.', 'authentication');
      }
    } catch (error) {
      logError(error, 'Admin Login');
      alert.textContent = error.message;
      alert.style.display = 'block';
      setTimeout(() => { alert.style.display = 'none'; }, 4000);
    } finally {
      setButtonLoading(submitBtn, false);
      passwordInput.value = '';
    }
  });
}

const logoutBtn = document.getElementById('btnLogout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    try {
      isAdminLoggedIn = false;
      sessionStorage.removeItem('adminLoggedIn');
      allCertificates = [];
      window.location.hash = 'home';
    } catch (error) {
      logError(error, 'Logout');
      showGlobalError('Logout failed. Please refresh the page.');
    }
  });
}

// ========== VERIFICATION MODAL ==========
const modal = document.getElementById("verifyModal");
const modalHeader = document.getElementById("modalHeader");
const modalIcon = document.getElementById("modalIcon");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

function openModalVerified(certNo, data) {
  try {
    modalIcon.className = "fas fa-check-circle";
    modalHeader.style.background = "linear-gradient(135deg, var(--primary-green) 0%, var(--primary-dark) 100%)";
    modalTitle.textContent = "✓ Certificate Verified";

    const formatDate = (dateStr) => {
      try {
        return new Date(dateStr).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return dateStr;
      }
    };

    modalBody.innerHTML = `
      <div class="info-grid">
        <div class="info-row">
          <div class="info-label"><i class="fas fa-certificate"></i> Number</div>
          <div class="info-value"><strong>${escapeHtml(certNo)}</strong></div>
        </div>
        <div class="info-row">
          <div class="info-label"><i class="fas fa-user"></i> Student</div>
          <div class="info-value">${escapeHtml(data.student_name)}</div>
        </div>
        <div class="info-row">
          <div class="info-label"><i class="fas fa-book"></i> Course</div>
          <div class="info-value">${escapeHtml(data.course)}</div>
        </div>
        <div class="info-row">
          <div class="info-label"><i class="fas fa-clock"></i> Duration</div>
          <div class="info-value">${escapeHtml(data.duration)}</div>
        </div>
        <div class="info-row">
          <div class="info-label"><i class="fas fa-building"></i> Institution</div>
          <div class="info-value">${escapeHtml(data.institution)}</div>
        </div>
        <div class="info-row">
          <div class="info-label"><i class="fas fa-calendar"></i> Issue Date</div>
          <div class="info-value">${formatDate(data.issue_date)}</div>
        </div>
      </div>
      <button class="btn-close" id="closeModalBtn">Close</button>
    `;
    modal.classList.add("open");

    const closeBtn = document.getElementById("closeModalBtn");
    if (closeBtn) {
      closeBtn.onclick = closeModal;
    }
  } catch (error) {
    logError(error, 'Open Modal Verified');
    openModalError('Error displaying certificate details');
  }
}

function openModalError(message = "The certificate number you entered could not be found in IHWC records. Please verify the number and try again.") {
  try {
    modalIcon.className = "fas fa-exclamation-triangle";
    modalHeader.style.background = "#c53030";
    modalTitle.textContent = "⚠ Verification Failed";
    modalBody.innerHTML = `
      <div class="modal-error">
        ${escapeHtml(message)}
      </div>
      <button class="btn-close" id="closeModalBtn">Close</button>
    `;
    modal.classList.add("open");

    const closeBtn = document.getElementById("closeModalBtn");
    if (closeBtn) {
      closeBtn.onclick = closeModal;
    }
  } catch (error) {
    logError(error, 'Open Modal Error');
  }
}

function closeModal() {
  if (modal) {
    modal.classList.remove("open");
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

const verifyForm = document.getElementById("verifyForm");
if (verifyForm) {
  verifyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const input = document.getElementById("certInput");
    const submitBtn = e.target.querySelector('button[type="submit"]');

    try {
      const certNo = validateCertificateNumber(input.value);

      setButtonLoading(submitBtn, true);

      if (!databases) {
        throw new AppError('Database connection not available. Please refresh the page.', 'connection');
      }

      const response = await databases.listDocuments(
        APPWRITE_DB_ID,
        APPWRITE_COLLECTION_ID,
        [
          window.Appwrite.Query.equal('cert_number', certNo)
        ]
      );

      if (response.total === 0) {
        openModalError(`Certificate "${certNo}" not found in our records. Please check the certificate number and try again.`);
      } else {
        openModalVerified(certNo, response.documents[0]);
      }
    } catch (error) {
      logError(error, 'Certificate Verification');

      if (error.type === 'validation') {
        openModalError(error.message);
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        openModalError('Network error. Please check your internet connection and try again.');
      } else {
        openModalError('An error occurred while verifying the certificate. Please try again later.');
      }
    } finally {
      setButtonLoading(submitBtn, false);
      input.value = "";
    }
  });
}

// ========== ADMIN DASHBOARD ==========

async function loadDashboard() {
  try {
    await fetchCertificates();
  } catch (error) {
    logError(error, 'Load Dashboard');
    showGlobalError('Failed to load dashboard data');
  }
}

async function fetchCertificates() {
  const wrapper = document.getElementById("tableWrapper");

  if (!wrapper) return;

  showLoading('tableWrapper', 'Loading certificates...');

  try {
    if (!databases) {
      throw new AppError('Database connection not available', 'connection');
    }

    const response = await databases.listDocuments(
      APPWRITE_DB_ID,
      APPWRITE_COLLECTION_ID,
      [
        window.Appwrite.Query.orderDesc('$createdAt')
      ]
    );

    allCertificates = response.documents || [];
    updateStats();
    renderTable(allCertificates);

  } catch (error) {
    logError(error, 'Fetch Certificates');
    allCertificates = [];
    updateStats();

    let errorMessage = 'Error loading certificates. ';

    if (error.message.includes('JWT') || error.message.includes('api')) {
      errorMessage += 'Please check your Supabase configuration in app.js.';
    } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      errorMessage += 'Please check your internet connection.';
    } else {
      errorMessage += 'Please try refreshing the page.';
    }

    wrapper.innerHTML = `
      <div style="text-align:center; padding: 2rem; color: #c53030;">
        <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <p><strong>Failed to Load Certificates</strong></p>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">${errorMessage}</p>
        <button onclick="fetchCertificates()" style="margin-top: 1rem; padding: 0.5rem 1rem; border-radius: 8px; border: none; background: var(--primary-green); color: white; cursor: pointer;">
          <i class="fas fa-sync-alt"></i> Retry
        </button>
      </div>
    `;
  }
}

function updateStats() {
  try {
    document.getElementById("statTotalCerts").textContent = allCertificates.length;
    document.getElementById("statTotalStudents").textContent = allCertificates.length;

    const institutions = new Set(allCertificates.map(c => c.institution));
    document.getElementById("statInstitutions").textContent = institutions.size;

    const thisMonth = allCertificates.filter(c => {
      try {
        const date = new Date(c.issue_date);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      } catch {
        return false;
      }
    }).length;
    document.getElementById("statThisMonth").textContent = thisMonth;
  } catch (error) {
    logError(error, 'Update Stats');
  }
}

function renderTable(data) {
  const wrapper = document.getElementById("tableWrapper");
  if (!wrapper) return;

  try {
    if (!data || data.length === 0) {
      wrapper.innerHTML = `
        <div style="text-align:center; padding: 2rem; color: #666;">
          <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
          <p><strong>No certificates found</strong></p>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">Add your first certificate using the form above.</p>
        </div>
      `;
      return;
    }

    let html = `
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>Certificate No</th>
              <th>Student</th>
              <th>Course</th>
              <th>Duration</th>
              <th>Institution</th>
              <th>Issue Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
    `;

    data.forEach(c => {
      const formatDate = (dateStr) => {
        try {
          return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        } catch {
          return dateStr;
        }
      };

      html += `
        <tr>
          <td><strong>${escapeHtml(c.cert_number)}</strong></td>
          <td>${escapeHtml(c.student_name)}</td>
          <td>${escapeHtml(c.course)}</td>
          <td>${escapeHtml(c.duration)}</td>
          <td>${escapeHtml(c.institution)}</td>
          <td>${formatDate(c.issue_date)}</td>
          <td style="white-space: nowrap;">
            <button class="btn-table btn-edit" onclick="startEditCert('${escapeHtml(c.cert_number).replace(/'/g, "\\'")}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-table btn-del" onclick="deleteCert('${escapeHtml(c.cert_number).replace(/'/g, "\\'")}')">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;
    wrapper.innerHTML = html;
  } catch (error) {
    logError(error, 'Render Table');
    wrapper.innerHTML = '<p style="color: #c53030; padding: 1rem;">Error rendering table</p>';
  }
}

async function startEditCert(certNo) {
  try {
    const cert = allCertificates.find(c => c.cert_number === certNo);
    if (!cert) {
      throw new AppError('Certificate not found', 'validation');
    }

    document.getElementById("editMode").value = "true";
    document.getElementById("editId").value = certNo;
    document.getElementById("formTitle").innerHTML = '<i class="fas fa-pen"></i> Edit Certificate';
    document.getElementById("btnSubmitForm").innerHTML = '<i class="fas fa-save"></i> Update Certificate';
    document.getElementById("certNumber").value = certNo;
    document.getElementById("certNumber").disabled = true;
    document.getElementById("studentName").value = cert.student_name;
    document.getElementById("courseName").value = cert.course;
    document.getElementById("duration").value = cert.duration;
    document.getElementById("institutionName").value = cert.institution;
    document.getElementById("issueDate").value = cert.issue_date;

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    logError(error, 'Start Edit Certificate');
    showFormAlert(error.message, "error");
  }
}

async function deleteCert(certNo) {
  if (!confirm(`Are you sure you want to delete certificate "${certNo}"?\n\nThis action cannot be undone.`)) {
    return;
  }

  try {
    if (!databases) {
      throw new AppError('Database connection not available', 'connection');
    }

    // First find the document ID
    const cert = allCertificates.find(c => c.cert_number === certNo);
    if (!cert || !cert.$id) {
      throw new AppError('Certificate document ID not found', 'database');
    }

    await databases.deleteDocument(
      APPWRITE_DB_ID,
      APPWRITE_COLLECTION_ID,
      cert.$id
    );

    showFormAlert(`Certificate "${certNo}" deleted successfully.`, "success");
    await fetchCertificates();

  } catch (error) {
    logError(error, 'Delete Certificate');

    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      showFormAlert("Network error. Please check your connection and try again.", "error");
    } else {
      showFormAlert(error.message || "Failed to delete certificate. Please try again.", "error");
    }
  }
}

const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    try {
      const term = e.target.value.toLowerCase().trim();

      if (!term) {
        renderTable(allCertificates);
        return;
      }

      const filtered = allCertificates.filter(c =>
        c.cert_number.toLowerCase().includes(term) ||
        c.student_name.toLowerCase().includes(term) ||
        c.course.toLowerCase().includes(term) ||
        c.institution.toLowerCase().includes(term)
      );

      renderTable(filtered);
    } catch (error) {
      logError(error, 'Search Certificates');
    }
  });
}

const formAlert = document.getElementById("formAlert");

function showFormAlert(msg, type) {
  if (!formAlert) return;

  try {
    formAlert.textContent = msg;
    formAlert.className = "alert " + (type === "error" ? "alert-error" : "alert-success");
    formAlert.style.display = "block";

    setTimeout(() => {
      formAlert.style.display = "none";
    }, type === "error" ? 5000 : 3000);
  } catch (error) {
    logError(error, 'Show Form Alert');
  }
}

const certForm = document.getElementById("certForm");
if (certForm) {
  certForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById("btnSubmitForm");
    const editMode = document.getElementById("editMode").value === "true";

    try {
      const certNumber = document.getElementById("certNumber").value.trim().toUpperCase();

      const payload = {
        cert_number: certNumber,
        student_name: document.getElementById("studentName").value.trim(),
        course: document.getElementById("courseName").value.trim(),
        duration: document.getElementById("duration").value,
        institution: document.getElementById("institutionName").value.trim(),
        issue_date: document.getElementById("issueDate").value
      };

      // Validate form data
      validateFormData(payload);

      if (!databases) {
        throw new AppError('Database connection not available', 'connection');
      }

      setButtonLoading(submitBtn, true);

      if (editMode) {
        // Find existing doc ID logic
        const editCertNumber = document.getElementById("editId").value; // This is the cert number from the form
        const existingCert = allCertificates.find(c => c.cert_number === editCertNumber);

        if (!existingCert || !existingCert.$id) {
          throw new AppError('Could not find original certificate to update', 'validation');
        }

        await databases.updateDocument(
          APPWRITE_DB_ID,
          APPWRITE_COLLECTION_ID,
          existingCert.$id,
          payload
        );

        showFormAlert("✓ Certificate updated successfully!", "success");
      } else {
        // Check for duplicates first (Appwrite doesn't have unique index enforcement by default on attributes easily accessible)
        const check = await databases.listDocuments(APPWRITE_DB_ID, APPWRITE_COLLECTION_ID, [
          window.Appwrite.Query.equal('cert_number', certNumber)
        ]);

        if (check.total > 0) {
          throw new AppError(`Certificate number "${certNumber}" already exists.`, 'validation');
        }

        await databases.createDocument(
          APPWRITE_DB_ID,
          APPWRITE_COLLECTION_ID,
          window.Appwrite.ID.unique(),
          payload
        );

        showFormAlert("✓ Certificate added successfully!", "success");
      }

      resetForm();
      await fetchCertificates();

    } catch (error) {
      logError(error, 'Submit Certificate Form');

      if (error.type === 'validation') {
        showFormAlert(error.message, "error");
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        showFormAlert("Network error. Please check your connection and try again.", "error");
      } else {
        showFormAlert(error.message || "An error occurred. Please try again.", "error");
      }
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });
}

function resetForm() {
  try {
    const form = document.getElementById("certForm");
    if (form) form.reset();

    document.getElementById("editMode").value = "false";
    document.getElementById("editId").value = "";
    document.getElementById("certNumber").disabled = false;
    document.getElementById("formTitle").innerHTML = '<i class="fas fa-plus-circle"></i> Add New Certificate';
    document.getElementById("btnSubmitForm").innerHTML = '<i class="fas fa-save"></i> Save Certificate';

    if (formAlert) formAlert.style.display = "none";

    const today = new Date().toISOString().slice(0, 10);
    document.getElementById("issueDate").value = today;
  } catch (error) {
    logError(error, 'Reset Form');
  }
}

const btnClearForm = document.getElementById("btnClearForm");
if (btnClearForm) {
  btnClearForm.addEventListener("click", resetForm);
}

// ========== INITIALIZATION ==========
(function init() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const issueDateInput = document.getElementById("issueDate");
    if (issueDateInput) {
      issueDateInput.value = today;
      issueDateInput.max = today; // Prevent future dates
    }

    updateSlider();

    console.log('✓ IHWC Certificate System initialized successfully');
    console.log('ℹ️ Admin password:', ADMIN_PASSWORD);

    if (APPWRITE_DB_ID === 'YOUR_DB_ID' || APPWRITE_COLLECTION_ID === 'YOUR_COLLECTION_ID') {
      console.warn('⚠️ WARNING: Appwrite DB/Collection IDs are not set!');
      console.warn('Please create a Database and Collection in your Appwrite console and update the IDs in app.js');
    }
  } catch (error) {
    logError(error, 'Initialization');
  }
})();

// Global error handler
window.addEventListener('error', (event) => {
  logError(event.error, 'Global Error Handler');
  console.error('Uncaught error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  logError(event.reason, 'Unhandled Promise Rejection');
  console.error('Unhandled promise rejection:', event.reason);
});
