// Disable browser scroll restoration to force start at top
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Initialize Lenis for smooth scrolling
const lenis = new Lenis()

// Sync Lenis with top position immediately
lenis.scrollTo(0, { immediate: true });

lenis.on('scroll', (e) => {
    if (e.velocity > 0.1 || e.velocity < -0.1) {
        document.body.classList.add('lenis-scrolling');
    } else {
        document.body.classList.remove('lenis-scrolling');
    }
});

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// Theme Toggle Initialization (Moved to top for faster response)
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        if (themeIcon) {
            themeIcon.src = isLight ? 'sun.png' : 'moon.png';
        }
    });
}

// Mobile Menu Logic
const menuTrigger = document.getElementById('mobile-menu-trigger');
const mobileMenu = document.querySelector('.mobile-menu');

if (menuTrigger && mobileMenu) {
    menuTrigger.addEventListener('click', () => {
        menuTrigger.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        if (mobileMenu.classList.contains('active')) {
            lenis.stop();
        } else {
            lenis.start();
        }
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            menuTrigger.classList.remove('active');
            mobileMenu.classList.remove('active');
            lenis.start();
        });
    });
}

// Video Slider Data
const videos = [
    { id: 'wItT37E6Zm8', title: 'Agathokakological. (Side B)', category: 'dark ambient' },
    { id: 'hlA-ra4Fh_U', title: 'Agathokakological. (Side A)', category: 'hiphop' },
    { id: 'QOexB8JSU2Q', title: 'QUIET CHASE', category: 'DANCE, DRUM' },
    { id: '4YniDV6ryFQ', title: 'FUNK DE TAH TAH TAH', category: 'BRAZILIAN PHONK' },
    { id: 'hFrG3wJ5uvo', title: 'DARK PASTS', category: 'EMOTIONAL, LAZY' },
    { id: '8v3s2oZ-Myc', title: 'IGNITION', category: 'QUIRKY, UPBEAT' },
    { id: 'iWr1nApKbhc', title: 'WHELMING', category: 'CHILL, LIGHT' },
    { id: 'H8WismzmucM', title: 'ENTRANCE (B)', category: 'SLOW DRIVING' },
    { id: '60NgjyN1CpU', title: 'ENTRANCE (A)', category: 'EXTREME RHYTHM' },
    { id: 'XQxIrALF79s', title: 'SUSTAINMENT,', category: 'ENERGETIC MOTIVATIONAL' },
    { id: 'ikBKo8DqiFo', title: 'SERENITY.', category: 'LOFI PHONK' }
];

let currentVideoIndex = 0;

function updateVideo(index) {
    const video = videos[index];
    document.getElementById('main-video-frame').src = `https://www.youtube.com/embed/${video.id}?rel=0`;
    document.getElementById('video-title').innerText = `${video.title}/ ${video.category}`.toUpperCase();
    document.getElementById('video-count').innerText = `PROJECT ${String(index + 1).padStart(3, '0')} / ${String(videos.length).padStart(3, '0')}`;
}

document.getElementById('prev-video').addEventListener('click', () => {
    currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
    updateVideo(currentVideoIndex);
});

document.getElementById('next-video').addEventListener('click', () => {
    currentVideoIndex = (currentVideoIndex + 1) % videos.length;
    updateVideo(currentVideoIndex);
});

// Video Slider Data (Previous Logic)
// ... already implemented above ...

// --- Ported Logic from Original Site ---

// 1. Release Countdown (Every Saturday at 5:30 PM)

function getNextReleaseTarget() {
    const now = new Date();

    // Target: Next Saturday at 5:30 PM
    const target = new Date();
    target.setHours(17, 30, 0, 0);
    const day = now.getDay();
    let daysUntilSaturday = (6 - day + 7) % 7;

    if (daysUntilSaturday === 0 && now.getTime() >= target.getTime()) {
        daysUntilSaturday = 7;
    }

    target.setDate(now.getDate() + daysUntilSaturday);
    return target.getTime();
}

