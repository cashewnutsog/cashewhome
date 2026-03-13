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
    { id: 'HiXmtEVnWt8', title: 'Anagnorisis.', category: 'Chaotic Phonk' },
    { id: 'vJHsjimL_tc', title: 'Rainy Days.', category: 'LOFI, AMBIENT' },
    { id: 'd5ZTDFs_tuQ', title: 'Just Breathe.', category: 'RELAXING' },
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
        obj.innerText = (id === 'stat-views' ? current : current.toLocaleString()) + (hasPlus && current === endValue ? "+" : "");
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

let statsAnimated = false;

function updateStats() {
    const startDate = new Date('March 08, 2026 00:00:00').getTime();
    const now = new Date().getTime();
    const diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

    // Calculate values
    const subTarget = 23;
    const baseViews = 1110;
    const growthRate = 2.5;
    const viewsTarget = Math.floor(baseViews + (diffDays * growthRate));

    const baseVideos = 14;
    const startSaturday = new Date('March 14, 2026 17:30:00').getTime();
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
        document.getElementById('stat-views').innerText = viewsTarget.toString();
        document.getElementById('stat-videos').innerText = videosTarget.toString();
    }
}
setInterval(updateStats, 60000);
updateStats();

// Theme variables moved to top

// 1. Preloader and Video Sync Logic
let preloaderStartTime = Date.now();
const MIN_PRELOADER_TIME = 1200; // Reduced from 4000 to 1200ms

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
        }, 1000); // reduced from 2000 to match CSS transition
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
    { title: "Dark Pasts", img: "https://i.ibb.co/F4QhMTRB/dark-pasts.webp" },
    { title: "Entrance A", img: "https://i.ibb.co/7x1czjQ2/entrance-a.webp" },
    { title: "Entrance B", img: "https://i.ibb.co/gLZSVg1y/entrance-b.webp" },
    { title: "Funk de Tah Tah Tah", img: "https://i.ibb.co/nMJdh3sK/funk-de-tah-tah-tah.webp" },
    { title: "Ignition", img: "https://i.ibb.co/SDHHD1w5/ignition.webp" },
    { title: "Just Breathe", img: "https://i.ibb.co/DjFYt4d/Just-Breathe.png" },
    { title: "Quiet Chase", img: "https://i.ibb.co/ds2Qyxtv/quiet-chase.webp" },
    { title: "Rainy Days", img: "https://i.ibb.co/27NZ2xCC/Rainy-Days.png" },
    { title: "Serenity", img: "https://i.ibb.co/VpLX4sGB/serenity.webp" },
    { title: "Side A", img: "https://i.ibb.co/604ZGYHD/side-a.jpg" },
    { title: "Side B", img: "https://i.ibb.co/35Jc9cF7/side-b.jpg" },
    { title: "Sustainment", img: "https://i.ibb.co/Z1Tnj958/sustainment.webp" },
    { title: "Whelming", img: "https://i.ibb.co/MDb0KxFM/whelming.webp" }
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
        ? `<img src="${work.img}" alt="${work.title}" class="work-img" loading="lazy" decoding="async">`
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
    const mainWorksScene = document.getElementById('main-works-scene');
    if (!mainWorksScene) return;

    mainWorksScene.innerHTML = '';
    
    // Set the total number of items (--n) on the scene wrapper
    mainWorksScene.style.setProperty('--n', allWorks.length);

    const a3d = document.createElement('div');
    a3d.className = 'a3d';

    // Base card width in pixels (17.5em * 16px roughly, or just use a fixed px for calc)
    // To match CSS: var(--w) is 17.5em. On mobile, use a smaller value to bring cards closer.
    const isMobile = window.innerWidth <= 768;
    const wEms = isMobile ? 9 : 17.5;
    const paddingEms = isMobile ? 0.3 : 0.5;
    
    allWorks.forEach((work, index) => {
        const img = document.createElement('img');
        img.className = 'card';
        img.src = work.img;
        img.alt = work.title;
        img.loading = 'lazy';
        img.decoding = 'async';

        // Calculate translateZ in JS instead of CSS tan()
        const ba = (2 * Math.PI) / allWorks.length; // base angle in radians
        const translateZ = -1 * ((0.5 * wEms + paddingEms) / Math.tan(0.5 * ba));

        img.style.setProperty('--i', index);
        img.style.setProperty('--tz', `${translateZ}em`);
        img.style.setProperty('--w', `${wEms}em`);

        a3d.appendChild(img);
    });

    mainWorksScene.appendChild(a3d);
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
