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
// ... (previous JS code including performPhishingAnalysis and checkSuspiciousDomain) ...

// Individual check functions
function checkSuspiciousDomain(hostname) {
    // ... (existing code) ...
}

function checkSubdomainAbuse(hostname) {
    const parts = hostname.split('.');
    const hasExcessiveSubdomains = parts.length > 4; // e.g., login.secure.bankofamerica.com.phishing.site
    const hasSuspiciousSubdomain = parts.some(part => 
        /secure|login|verify|update|account/.test(part)
    );

    return {
        type: 'Subdomain Abuse',
        severity: 'medium',
        description: 'Suspicious use of subdomains',
        found: hasExcessiveSubdomains || hasSuspiciousSubdomain
    };
}

function checkSuspiciousTLD(hostname) {
    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.top', '.click', '.download', '.zip']; // Common free/phishing TLDs
    const found = suspiciousTLDs.some(tld => hostname.endsWith(tld));

    return {
        type: 'Suspicious TLD',
        severity: 'medium',
        description: 'Domain uses a suspicious top-level domain',
        found
    };
}

function checkIPAddress(hostname) {
    const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/; // Regex for IPv4
    const found = ipRegex.test(hostname);

    return {
        type: 'IP Address Usage',
        severity: 'high',
        description: 'URL uses IP address instead of domain name',
        found
    };
}

// Update performPhishingAnalysis to include new checks
function performPhishingAnalysis(url) {
    const indicators = [];
    let riskScore = 0;

    try {
        const normalizedUrl = url.toLowerCase().trim();
        const urlObj = new URL(normalizedUrl.startsWith('http') ? normalizedUrl : `https://${normalizedUrl}`);

        // Add all check functions to the checks array
        const checks = [
            checkSuspiciousDomain(urlObj.hostname),
            checkSubdomainAbuse(urlObj.hostname),
            checkSuspiciousTLD(urlObj.hostname),
            checkIPAddress(urlObj.hostname)
        ];

        checks.forEach(indicator => {
            indicators.push(indicator);
            if (indicator.found) {
                riskScore += indicator.severity === 'high' ? 3 : indicator.severity === 'medium' ? 2 : 1;
            }
        });

        const riskLevel = riskScore >= 8 ? 'high' : riskScore >= 4 ? 'medium' : 'low';
        // Still using dummy summary and recommendations
        return {
            url,
            riskLevel,
            riskScore,
            indicators,
            summary: `Risk level: ${riskLevel}, Score: ${riskScore}. Found indicators: ${indicators.filter(i => i.found).map(i => i.type).join(', ')}`,
            recommendations: []
        };

    } catch (error) {
        // ... (existing error handling) ...
    }
}
// ... (rest of JS code) ...
// ... (previous JS code, including check functions from Day 9) ...

// Individual check functions
function checkURLLength(url) {
    const found = url.length > 100; // Arbitrary long URL threshold

    return {
        type: 'Excessive URL Length',
        severity: 'low',
        description: 'URL is unusually long',
        found
    };
}

function checkHTTPSUsage(protocol) {
    const found = protocol === 'http:'; // True if not HTTPS

    return {
        type: 'No HTTPS',
        severity: 'medium',
        description: 'Site does not use HTTPS encryption',
        found
    };
}

function checkCommonPhishingPatterns(url) {
    const phishingPatterns = [
        /bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|short/, // URL shorteners
        /free|prize|winner|congratulations|urgent|immediate/, // Urgency/lure keywords
        /click-here|download-now|verify-now|update-now/ // Call to action keywords
    ];

    const found = phishingPatterns.some(pattern => pattern.test(url.toLowerCase()));

    return {
        type: 'Phishing Patterns',
        severity: 'high',
        description: 'URL contains common phishing keywords or uses URL shorteners',
        found
    };
}

