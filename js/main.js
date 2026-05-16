/**
 * Egyptian Arabic Localization Logic
 * Handles language switching, dictionary lookup, and RTL transitions.
 */

let currentLang = localStorage.getItem('amr_lang') || 'en';
let isTransitioning = false;

function updateContent() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            const translation = translations[currentLang][key];
            
            // Handle HTML content if it's the hero description or similar
            if (translation.includes('<')) {
                el.innerHTML = translation;
            } else {
                el.textContent = translation;
            }
        }
    });

    const phElements = document.querySelectorAll('[data-i18n-ph]');
    phElements.forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.setAttribute('placeholder', translations[currentLang][key]);
        }
    });

    // Update toggle button text
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.textContent = currentLang === 'en' ? 'AR' : 'EN';
    }
}

function toggleLanguage() {
    if (isTransitioning) return;
    isTransitioning = true;

    const luxuryLoader = document.getElementById('luxury-loader');
    const html = document.documentElement;
    
    // 1. Show Loader and spirited messages
    if (luxuryLoader) {
        const loaderTitle = luxuryLoader.querySelector('.loader-job-title');
        if (loaderTitle) {
            const messages = currentLang === 'en' 
                ? ["بنظبط زوايا التصميم...", "بنجهز الأكواد بالحب...", "بنرتب البيانات بكل شياكة..."]
                : ["Aligning architectural precision...", "Curating data elegance...", "Manifesting luxury experience..."];
            loaderTitle.textContent = messages[Math.floor(Math.random() * messages.length)];
        }
        luxuryLoader.classList.remove('hidden');
        luxuryLoader.style.opacity = '';
        luxuryLoader.style.visibility = '';
    }

    // 2. Play Click Sound (if playClick is available from index.html)
    if (typeof playClick === 'function') playClick();

    // 3. Perform Switch after brief delay (Loader cinematic feel)
    setTimeout(() => {
        currentLang = currentLang === 'en' ? 'ar' : 'en';
        localStorage.setItem('amr_lang', currentLang);

        // Update HTML attributes
        html.setAttribute('lang', currentLang);
        html.setAttribute('dir', 'ltr');

        // Update all text content
        updateContent();

        // 4. Hide Loader
        setTimeout(() => {
            if (luxuryLoader) {
                luxuryLoader.classList.add('hidden');
                // Ensure inline styles are cleared so CSS class takes priority
                luxuryLoader.style.opacity = '';
                luxuryLoader.style.visibility = '';
            }
            isTransitioning = false;
        }, 600);
    }, 400);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Sync with saved language
    const html = document.documentElement;
    html.setAttribute('lang', currentLang);
    html.setAttribute('dir', 'ltr');
    updateContent();

    // Attach event listener to toggle button
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.addEventListener('click', toggleLanguage);
    }
});
