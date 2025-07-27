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
// ... (previous JS code) ...

// URL Analysis
async function analyzeURL() {
    const urlInput = document.getElementById('urlInput');
    const checkBtn = document.getElementById('checkBtn');
    const checkBtnText = document.getElementById('checkBtnText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultsSection = document.getElementById('resultsSection');
    
    const url = urlInput.value.trim();
    if (!url) return;

    // Show loading state
    checkBtn.disabled = true;
    checkBtnText.textContent = 'Checking...';
    loadingSpinner.classList.remove('hidden');

    // Simulate analysis delay
    setTimeout(() => {
        const analysis = performPhishingAnalysis(url); // Call the new analysis function
        // displayResults(analysis); // Will be implemented later
        // addToHistory(analysis); // Will be implemented later
        
        console.log("Analysis Result:", analysis); // Log for now
        
        // Reset button state
        checkBtn.disabled = false;
        checkBtnText.textContent = 'Check';
        loadingSpinner.classList.add('hidden');
        
        // Show results
        resultsSection.classList.remove('hidden');
    }, 1500);
}

// Phishing detection logic
function performPhishingAnalysis(url) {
    const indicators = [];
    let riskScore = 0;

    try {
        const normalizedUrl = url.toLowerCase().trim();
        const urlObj = new URL(normalizedUrl.startsWith('http') ? normalizedUrl : `https://${normalizedUrl}`);

        // Check various indicators (only one for now)
        const checks = [
            checkSuspiciousDomain(urlObj.hostname) // Only one check for now
        ];

        checks.forEach(indicator => {
            indicators.push(indicator);
            if (indicator.found) {
                riskScore += indicator.severity === 'high' ? 3 : indicator.severity === 'medium' ? 2 : 1;
            }
        });

        const riskLevel = riskScore >= 8 ? 'high' : riskScore >= 4 ? 'medium' : 'low';
        // const summary = generateSummary(riskLevel, riskScore, indicators); // Will be implemented later
        // const recommendations = generateRecommendations(riskLevel); // Will be implemented later

        return {
            url,
            riskLevel,
            riskScore,
            indicators,
            summary: `Risk level: ${riskLevel}, Score: ${riskScore}`, // Dummy summary for now
            recommendations: [] // Dummy recommendations
        };

    } catch (error) {
        return {
            url,
            riskLevel: 'high',
            riskScore: 10,
            indicators: [{
                type: 'Invalid URL',
                severity: 'high',
                description: 'The provided URL is malformed or invalid',
                found: true
            }],
            summary: 'Invalid URL detected - this could be a sign of a malicious link',
            recommendations: ['Do not visit this URL', 'Verify the link source', 'Report suspicious content']
        };
    }
}

// Individual check functions (Only one for now)
function checkSuspiciousDomain(hostname) {
    const suspiciousPatterns = [
        /paypal|amazon|google|microsoft|apple|facebook|instagram|twitter/,
        /bank|secure|verify|update|confirm|suspend/,
        /login|signin|account|billing|payment/
    ];
    
    const commonDomains = [
        'paypal.com', 'amazon.com', 'google.com', 'microsoft.com', 
        'apple.com', 'facebook.com', 'instagram.com', 'twitter.com'
    ];

    const isExactMatch = commonDomains.includes(hostname);
    const hasSuspiciousPattern = suspiciousPatterns.some(pattern => pattern.test(hostname)) && !isExactMatch;

    return {
        type: 'Domain Impersonation',
        severity: 'high',
        description: 'Domain appears to impersonate a legitimate service',
        found: hasSuspiciousPattern
    };
}
