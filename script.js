// Global variables
let scanHistory = [];
let currentTheme = 'dark'; // Initial theme, will be overridden by localStorage or system preference

// Initialize the application
function init() {
    loadTheme();
    // Other init functions will go here later
}

// Theme functions
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme();
    saveTheme();
}

function applyTheme() {
    document.body.className = currentTheme + '-theme';
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    
    if (currentTheme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
}

function saveTheme() {
    localStorage.setItem('theme', currentTheme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
    } else {
        // Check system preference if no theme is saved
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
// ... (previous JS code) ...

// Initialize the application
function init() {
    loadTheme();
    // Add enter key listener to input
    document.getElementById('urlInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            analyzeURL();
        }
    });
    // Other init functions will go here later
}

// ... (Theme functions) ...

// URL Analysis
async function analyzeURL() { // async is not strictly needed for setTimeout but good practice for future API calls
    const urlInput = document.getElementById('urlInput');
    const checkBtn = document.getElementById('checkBtn');
    const checkBtnText = document.getElementById('checkBtnText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultsSection = document.getElementById('resultsSection'); // Added for later showing results

    const url = urlInput.value.trim();
    if (!url) return; // Prevent analysis of empty URLs

    // Show loading state
    checkBtn.disabled = true;
    checkBtnText.textContent = 'Checking...';
    loadingSpinner.classList.remove('hidden');

    // Simulate analysis delay
    setTimeout(() => {
        // Placeholder for actual analysis and display results
        console.log(`Analyzing URL: ${url}`);
        // For now, just reset the state
        
        // Reset button state
        checkBtn.disabled = false;
        checkBtnText.textContent = 'Check';
        loadingSpinner.classList.add('hidden');
        
        // Show results section (will be populated later)
        resultsSection.classList.remove('hidden'); // Ensure results section is visible
    }, 1500); // 1.5 second delay
}
// ... (rest of JS code) ...