// Page transition loading overlay
(function() {
    'use strict';

    // Create loading overlay HTML
    const loadingHTML = `
        <div id="page-transition-overlay" style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease-in-out;
        ">
            <div style="text-align: center;">
                <!-- Film reel spinner -->
                <div style="
                    width: 60px;
                    height: 60px;
                    margin: 0 auto 20px;
                    animation: spin 1s linear infinite;
                ">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#eab308">
                        <path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM48 368v32c0 8.8 7.2 16 16 16H96c8.8 0 16-7.2 16-16V368c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16zm368-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V368c0-8.8-7.2-16-16-16H416zM48 240v32c0 8.8 7.2 16 16 16H96c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16zm368-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H416zM48 112v32c0 8.8 7.2 16 16 16H96c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16zM416 96c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H416zM160 128v64c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H192c-17.7 0-32 14.3-32 32zm32 160c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V320c0-17.7-14.3-32-32-32H192z"/>
                    </svg>
                </div>
                <!-- Loading text -->
                <div style="
                    color: #eab308;
                    font-size: 18px;
                    font-weight: 600;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    letter-spacing: 2px;
                ">LOADING<span id="loading-dots"></span></div>
            </div>
        </div>
        <style>
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        </style>
    `;

    // Insert overlay into DOM
    document.addEventListener('DOMContentLoaded', function() {
        document.body.insertAdjacentHTML('beforeend', loadingHTML);

        const overlay = document.getElementById('page-transition-overlay');
        const dotsEl = document.getElementById('loading-dots');

        // Animated dots
        let dots = 0;
        let dotsInterval;

        function startDots() {
            dotsInterval = setInterval(() => {
                dots = (dots + 1) % 4;
                dotsEl.textContent = '.'.repeat(dots);
            }, 400);
        }

        function stopDots() {
            clearInterval(dotsInterval);
            dotsEl.textContent = '';
        }

        // Show overlay function
        function showOverlay() {
            overlay.style.pointerEvents = 'all';
            overlay.style.opacity = '1';
            startDots();
        }

        // Hide overlay function
        function hideOverlay() {
            overlay.style.opacity = '0';
            stopDots();
            setTimeout(() => {
                overlay.style.pointerEvents = 'none';
            }, 300);
        }

        // Intercept all link clicks for smooth transitions
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');

            // Check if it's a valid internal link
            if (link &&
                link.href &&
                link.href.indexOf(window.location.origin) === 0 &&
                !link.hasAttribute('target') &&
                !link.hasAttribute('download') &&
                !link.href.includes('#') &&
                link.href !== window.location.href) {

                e.preventDefault();

                showOverlay();

                // Navigate after a brief delay to show the overlay
                setTimeout(() => {
                    window.location.href = link.href;
                }, 150);
            }
        });

        // Hide overlay when page loads
        window.addEventListener('load', function() {
            setTimeout(hideOverlay, 100);
        });

        // Show overlay immediately if navigating back/forward
        window.addEventListener('pageshow', function(event) {
            if (event.persisted) {
                hideOverlay();
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('pagehide', function() {
            showOverlay();
        });
    });
})();