let targetDate = getNextReleaseTarget();
function updateCountdown() {
    const now = new Date().getTime();
    let distance = targetDate - now;
    if (distance < 0) {
        targetDate = getNextReleaseTarget();
        distance = targetDate - now;
        updateStats(); // Trigger stats refresh when release happens
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
}
setInterval(updateCountdown, 1000);

// 2. Dynamic Stats logic
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;

    // Handle the "+" suffix if present in the target
    const hasPlus = end.toString().includes('+');
    const endValue = parseInt(end);

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (endValue - start) + start);
        obj.innerText = current.toLocaleString() + (hasPlus && current === endValue ? "+" : "");
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

let statsAnimated = false;

function updateStats() {
    const startDate = new Date('February 13, 2026 00:00:00').getTime();
    const now = new Date().getTime();
    const diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

    // Calculate values
    const subTarget = 23;
    const baseViews = 800;
    const growthRate = 2.5;
    const viewsTarget = Math.floor(baseViews + (diffDays * growthRate));

    const baseVideos = 11;
    const startSaturday = new Date('February 21, 2026 17:30:00').getTime();
    let extraVideos = 0;
    if (now >= startSaturday) {
        extraVideos = Math.floor((now - startSaturday) / (1000 * 60 * 60 * 24 * 7)) + 1;
    }
    const videosTarget = baseVideos + extraVideos;

    if (!statsAnimated) {
        // Observer to trigger animation
        const statsSection = document.querySelector('.milestones');
        if (statsSection) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    animateValue('stat-subscribers', 0, subTarget, 2000);
                    animateValue('stat-videos', 0, videosTarget, 2000);
                    animateValue('stat-views', 0, viewsTarget, 2000);
                    observer.unobserve(statsSection);
                }
            }, { threshold: 0.5 });
            observer.observe(statsSection);
        }
    } else {
        // Regular update if already animated
        document.getElementById('stat-subscribers').innerText = subTarget.toString();
        document.getElementById('stat-views').innerText = viewsTarget.toLocaleString();
        document.getElementById('stat-videos').innerText = videosTarget.toString();
    }
}
setInterval(updateStats, 60000);
updateStats();

// Theme variables moved to top

// 1. Preloader and Video Sync Logic
let preloaderStartTime = Date.now();
const MIN_PRELOADER_TIME = 4000; // 4 seconds = 2 full cycles of the 2s animation

function removePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const currentTime = Date.now();
    const elapsedTime = currentTime - preloaderStartTime;
    const remainingTime = Math.max(0, MIN_PRELOADER_TIME - elapsedTime);

    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.visibility = 'hidden';
            document.body.classList.remove('preloader-active');
        }, 2000); // Match CSS transition duration
    }, remainingTime);
}

// Global initialization
window.addEventListener('load', () => {
    // 1. Initialize first video details immediately to avoid blank states
    updateVideo(0);
    populateMainWorks();

    const mainVideoFrame = document.getElementById('main-video-frame');
    let videoLoaded = false;

    // 2. Wait for iframe to load
    mainVideoFrame.addEventListener('load', () => {
        if (!videoLoaded) {
            videoLoaded = true;
            removePreloader();
        }
    });

    // 3. Safety timeout: if video takes too long (> 8s), remove preloader anyway
    setTimeout(() => {
        if (!videoLoaded) {
            console.warn("Video load timeout - removing preloader");
            removePreloader();
        }
    }, 8000);
});

// 2. Search logic
const searchTrigger = document.getElementById('search-trigger');
const searchModal = document.getElementById('search-modal');
const closeSearch = document.getElementById('close-search');
const searchInput = document.getElementById('music-search');
const searchResults = document.getElementById('search-results');