// Summary and Recommendation Generators
function generateSummary(riskLevel, riskScore, indicators) {
    const foundIndicators = indicators.filter(i => i.found).length;
    
    switch (riskLevel) {
        case 'high':
            return `HIGH RISK: This URL shows ${foundIndicators} suspicious indicators with a risk score of ${riskScore}. Avoid visiting this link.`;
        case 'medium':
            return `MEDIUM RISK: This URL has ${foundIndicators} potential issues with a risk score of ${riskScore}. Exercise caution.`;
        case 'low':
            return `LOW RISK: This URL appears relatively safe with ${foundIndicators} minor concerns and a risk score of ${riskScore}.`;
        default:
            return 'Unable to assess risk level.';
    }
}

function generateRecommendations(riskLevel) {
    const recommendations = [];
    
    if (riskLevel === 'high') {
        recommendations.push('Do not visit this URL');
        recommendations.push('Report this link to your IT security team');
        recommendations.push('Delete any messages containing this link');
    } else if (riskLevel === 'medium') {
        recommendations.push('Exercise extreme caution if visiting');
        recommendations.push('Verify the link through official channels');
        recommendations.push('Use a secure browser with up-to-date security features');
    } else { // Low risk
        recommendations.push('URL appears relatively safe');
        recommendations.push('Still verify the source if received unexpectedly');
    }

    return recommendations;
}

// Update performPhishingAnalysis to include all checks and use generators
function performPhishingAnalysis(url) {
    const indicators = [];
    let riskScore = 0;

    try {
        const normalizedUrl = url.toLowerCase().trim();
        const urlObj = new URL(normalizedUrl.startsWith('http') ? normalizedUrl : `https://${normalizedUrl}`);

        const checks = [
            checkSuspiciousDomain(urlObj.hostname),
            checkSubdomainAbuse(urlObj.hostname),
            checkSuspiciousTLD(urlObj.hostname),
            checkIPAddress(urlObj.hostname),
            checkURLLength(url), // New
            checkHTTPSUsage(urlObj.protocol), // New
            checkCommonPhishingPatterns(url) // New
        ];

        checks.forEach(indicator => {
            indicators.push(indicator);
            if (indicator.found) {
                riskScore += indicator.severity === 'high' ? 3 : indicator.severity === 'medium' ? 2 : 1;
            }
        });

        const riskLevel = riskScore >= 8 ? 'high' : riskScore >= 4 ? 'medium' : 'low';
        const summary = generateSummary(riskLevel, riskScore, indicators); // Use generator
        const recommendations = generateRecommendations(riskLevel); // Use generator

        return {
            url,
            riskLevel,
            riskScore,
            indicators,
            summary,
            recommendations
        };

    } catch (error) {
        // ... (existing error handling) ...
    }
}
// ... (rest of JS code) ...
// ... (previous JS code, including analysis functions) ...

// URL Analysis (updated to call displayResults)
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
        const analysis = performPhishingAnalysis(url);
        displayResults(analysis); // <--- Call displayResults here
        // addToHistory(analysis); // Will implement history later
        
        // Reset button state
        checkBtn.disabled = false;
        checkBtnText.textContent = 'Check';
        loadingSpinner.classList.add('hidden');
        
        // Show results
        resultsSection.classList.remove('hidden');
    }, 1500);
}

// ... (Individual check functions and generators) ...

