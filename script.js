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
    const cards = document.querySelectorAll('.video-card');
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

    // Real Live Stats Logic
    function updateSarcasticStats() {
        const viewerCount = document.getElementById('live-viewers');
        const subscriberCount = document.getElementById('live-subscribers');
        const viewCount = document.getElementById('live-views');
        const videoCount = document.getElementById('live-videos');
        const caption = document.getElementById('sarcastic-caption');
        const API_KEY = 'AIzaSyAQe2ZCyWJsR2vU6ExMOZNeOImXlN3LoYY'; // IMPORTANT: RESTRICT THIS KEY IN GOOGLE CONSOLE TO YOUR DOMAIN
        const CHANNEL_ID = 'UCoFnJVSRPCkEOvkWhV7Iqhg';

        // Ensure all elements exist
        if (!viewerCount || !caption || !subscriberCount || !viewCount || !videoCount) {
            console.error("Stats elements missing!");
            return;
        }

        const sarcasticCaptions = [
            "Mom is watching...",
            "Viral in 2050",
            "Just you and me",
            "Refreshing...",
            "Algorithms hate this",
            "Bot traffic only",
            "Waiting for a miracle"
        ];

        // 1. Fetch Real Subscriber Count
        async function fetchRealStats() {
            if (API_KEY === 'YOUR_YOUTUBE_API_KEY') {
                console.warn("YouTube API key is missing. Showing default stats.");
                subscriberCount.innerText = "0.01K+";
                viewCount.innerText = "0.1M+";
                videoCount.innerText = "30+";
                return;
            }
            try {
                console.log("Fetching YouTube Stats...");
                const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}&t=${Date.now()}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("YouTube API Data:", data);

                if (data.items && data.items.length > 0) {
                    const stats = data.items[0].statistics;
                    subscriberCount.innerText = parseInt(stats.subscriberCount).toLocaleString();
                    viewCount.innerText = parseInt(stats.viewCount).toLocaleString();
                    videoCount.innerText = parseInt(stats.videoCount).toLocaleString();
                } else {
                    console.warn("No channel data found.");
                    subscriberCount.innerText = "N/A";
                    viewCount.innerText = "N/A";
                    videoCount.innerText = "N/A";
                }
            } catch (error) {
                console.error('Failed to fetch YouTube stats:', error);
                // Visual feedback for error
                subscriberCount.innerText = "Err";
                viewCount.innerText = "Err";
                videoCount.innerText = "Err";
                subscriberCount.title = "Check console for details";
            }
        }

        // Fetch immediately and then every minute
        fetchRealStats();
        setInterval(fetchRealStats, 60000);

        // Manual Refresh
        const refreshBtn = document.getElementById('refresh-stats');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                refreshBtn.style.transform = 'rotate(360deg)';
                fetchRealStats();
                setTimeout(() => { refreshBtn.style.transform = 'rotate(0deg)'; }, 500);
            });
        }

        // 2. Simulated Live Viewers (Still fake as API doesn't give realtime concurrent viewers for channel pages)
        // Update Viewers (Random 1-3) with glitch chance
        setInterval(() => {
            const isGlitch = Math.random() < 0.05; // 5% chance
            if (isGlitch) {
                viewerCount.innerText = "14,023";
                viewerCount.style.color = "#e74c3c"; // Red for glitch
                setTimeout(() => {
                    viewerCount.innerText = Math.floor(Math.random() * 3) + 1;
                    viewerCount.style.color = "#ffffff";
                }, 150);
            } else {
                viewerCount.innerText = Math.floor(Math.random() * 3) + 1;
            }
        }, 3000);

        // Update Caption (every 5s)
        setInterval(() => {
            const randomCaption = sarcasticCaptions[Math.floor(Math.random() * sarcasticCaptions.length)];
            caption.style.opacity = 0;
            setTimeout(() => {
                caption.innerText = randomCaption;
                caption.style.opacity = 1;
            }, 500);
        }, 5000);
    }

    updateSarcasticStats();
});
