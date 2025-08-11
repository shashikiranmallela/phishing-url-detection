
// Global variables
let scanHistory = [];
let currentTheme = 'dark';

// Safe browsing tips data
const safeBrowsingTips = [
    {
        title: "Check the URL carefully",
        description: "Look for misspellings, suspicious domains, or unusual characters in the web address.",
        icon: `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`
    },
    {
        title: "Look for HTTPS",
        description: "Ensure the website uses HTTPS (secure connection) especially for login pages and payments.",
        icon: `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>`
    },
    {
        title: "Be wary of urgent messages",
        description: "Phishing emails often create false urgency. Take time to verify before clicking links.",
        icon: `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`
    },
    {
        title: "Verify through official channels",
        description: "If you receive a suspicious link, visit the official website directly instead of clicking.",
        icon: `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    },
    {
        title: "Use updated security software",
        description: "Keep your browser and antivirus software up to date for better protection.",
        icon: `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>`
    },
    {
        title: "Double-check email senders",
        description: "Verify the sender's email address and be suspicious of unexpected messages.",
        icon: `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    }
];

// Initialize the application
function init() {
    loadTheme();
    renderTips();
    
    // Add enter key listener to input
    document.getElementById('urlInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            analyzeURL();
        }
    });
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
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme();
}

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
        const analysis = performPhishingAnalysis(url);
        displayResults(analysis);
        addToHistory(analysis);
        
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

        // Check various indicators
        const checks = [
            checkSuspiciousDomain(urlObj.hostname),
            checkSubdomainAbuse(urlObj.hostname),
            checkSuspiciousTLD(urlObj.hostname),
            checkIPAddress(urlObj.hostname),
            checkURLLength(url),
            checkHTTPSUsage(urlObj.protocol),
            checkCommonPhishingPatterns(url)
        ];

        checks.forEach(indicator => {
            indicators.push(indicator);
            if (indicator.found) {
                riskScore += indicator.severity === 'high' ? 3 : indicator.severity === 'medium' ? 2 : 1;
            }
        });

        const riskLevel = riskScore >= 8 ? 'high' : riskScore >= 4 ? 'medium' : 'low';
        const summary = generateSummary(riskLevel, riskScore, indicators);
        const recommendations = generateRecommendations(riskLevel);

        return {
            url,
            riskLevel,
            riskScore,
            indicators,
            summary,
            recommendations
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

// Individual check functions
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

function checkSubdomainAbuse(hostname) {
    const parts = hostname.split('.');
    const hasExcessiveSubdomains = parts.length > 4;
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
    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.top', '.click', '.download', '.zip'];
    const found = suspiciousTLDs.some(tld => hostname.endsWith(tld));

    return {
        type: 'Suspicious TLD',
        severity: 'medium',
        description: 'Domain uses a suspicious top-level domain',
        found
    };
}

function checkIPAddress(hostname) {
    const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    const found = ipRegex.test(hostname);

    return {
        type: 'IP Address Usage',
        severity: 'high',
        description: 'URL uses IP address instead of domain name',
        found
    };
}

function checkURLLength(url) {
    const found = url.length > 100;

    return {
        type: 'Excessive URL Length',
        severity: 'low',
        description: 'URL is unusually long',
        found
    };
}

function checkHTTPSUsage(protocol) {
    const found = protocol === 'http:';

    return {
        type: 'No HTTPS',
        severity: 'medium',
        description: 'Site does not use HTTPS encryption',
        found
    };
}

function checkCommonPhishingPatterns(url) {
    const phishingPatterns = [
        /bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|short/,
        /free|prize|winner|congratulations|urgent|immediate/,
        /click-here|download-now|verify-now|update-now/
    ];

    const found = phishingPatterns.some(pattern => pattern.test(url.toLowerCase()));

    return {
        type: 'Phishing Patterns',
        severity: 'high',
        description: 'URL contains common phishing keywords or uses URL shorteners',
        found
    };
}

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
    } else {
        recommendations.push('URL appears relatively safe');
        recommendations.push('Still verify the source if received unexpectedly');
    }

    return recommendations;
}

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

// History management
function addToHistory(analysis) {
    const historyItem = {
        id: Date.now(),
        url: analysis.url,
        riskLevel: analysis.riskLevel,
        timestamp: new Date().toLocaleString(),
        riskScore: analysis.riskScore
    };
    
    scanHistory.unshift(historyItem);
    scanHistory = scanHistory.slice(0, 10); // Keep only last 10
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    
    if (scanHistory.length === 0) {
        historyList.innerHTML = `
            <div class="text-center" style="padding: 2rem; color: var(--text-tertiary);">
                <svg class="icon-lg animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 1rem;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <p>No scans yet. Start by checking a URL above!</p>
            </div>
        `;
        return;
    }

    historyList.innerHTML = scanHistory.map((item, index) => {
        const riskIcon = item.riskLevel === 'high' ? 
            `<svg class="icon risk-high animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>` :
            item.riskLevel === 'medium' ?
            `<svg class="icon risk-medium animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>` :
            `<svg class="icon risk-low" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>`;

        return `
            <div class="history-item animate-slide-in-left" style="animation-delay: ${index * 100}ms;">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3 flex-1">
                        ${riskIcon}
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <p class="font-semibold text-sm" style="color: var(--text-primary);">${item.url}</p>
                                <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--text-tertiary);">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                            </div>
                            <p class="text-sm" style="color: var(--text-tertiary);">${item.timestamp}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-sm" style="color: var(--text-secondary); font-family: monospace;">${item.riskScore}/10</span>
                        <span class="risk-badge ${item.riskLevel}">${item.riskLevel.toUpperCase()}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function clearHistory() {
    scanHistory = [];
    renderHistory();
}

// Tips management
function renderTips() {
    const tipsList = document.getElementById('tipsList');
    tipsList.innerHTML = safeBrowsingTips.map((tip, index) => `
        <div class="tip-item animate-slide-in-left" style="animation-delay: ${index * 150}ms;">
            <div class="flex items-start gap-3">
                <div class="flex-shrink-0 mt-1">
                    ${tip.icon}
                </div>
                <div>
                    <h4 class="font-semibold mb-1" style="color: var(--text-primary);">${tip.title}</h4>
                    <p class="text-sm" style="color: var(--text-secondary);">${tip.description}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle functions
function toggleHistory() {
    const historySection = document.getElementById('historySection');
    historySection.classList.toggle('hidden');
}

function toggleTips() {
    const tipsSection = document.getElementById('tipsSection');
    tipsSection.classList.toggle('hidden');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
