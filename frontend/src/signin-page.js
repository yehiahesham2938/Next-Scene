import './signin-page.css';

const form = document.getElementById('signin-form');
const errorMessage = document.getElementById('error-message');

if (form) {
    form.addEventListener('submit', async(e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        errorMessage.classList.add('hidden');
        errorMessage.textContent = '';

        // Show loading overlay
        const loadingOverlay = document.getElementById('page-transition-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.pointerEvents = 'all';
            loadingOverlay.style.opacity = '1';
            const dotsEl = document.getElementById('loading-dots');
            if (dotsEl) {
                let dots = 0;
                const dotsInterval = setInterval(() => {
                    dots = (dots + 1) % 4;
                    dotsEl.textContent = '.'.repeat(dots);
                }, 400);
                // Store interval ID to clear it later
                loadingOverlay.dataset.dotsInterval = dotsInterval;
            }
        }

        try {
            const response = await fetch('http://localhost:4000/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json().catch(() => ({}));

            if (response.status === 200) {
                localStorage.setItem('user', JSON.stringify(data));
                // Keep loading overlay visible during redirect
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 300);
                return;
            }

            if (response.status === 401) {
                errorMessage.textContent = data.message || 'user does not have an account';
                errorMessage.classList.remove('hidden');
            } else {
                errorMessage.textContent = data.message || 'Failed to sign in';
                errorMessage.classList.remove('hidden');
            }

            // Hide loading overlay on error
            if (loadingOverlay) {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.pointerEvents = 'none';
                }, 300);
                // Clear dots interval
                if (loadingOverlay.dataset.dotsInterval) {
                    clearInterval(parseInt(loadingOverlay.dataset.dotsInterval));
                }
            }
        } catch (err) {
            console.error(err);
            errorMessage.textContent = 'Network error, please try again later';
            errorMessage.classList.remove('hidden');

            // Hide loading overlay on error
            if (loadingOverlay) {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.pointerEvents = 'none';
                }, 300);
                // Clear dots interval
                if (loadingOverlay.dataset.dotsInterval) {
                    clearInterval(parseInt(loadingOverlay.dataset.dotsInterval));
                }
            }
        }
    });
}