const allWorks = [
    { title: "Agathokakological. (Side B)", id: "wItT37E6Zm8", img: "" },
    { title: "Agathokakological. (Side A)", id: "hlA-ra4Fh_U", img: "" },
    { title: "Quiet Chase.", id: "QOexB8JSU2Q", img: "quiet-chase.webp" },
    { title: "FUNK DE TAH TAH TAH", id: "4YniDV6ryFQ", img: "funk-de-tah-tah-tah.webp" },
    { title: "Dark Pasts.", id: "hFrG3wJ5uvo", img: "dark-pasts.webp" },
    { title: "Ignition.", id: "8v3s2oZ-Myc", img: "ignition.webp" },
    { title: "Whelming.", id: "iWr1nApKbhc", img: "whelming.webp" },
    { title: "Entrance (Side B).", id: "H8WismzmucM", img: "entrance-b.webp" },
    { title: "Entrance (Side A).", id: "60NgjyN1CpU", img: "entrance-a.webp" },
    { title: "Sustainment.", id: "XQxIrALF79s", img: "sustainment.webp" },
    { title: "Serenity.", id: "ikBKo8DqiFo", img: "serenity.webp" }
];

// Refactored Modal System
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
    document.body.classList.add('modal-open');
    lenis.stop();
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }, 500);
    lenis.start();
}

searchTrigger.addEventListener('click', () => {
    openModal('search-modal');
    searchInput.focus();
});

closeSearch.addEventListener('click', () => closeModal('search-modal'));

// Works Gallery Modal
const worksTrigger = document.getElementById('view-all-works');
const worksModal = document.getElementById('works-modal');
const closeWorksModal = document.getElementById('close-works-modal');
const worksGalleryGrid = document.getElementById('works-gallery-grid');


function createWorkCard(work) {
    const card = document.createElement('div');
    card.className = 'work-card';
    const imgHtml = work.img
        ? `<img src="${work.img}" alt="${work.title}" class="work-img">`
        : `<div class="hero-img-placeholder">PREVIEW UNAVAILABLE</div>`;

    card.innerHTML = `
        ${imgHtml}
        <div class="work-overlay">
            <h3>${work.title}</h3>
            <a href="https://www.youtube.com/embed/${work.id}" target="_blank">View Project ↗</a>
        </div>
    `;
    return card;
}

function populateMainWorks() {
    const mainWorksGrid = document.getElementById('main-works-grid');
    if (!mainWorksGrid) return;

    mainWorksGrid.innerHTML = '';
    // Show only the first 4 latest works
    allWorks.slice(0, 4).forEach(work => {
        mainWorksGrid.appendChild(createWorkCard(work));
    });
}

function populateWorksGallery() {
    worksGalleryGrid.innerHTML = '';
    // Show ALL 8 works in the gallery
    allWorks.forEach(work => {
        worksGalleryGrid.appendChild(createWorkCard(work));
    });
}

if (worksTrigger) {
    worksTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        populateWorksGallery();
        openModal('works-modal');
    });
}

closeWorksModal.addEventListener('click', () => closeModal('works-modal'));


searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    searchResults.innerHTML = '';

    if (query) {
        const filtered = allWorks.filter(work => work.title.toLowerCase().includes(query));
        filtered.forEach(work => {
            const item = document.createElement('a');
            item.className = 'search-result-item';
            item.href = `https://www.youtube.com/watch?v=${work.id}`;
            item.target = "_blank";
            item.innerText = work.title;
            searchResults.appendChild(item);
        });
    }
});

// Theme listener moved to top

// Original slider functions (keep updateVideo, currentVideoIndex, etc.)
// 4. Copy Email to Clipboard
const copyEmailBtn = document.getElementById('copy-email');
if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
        const email = copyEmailBtn.innerText;
        navigator.clipboard.writeText(email).then(() => {
            copyEmailBtn.classList.add('copied');
            setTimeout(() => {
                copyEmailBtn.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });
}
