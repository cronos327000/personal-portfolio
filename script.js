/* -------------------------------------------------------------
 * SRI CHARAN PORTFOLIO - JAVASCRIPT LOGIC
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------------------------------
    // 1. DYNAMIC SILK CANVAS BACKGROUND ANIMATION
    // ---------------------------------------------------------
    const canvas = document.getElementById('silk-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const mouse = {
            x: width / 2, y: height / 2,
            targetX: width / 2, targetY: height / 2
        };

        window.addEventListener('mousemove', (e) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
        });

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        class SilkRibbon {
            constructor(y, amplitude, wavelength, speed, colorRGB, strokeCount) {
                this.y = y;
                this.amplitude = amplitude;
                this.wavelength = wavelength;
                this.speed = speed;
                this.phase = Math.random() * 100;
                this.colorRGB = colorRGB;
                this.strokeCount = strokeCount;
            }

            update() {
                this.phase += this.speed;
                mouse.x += (mouse.targetX - mouse.x) * 0.05;
                mouse.y += (mouse.targetY - mouse.y) * 0.05;
            }

            draw() {
                for (let i = 0; i < this.strokeCount; i++) {
                    ctx.beginPath();
                    const offsetFactor = (i - this.strokeCount / 2) * 2.5;

                    for (let x = 0; x <= width; x += 15) {
                        const angle = (x / this.wavelength) + this.phase;
                        let waveY = Math.sin(angle) * this.amplitude;
                        waveY += Math.sin(angle * 2.2 + this.phase * 0.4) * (this.amplitude * 0.25);

                        const distToMouse = Math.abs(x - mouse.x);
                        const influenceRange = 350;
                        if (distToMouse < influenceRange) {
                            const strength = (1 - distToMouse / influenceRange) * 0.2;
                            waveY += (mouse.y - this.y) * strength;
                        }

                        const yPos = this.y + waveY + (offsetFactor * Math.sin(angle + i * 0.08) * 2.5) + Math.sin(performance.now() * 0.0005) * 15;

                        if (x === 0) { ctx.moveTo(x, yPos); } else { ctx.lineTo(x, yPos); }
                    }

                    const opacity = (1 - Math.abs(i - this.strokeCount / 2) / (this.strokeCount / 2)) * 0.07;
                    ctx.strokeStyle = `rgba(${this.colorRGB}, ${opacity})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }
        }

        let ribbons = createRibbons(height);
        window.addEventListener('resize', () => { ribbons = createRibbons(height); });

        function createRibbons(h) {
            return [
                new SilkRibbon(h * 0.35, 60, 500, 0.002, '18, 30, 24', 28),
                new SilkRibbon(h * 0.5, 80, 700, -0.0015, '22, 34, 28', 24),
                new SilkRibbon(h * 0.65, 50, 400, 0.003, '38, 54, 46', 18),
                new SilkRibbon(h * 0.55, 30, 600, 0.001, '212, 175, 55', 8)
            ];
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            ribbons.forEach(ribbon => { ribbon.update(); ribbon.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ---------------------------------------------------------
    // 2. PREMIUM DUAL CUSTOM MOUSE CURSOR
    // ---------------------------------------------------------
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');

    if (cursor && follower) {
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        window.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        });

        function updateFollower() {
            followerX += (cursorX - followerX) * 0.12;
            followerY += (cursorY - followerY) * 0.12;
            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;
            requestAnimationFrame(updateFollower);
        }
        updateFollower();

        const interactiveElements = document.querySelectorAll('a, button, .btn-copy-email');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering-link'));
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering-link');
                setTimeout(() => document.body.classList.remove('hovering-link'), 50);
            });
        });
    }

    // ---------------------------------------------------------
    // 3. SCROLL REVEAL (INTERSECTION OBSERVER)
    // ---------------------------------------------------------
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => revealObserver.observe(el));

    // ---------------------------------------------------------
    // 4. NAVBAR SCROLL BEHAVIOR + BG/TEXT COLOUR TRANSITION
    // ---------------------------------------------------------
    const navbar = document.querySelector('.navbar');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) { navbar.classList.add('scrolled'); }
        else { navbar.classList.remove('scrolled'); }

        if (scrollIndicator) {
            const opacity = Math.max(0, 1 - window.scrollY / 250);
            scrollIndicator.style.opacity = opacity;
            scrollIndicator.style.pointerEvents = opacity === 0 ? 'none' : 'auto';
        }

        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = Math.min(window.scrollY / maxScroll, 1);

        const bgStart = [6, 9, 7], bgEnd = [255, 255, 255];
        const bgR = Math.round(bgStart[0] + (bgEnd[0] - bgStart[0]) * progress);
        const bgG = Math.round(bgStart[1] + (bgEnd[1] - bgStart[1]) * progress);
        const bgB = Math.round(bgStart[2] + (bgEnd[2] - bgStart[2]) * progress);
        document.documentElement.style.setProperty('--color-bg', `rgb(${bgR},${bgG},${bgB})`);

        const txtStart = [255, 255, 255], txtEnd = [6, 9, 7];
        const txtR = Math.round(txtStart[0] + (txtEnd[0] - txtStart[0]) * progress);
        const txtG = Math.round(txtStart[1] + (txtEnd[1] - txtStart[1]) * progress);
        const txtB = Math.round(txtStart[2] + (txtEnd[2] - txtStart[2]) * progress);
        document.documentElement.style.setProperty('--color-text-primary', `rgb(${txtR},${txtG},${txtB})`);
        document.documentElement.style.setProperty('--color-text-secondary', `rgb(${txtR},${txtG},${txtB})`);
    });

    // ---------------------------------------------------------
    // 5. MOBILE NAV TOGGLE
    // ---------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ---------------------------------------------------------
    // 6. COPY EMAIL TO CLIPBOARD
    // ---------------------------------------------------------
    const btnCopy = document.getElementById('btn-copy');
    const emailAddress = document.getElementById('email-address');
    const toastContainer = document.getElementById('toast-container');

    if (btnCopy && emailAddress && toastContainer) {
        const iconCopy = btnCopy.querySelector('.icon-copy');
        const iconCheck = btnCopy.querySelector('.icon-check');

        btnCopy.addEventListener('click', () => {
            navigator.clipboard.writeText(emailAddress.textContent.trim()).then(() => {
                iconCopy.classList.add('hidden');
                iconCheck.classList.remove('hidden');
                showToast('Email Copied to Clipboard');
                setTimeout(() => {
                    iconCopy.classList.remove('hidden');
                    iconCheck.classList.add('hidden');
                }, 2000);
            }).catch(() => showToast('Copy Failed. Please copy manually.'));
        });
    }

    // ---------------------------------------------------------
    // 7. FOOTER YEAR
    // ---------------------------------------------------------
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }

    // ---------------------------------------------------------
    // 8. HERO TITLE STAGGERED ANIMATION
    // ---------------------------------------------------------
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent.trim();
        heroTitle.innerHTML = '';
        text.split('').forEach((c, i) => {
            const span = document.createElement('span');
            span.textContent = c;
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            span.style.transition = `opacity 0.5s ease ${i * 0.05}s`;
            heroTitle.appendChild(span);
        });
        requestAnimationFrame(() => {
            heroTitle.querySelectorAll('span').forEach(s => s.style.opacity = '1');
        });
    }

    // ---------------------------------------------------------
    // 9. SMOOTH SCROLL
    // ---------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.getElementById(this.getAttribute('href').slice(1));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

    // ---------------------------------------------------------
    // TOAST UTILITY
    // ---------------------------------------------------------
    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'toast-out 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            toast.addEventListener('animationend', () => toast.remove());
        }, 3000);
    }
});