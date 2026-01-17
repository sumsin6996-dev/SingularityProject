// Profile Dropdown and Features Navigation Functionality

// Profile Dropdown Toggle
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
            profileDropdown.classList.remove('show');
        }
    });

    // Prevent dropdown from closing when clicking inside it
    profileDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Features Link - Smooth Scroll
const featuresLink = document.getElementById('featuresLink');
if (featuresLink) {
    featuresLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        const featuresSection = document.getElementById('features');
        const resultsSection = document.getElementById('resultsSection');
        
        // If results are visible, scroll to features
        if (resultsSection && resultsSection.style.display !== 'none') {
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            // If results are not visible, scroll to upload section
            const uploadSection = document.getElementById('uploadSection');
            if (uploadSection) {
                uploadSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
}
