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
        
        // Track mouse coords for wave distortion
        const mouse = {
            x: width / 2,
            y: height / 2,
            targetX: width / 2,
            targetY: height / 2
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
                this.colorRGB = colorRGB; // Format: "R, G, B"
                this.strokeCount = strokeCount;
            }
            
            update() {
                this.phase += this.speed;
                // Lerp mouse coordinates
                mouse.x += (mouse.targetX - mouse.x) * 0.05;
                mouse.y += (mouse.targetY - mouse.y) * 0.05;
            }
            
            draw() {
                for (let i = 0; i < this.strokeCount; i++) {
                    ctx.beginPath();
                    
                    // Bundle parallel bezier curves to mimic satin threads
                    const offsetFactor = (i - this.strokeCount / 2) * 2.5;
                    
                    for (let x = 0; x <= width; x += 15) {
                        const angle = (x / this.wavelength) + this.phase;
                        
                        // Overlay standard sine wave + minor harmonic for organic folding
                        let waveY = Math.sin(angle) * this.amplitude;
                        waveY += Math.sin(angle * 2.2 + this.phase * 0.4) * (this.amplitude * 0.25);
                        
                        // Add mouse proximity distortion
                        const distToMouse = Math.abs(x - mouse.x);
                        const influenceRange = 350;
                        if (distToMouse < influenceRange) {
                            const strength = (1 - distToMouse / influenceRange) * 0.2;
                            waveY += (mouse.y - this.y) * strength;
                        }
                        
                        // Calculate final Y position for this segment with scroll-parallax
                        const yPos = this.y + waveY + (offsetFactor * Math.sin(angle + i * 0.08) * 2.5) - (window.scrollY * 0.12);
                        
                        if (x === 0) {
                            ctx.moveTo(x, yPos);
                        } else {
                            ctx.lineTo(x, yPos);
                        }
                    }
                    
                    // Exponential transparency falloff for outer strokes
                    const opacity = (1 - Math.abs(i - this.strokeCount / 2) / (this.strokeCount / 2)) * 0.07;
                    ctx.strokeStyle = `rgba(${this.colorRGB}, ${opacity})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }
        }
        
        // Setup ribbons matching the dark emerald/sage and gold luxury styling
        let ribbons = createRibbons(height);
        
        window.addEventListener('resize', () => {
            ribbons = createRibbons(height);
        });
        
        function createRibbons(h) {
            return [
                new SilkRibbon(h * 0.35, 60, 500, 0.002, '18, 30, 24', 28),     // Emerald-Obsidian
                new SilkRibbon(h * 0.5, 80, 700, -0.0015, '22, 34, 28', 24),    // Dark Forest Green
                new SilkRibbon(h * 0.65, 50, 400, 0.003, '38, 54, 46', 18),     // Accent Sage Green
                new SilkRibbon(h * 0.55, 30, 600, 0.001, '212, 175, 55', 8)     // Very thin subtle luxury Gold
            ];
        }
        
        function animate() {
            // Semi-transparent clears create a subtle motion trails effect
            ctx.fillStyle = 'rgba(6, 9, 7, 0.2)';
            ctx.fillRect(0, 0, width, height);
            
            ribbons.forEach(ribbon => {
                ribbon.update();
                ribbon.draw();
            });
            
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
            // Apply easing / interpolation
            followerX += (cursorX - followerX) * 0.12;
            followerY += (cursorY - followerY) * 0.12;
            
            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;
            
            requestAnimationFrame(updateFollower);
        }
        updateFollower();
        
        // Link hovers to change cursor state
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .btn-copy-email');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering-link');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.add('hovering-link');
                // Timeout to smooth exit transition
                setTimeout(() => {
                    document.body.classList.remove('hovering-link');
                }, 50);
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
                // Unobserve once dynamic element enters screen
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(el => revealObserver.observe(el));

    // ---------------------------------------------------------
    // 4. NAVBAR & UTILITIES SCROLL BEHAVIOR
    // ---------------------------------------------------------
    const navbar = document.querySelector('.navbar');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        if (scrollIndicator) {
            const opacity = Math.max(0, 1 - window.scrollY / 250);
            scrollIndicator.style.opacity = opacity;
            if (opacity === 0) {
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }
    });

    // ---------------------------------------------------------
    // 5. MOBILE NAV MENU TOGGLE
    // ---------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Auto-close when clicking any link
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ---------------------------------------------------------
    // 6. COPY TO CLIPBOARD EMAIL UTILITY
    // ---------------------------------------------------------
    const btnCopy = document.getElementById('btn-copy');
    const emailAddress = document.getElementById('email-address');
    const toastContainer = document.getElementById('toast-container');
    
    if (btnCopy && emailAddress && toastContainer) {
        const iconCopy = btnCopy.querySelector('.icon-copy');
        const iconCheck = btnCopy.querySelector('.icon-check');
        
        btnCopy.addEventListener('click', () => {
            const textToCopy = emailAddress.textContent.trim();
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Toggle action icons
                iconCopy.classList.add('hidden');
                iconCheck.classList.remove('hidden');
                
                // Show notification toast
                showToast('Email Copied to Clipboard');
                
                // Reset state
                setTimeout(() => {
                    iconCopy.classList.remove('hidden');
                    iconCheck.classList.add('hidden');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                showToast('Copy Failed. Please copy manually.');
            });
        });
        
        function showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = message;
            
            toastContainer.appendChild(toast);
            
            // Remove toast after animation finishes
            setTimeout(() => {
                toast.style.animation = 'toast-out 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
                toast.addEventListener('animationend', () => {
                    toast.remove();
                });
            }, 3000);
        }
    }

    // ---------------------------------------------------------
    // 7. FOOTER YEAR UPDATE
    // ---------------------------------------------------------
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
