document.addEventListener('DOMContentLoaded', () => {
    // Preloader and Page Load Animation
    const preloader = document.getElementById('preloader');
    const container = document.querySelector('.container');
    const bgVideo = document.getElementById('bg-video');

    // Start loading video immediately
    let videoReady = Promise.resolve();
    if (bgVideo) {
        const source = bgVideo.querySelector('source');
        if (source && source.dataset.src) {
            source.src = source.dataset.src;
            bgVideo.load();
        }

        videoReady = new Promise((resolve) => {
            bgVideo.oncanplaythrough = resolve;
            // Fallback in case canplaythrough doesn't fire or video is already cached
            if (bgVideo.readyState >= 3) resolve();
            setTimeout(resolve, 5000); // Max 5s wait for video
        });
    }

    const windowLoad = new Promise((resolve) => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', resolve);
    });

    // Wait for both resources (window and video)
    Promise.all([windowLoad, videoReady]).then(() => {
        // Minimal delay for visual smoothness
        setTimeout(() => {
            preloader.classList.add('fade-out');

            setTimeout(() => {
                preloader.style.display = 'none';
                container.classList.add('loaded');

                // Trigger staggered animations
                initializeAnimations();

                // Show and play video immediately from start
                if (bgVideo) {
                    bgVideo.currentTime = 0;
                    bgVideo.play().catch(err => console.log('Video play prevented:', err));
                    bgVideo.classList.add('show');
                }
            }, 600);
        }, 300);
    });

    // Initialize staggered animations
    function initializeAnimations() {
        const sidebar = document.querySelector('.sidebar');
        const content = document.querySelector('.content');
        const profileSection = document.querySelector('.profile-section');
        const skillsSection = document.querySelector('.skills-section');
        const latestWorkSection = document.querySelector('.latest-work-section');
        const sections = document.querySelectorAll('section');
        const videoCards = document.querySelectorAll('.video-card');

        // Sidebar slides in from left
        if (sidebar) {
            sidebar.classList.add('slide-in-left');
        }

        // Content slides in from right
        if (content) {
            content.classList.add('slide-in-right');
        }

        // Stagger profile elements
        if (profileSection) {
            setTimeout(() => {
                profileSection.classList.add('fade-in');
            }, 200);
        }

        if (skillsSection) {
            setTimeout(() => {
                skillsSection.classList.add('slide-in-up');
            }, 400);
        }

        if (latestWorkSection) {
            setTimeout(() => {
                latestWorkSection.classList.add('slide-in-up');
            }, 600);
        }

        // Stagger main content sections
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('slide-in-up');
            }, 300 + (index * 150));
        });

        // Stagger video cards
        videoCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, 800 + (index * 100));
        });
    }

    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeIcon) themeIcon.src = 'sun.png';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            document.documentElement.classList.toggle('light-theme-base');

            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');

            // Change icon
            if (themeIcon) {
                themeIcon.src = isLight ? 'sun.png' : 'moon.png';
            }
        });
    }

    // Initial sync for html class
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme-base');
    }

    // Email Copy to Clipboard
    const emailContainer = document.querySelector('.email-copy');
    if (emailContainer) {
        const originalContent = emailContainer.innerHTML;
        let isCopying = false;

        emailContainer.addEventListener('click', () => {
            if (isCopying) return;
            isCopying = true;

            const emailText = emailContainer.querySelector('span').innerText;
            navigator.clipboard.writeText(emailText).then(() => {
                console.log('Email copied to clipboard:', emailText);
                emailContainer.innerHTML = '<i class="fas fa-check" style="color: #2ecc71;"></i> <span>Copied!</span>';

                setTimeout(() => {
                    emailContainer.innerHTML = originalContent;
                    isCopying = false;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                isCopying = false;
            });
        });
    }

});
