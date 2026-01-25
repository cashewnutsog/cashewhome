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
        // Minimum time to show preloader (ensure it's visible on fast devices)
        const minDisplayTime = window.innerWidth > 768 ? 500 : 1500;

        setTimeout(() => {
            // Use requestAnimationFrame to ensure painting has occurred
            requestAnimationFrame(() => {
                if (preloader) {
                    preloader.classList.add('fade-out');

                    // Wait for CSS transition (0.6s) to finish before removing preloader
                    setTimeout(() => {
                        preloader.remove();
                        document.body.classList.remove('preloader-active');
                        document.documentElement.classList.remove('preloader-active');

                        // Stage 1: Fade in main container
                        container.classList.add('loaded');

                        // Stage 2: Trigger internal content animations after a short delay
                        setTimeout(() => {
                            initializeAnimations();
                        }, 200);

                        // Stage 3: Show video background last
                        if (bgVideo) {
                            setTimeout(() => {
                                bgVideo.currentTime = 0;
                                const playPromise = bgVideo.play();
                                if (playPromise !== undefined) {
                                    playPromise.then(() => {
                                        bgVideo.classList.add('show');
                                    }).catch(err => {
                                        console.log('Video play prevented:', err);
                                        bgVideo.classList.add('show');
                                    });
                                }
                            }, 500);
                        }
                    }, 600);
                }
            });
        }, minDisplayTime);
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


    // Scroll Progress Logic
    const progressBar = document.getElementById('progress-bar');
    const contentArea = document.querySelector('.content');

    const updateProgress = (scrollTop, scrollHeight, clientHeight) => {
        const height = scrollHeight - clientHeight;
        if (height > 0) {
            const scrolled = (scrollTop / height) * 100;
            progressBar.style.width = scrolled + "%";
        }
    };

    if (progressBar) {
        const handleScroll = () => {
            if (window.innerWidth > 768 && contentArea) {
                updateProgress(contentArea.scrollTop, contentArea.scrollHeight, contentArea.clientHeight);
            } else {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight;
                const clientHeight = document.documentElement.clientHeight;
                updateProgress(scrollTop, scrollHeight, clientHeight);
            }
        };

        contentArea?.addEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleScroll);
    }

    // 3D Tilt Effect for Video Cards
    const isMobile = window.innerWidth <= 768;
    const cards = document.querySelectorAll('.video-card');

    if (!isMobile) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }

    // Universal Scroll Detection for Iframe Fix
    const handleScrollStart = () => {
        document.body.classList.add('is-scrolling');
        clearTimeout(window.scrollTimeout);
        window.scrollTimeout = setTimeout(() => {
            document.body.classList.remove('is-scrolling');
        }, 200);
    };

    window.addEventListener('scroll', handleScrollStart, { passive: true });
    contentArea?.addEventListener('scroll', handleScrollStart, { passive: true });

    // Music Search Logic
    const searchTrigger = document.getElementById('search-trigger');
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('music-search-input');
    const closeSearch = document.querySelector('.close-search');

    if (searchTrigger && searchModal && searchInput && closeSearch) {
        // Open search
        searchTrigger.addEventListener('click', () => {
            searchModal.classList.add('active');
            setTimeout(() => searchInput.focus(), 100);
        });

        // Close search
        const closeModal = () => {
            searchModal.classList.remove('active');
            searchInput.value = '';
        };

        closeSearch.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if (e.target === searchModal) closeModal();
        });

        // Handle Search Input
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim().toLowerCase();
                let foundMatch = false;

                cards.forEach(card => {
                    const title = card.getAttribute('data-title').toLowerCase();
                    if (title.includes(query) && query.length > 0) {
                        foundMatch = true;
                        closeModal();

                        // Scroll to the card
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        // Apply glow effect
                        card.classList.add('glow-effect');

                        // Remove glow after 3 seconds
                        setTimeout(() => {
                            card.classList.remove('glow-effect');
                        }, 3000);
                    }
                });

                if (!foundMatch && query.length > 0) {
                    searchInput.style.borderColor = '#ff4b2b';
                    setTimeout(() => searchInput.style.borderColor = 'rgba(255, 255, 255, 0.1)', 1000);
                }
            }
        });
    }
    // Initialize Lenis for Smooth Scrolling
    if (typeof Lenis !== 'undefined') {
        const content = document.querySelector('.content');
        if (content) {
            const lenis = new Lenis({
                wrapper: content, // The element that scrolls
                // content: content, // REMOVED: Do not set content to the same element as wrapper
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                smoothTouch: false,
                touchMultiplier: 2,
                enabled: window.innerWidth > 768, // Disable Lenis on mobile
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);
        }
    }

    // Simulated Stats Logic
    function updateSimulatedStats() {
        const viewerCount = document.getElementById('live-viewers');
        const subscriberCount = document.getElementById('live-subscribers');
        const viewCount = document.getElementById('live-views');
        const videoCount = document.getElementById('live-videos');
        const caption = document.getElementById('sarcastic-caption');

        if (!viewerCount || !subscriberCount || !viewCount || !videoCount) return;

        // 1. Hardcoded & Dynamic Stats
        subscriberCount.innerText = "22";
        const totalVideos = document.querySelectorAll('.video-card').length;

        // Dynamic Weekly Video Growth
        // Starting with actual video cards, adding 1 for every Saturday 5:45 PM that passes
        // Start date: Saturday, Jan 31, 2026, 17:30:00
        const startSaturday = new Date('January 31, 2026 17:30:00').getTime();
        const nowTime = new Date().getTime();

        let extraVideos = 0;
        if (nowTime >= startSaturday) {
            // Number of full weeks passed since the first Saturday
            extraVideos = Math.floor((nowTime - startSaturday) / (1000 * 60 * 60 * 24 * 7)) + 1;
        }

        videoCount.innerText = (totalVideos + extraVideos).toString();

        // 2. Dynamic Total Views Growth Logic
        // Starting at 319 on Jan 21, 2026, increasing by ~2 per day (1, 2, or 3)
        const startDate = new Date('January 24, 2026').getTime();
        const now = new Date().getTime();
        const diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

        const baseViews = 396;
        const currentViews = baseViews + (diffDays * 2); // Averaging to 2 per day
        viewCount.innerText = Math.floor(currentViews).toLocaleString();

        // 3. Live Viewers (Random 1-3)
        function updateViewers() {
            viewerCount.innerText = Math.floor(Math.random() * 3) + 1;
        }
        updateViewers();
        setInterval(updateViewers, 3000);

        const sarcasticCaptions = [
            "Mom is watching...",
            "Viral in 2050",
            "Just you and me",
            "Refreshing...",
            "Algorithms hate this",
            "Bot traffic only",
            "Waiting for a miracle"
        ];

        // Update Caption (every 5s)
        let captionInterval = setInterval(() => {
            if (!caption) return clearInterval(captionInterval);
            const randomCaption = sarcasticCaptions[Math.floor(Math.random() * sarcasticCaptions.length)];
            caption.style.opacity = 0;
            setTimeout(() => {
                caption.innerText = randomCaption;
                caption.style.opacity = 1;
            }, 500);
        }, 5000);

        // Manual Refresh (Simulated)
        const refreshBtn = document.getElementById('refresh-stats');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                refreshBtn.style.transform = 'rotate(360deg)';
                // Just brief jitter to simulate "refreshing"
                const originalValue = viewerCount.innerText;
                viewerCount.innerText = "...";
                setTimeout(() => {
                    viewerCount.innerText = originalValue;
                    refreshBtn.style.transform = 'rotate(0deg)';
                }, 800);
            });
        }
    }

    updateSimulatedStats();

    // Release Countdown Logic
    function getNextSaturdayTarget() {
        const now = new Date();
        const target = new Date();

        // Target Saturday (6) at 17:30 (5:30 PM)
        target.setHours(17, 30, 0, 0);

        const day = now.getDay();
        let daysUntilSaturday = (6 - day + 7) % 7;

        // If today is Saturday
        if (daysUntilSaturday === 0) {
            // If 5:45 PM has already passed today, target next Saturday
            if (now.getTime() >= target.getTime()) {
                daysUntilSaturday = 7;
            }
        }

        target.setDate(now.getDate() + daysUntilSaturday);
        return target.getTime();
    }

    let targetDate = getNextSaturdayTarget();
    const countdownDays = document.getElementById('days');
    const countdownHours = document.getElementById('hours');
    const countdownMinutes = document.getElementById('minutes');
    const countdownSeconds = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        let distance = targetDate - now;

        // If target reached, reset for next week
        if (distance < 0) {
            targetDate = getNextSaturdayTarget();
            distance = targetDate - now;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (countdownDays) countdownDays.innerText = days.toString().padStart(2, '0');
        if (countdownHours) countdownHours.innerText = hours.toString().padStart(2, '0');
        if (countdownMinutes) countdownMinutes.innerText = minutes.toString().padStart(2, '0');
        if (countdownSeconds) countdownSeconds.innerText = seconds.toString().padStart(2, '0');
    }

    if (countdownDays) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
});
