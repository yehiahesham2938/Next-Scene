// Global search functionality for redirecting to Browse page
function initializeGlobalSearch() {
    // Find all search inputs across the site (excluding Browse page specific ones)
    const searchInputs = document.querySelectorAll('input[placeholder*="Search"]');
    
    searchInputs.forEach(input => {
        // Skip if it's already been initialized or is on the browse page
        if (input.dataset.searchInitialized || input.id === 'desktop-header-search' || 
            input.id === 'mobile-search' || input.id === 'desktop-main-search') {
            return;
        }
        
        input.dataset.searchInitialized = 'true';
        
        // Handle Enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchQuery = e.target.value.trim();
                if (searchQuery) {
                    // Redirect to Browse page with search parameter
                    window.location.href = `Browse.html?search=${encodeURIComponent(searchQuery)}`;
                }
            }
        });
        
        // Add search icon click handler if there's a parent with search icon
        const parentDiv = input.closest('.relative');
        if (parentDiv) {
            const searchIcon = parentDiv.querySelector('svg, button, .fa-search');
            if (searchIcon) {
                searchIcon.style.cursor = 'pointer';
                searchIcon.addEventListener('click', () => {
                    const searchQuery = input.value.trim();
                    if (searchQuery) {
                        window.location.href = `Browse.html?search=${encodeURIComponent(searchQuery)}`;
                    }
                });
            }
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGlobalSearch);
} else {
    initializeGlobalSearch();
}