// Display results
function displayResults(analysis) {
    const resultsContainer = document.getElementById('analysisResults');
    const riskClass = `risk-${analysis.riskLevel}`;
    const riskIcon = analysis.riskLevel === 'high' ? 
        `<svg class="icon animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>` :
        analysis.riskLevel === 'medium' ?
        `<svg class="icon animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>` :
        `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>`;

    resultsContainer.innerHTML = `
        <div class="risk-indicator">
            <span class="${riskClass}">${riskIcon}</span>
            <h3 class="font-semibold">Risk Assessment</h3>
            <span class="risk-badge ${analysis.riskLevel}">${analysis.riskLevel.toUpperCase()}</span>
            <span style="margin-left: 1rem; font-family: monospace;">${analysis.riskScore}/10</span>
        </div>
        
        <div class="mb-4">
            <p><strong>URL:</strong> ${analysis.url}</p>
            <p class="mb-4">${analysis.summary}</p>
        </div>

        <div class="mb-4">
            <h4 class="font-semibold mb-2">Detected Issues:</h4>
            ${analysis.indicators.filter(i => i.found).map(indicator => `
                <div class="tip-item">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="risk-${indicator.severity} font-semibold">${indicator.type}</span>
                        <span class="risk-badge ${indicator.severity}">${indicator.severity}</span>
                    </div>
                    <p class="text-sm">${indicator.description}</p>
                </div>
            `).join('')}
            ${analysis.indicators.filter(i => i.found).length === 0 ? '<p class="text-sm" style="color: var(--text-secondary);">No major issues detected.</p>' : ''}
        </div>

        <div>
            <h4 class="font-semibold mb-2">Recommendations:</h4>
            <ul style="list-style: disc; padding-left: 1.5rem;">
                ${analysis.recommendations.map(rec => `<li class="mb-1">${rec}</li>`).join('')}
            </ul>
        </div>
    `;
}
// ... (rest of JS code) ...
// ... (previous JS code, including analysis functions) ...

// URL Analysis (updated to call displayResults)
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
        const analysis = performPhishingAnalysis(url);
        displayResults(analysis); // <--- Call displayResults here
        // addToHistory(analysis); // Will implement history later
        
        // Reset button state
        checkBtn.disabled = false;
        checkBtnText.textContent = 'Check';
        loadingSpinner.classList.add('hidden');
        
        // Show results
        resultsSection.classList.remove('hidden');
    }, 1500);
}

// ... (Individual check functions and generators) ...

// Display results
function displayResults(analysis) {
    const resultsContainer = document.getElementById('analysisResults');
    const riskClass = `risk-${analysis.riskLevel}`;
    const riskIcon = analysis.riskLevel === 'high' ? 
        `<svg class="icon animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>` :
        analysis.riskLevel === 'medium' ?
        `<svg class="icon animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>` :
        `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>`;

    resultsContainer.innerHTML = `
        <div class="risk-indicator">
            <span class="${riskClass}">${riskIcon}</span>
            <h3 class="font-semibold">Risk Assessment</h3>
            <span class="risk-badge ${analysis.riskLevel}">${analysis.riskLevel.toUpperCase()}</span>
            <span style="margin-left: 1rem; font-family: monospace;">${analysis.riskScore}/10</span>
        </div>
        
        <div class="mb-4">
            <p><strong>URL:</strong> ${analysis.url}</p>
            <p class="mb-4">${analysis.summary}</p>
        </div>

        <div class="mb-4">
            <h4 class="font-semibold mb-2">Detected Issues:</h4>
            ${analysis.indicators.filter(i => i.found).map(indicator => `
                <div class="tip-item">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="risk-${indicator.severity} font-semibold">${indicator.type}</span>
                        <span class="risk-badge ${indicator.severity}">${indicator.severity}</span>
                    </div>
                    <p class="text-sm">${indicator.description}</p>
                </div>
            `).join('')}
            ${analysis.indicators.filter(i => i.found).length === 0 ? '<p class="text-sm" style="color: var(--text-secondary);">No major issues detected.</p>' : ''}
        </div>

        <div>
            <h4 class="font-semibold mb-2">Recommendations:</h4>
            <ul style="list-style: disc; padding-left: 1.5rem;">
                ${analysis.recommendations.map(rec => `<li class="mb-1">${rec}</li>`).join('')}
            </ul>
        </div>
    `;
}
// ... (rest of JS code) ...
// ... (previous JS code) ...

// Toggle functions
function toggleHistory() {
    const historySection = document.getElementById('historySection');
    historySection.classList.toggle('hidden');
}

function toggleTips() {
    const tipsSection = document.getElementById('tipsSection');
    tipsSection.classList.toggle('hidden');
}