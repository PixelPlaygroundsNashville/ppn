document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    const loaderBar = preloader.querySelector('.loader-bar');
    if (preloader && loaderBar) {
        // Simulate loading
        let width = 0;
        const interval = setInterval(() => {
            width += Math.random() * 15; // Variable loading speed
            if (width >= 100) {
                width = 100;
                clearInterval(interval);
                setTimeout(() => {
                    document.body.classList.remove('loading');
                }, 300); // Short delay after bar full
            }
            loaderBar.style.width = width + '%';
        }, 100); // Update interval
    } else {
         document.body.classList.remove('loading'); // Failsafe if no preloader
    }

    // --- Hero Headline Typing Effect (Basic Example) ---
    // Requires a library like TypeIt for fancier effects, or more complex vanilla JS
    const headline = document.getElementById('main-headline');
    if (headline) {
        const text = "Pixel Playgrounds Nashville"; // Text to type
        let i = 0;
        headline.textContent = ''; // Clear initial content

        function typeWriter() {
            if (i < text.length) {
                headline.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100 + Math.random() * 50); // Typing speed variation
            } else {
                 headline.classList.add('typing-done'); // Hide cursor
            }
        }
        setTimeout(typeWriter, 700); // Start typing after slight delay
    }


    // --- Hero Background Canvas Animation (Example: Starfield) ---
    const canvas = document.getElementById('hero-background-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let stars = [];
        let canvasWidth, canvasHeight;

        function resizeCanvas() {
            canvasWidth = canvas.width = canvas.offsetWidth;
            canvasHeight = canvas.height = canvas.offsetHeight;
            stars = []; // Reset stars on resize
            createStars();
        }

        function createStars() {
            for (let i = 0; i < 200; i++) { // Number of stars
                stars.push({
                    x: Math.random() * canvasWidth,
                    y: Math.random() * canvasHeight,
                    radius: Math.random() * 1.5 + 0.5, // Star size
                    vx: Math.floor(Math.random() * 50) - 25, // Horizontal speed (not used here)
                    vy: Math.floor(Math.random() * 50) - 25  // Vertical speed (not used here)
                });
            }
        }

        function drawStars() {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.fillStyle = 'rgba(0, 255, 255, 0.5)'; // Cyan stars
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';

            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();

                // Simple movement (drift) - make more complex if desired
                star.y += star.radius * 0.05; // Slower drift for smaller stars
                if (star.y > canvasHeight + star.radius) { // Reset star if it goes off screen
                    star.y = 0 - star.radius;
                    star.x = Math.random() * canvasWidth;
                }
            });
        }

        function animateStars() {
            drawStars();
            requestAnimationFrame(animateStars);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); // Initial setup
        animateStars();
    }

    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, parseInt(delay));
                 observer.unobserve(entry.target); // Optional: stop observing once visible
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // --- Form Submission Handling (Formspree) ---
    const form = document.getElementById('consultation-form');
    const formStatus = document.getElementById('form-status');

    if (form && formStatus) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default HTML submission

            const formData = new FormData(form);
            formStatus.textContent = 'TRANSMITTING DATA... STANDBY...';
            formStatus.className = 'form-status-display visible sending'; // Show sending status

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Formspree needs this to reply with JSON
                    }
                });

                if (response.ok) {
                    formStatus.textContent = 'TRANSMISSION SUCCESSFUL // UPLINK ESTABLISHED. WE WILL RESPOND SHORTLY.';
                    formStatus.className = 'form-status-display visible success';
                    form.reset(); // Clear the form
                } else {
                    // Try to get error details from Formspree response
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        formStatus.textContent = `TRANSMISSION ERROR: ${data["errors"].map(error => error["message"]).join(", ")}`;
                    } else {
                        formStatus.textContent = 'TRANSMISSION ERROR // FAILED TO CONNECT TO GRID. PLEASE RETRY OR USE ALTERNATE COMMS.';
                    }
                     formStatus.className = 'form-status-display visible error';
                }
            } catch (error) {
                console.error('Form submission error:', error);
                formStatus.textContent = 'NETWORK ERROR // CONNECTION SEVERED. CHECK YOUR LINK AND RETRY.';
                 formStatus.className = 'form-status-display visible error';
            }
        });
    }

    // --- Footer Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

}); // End DOMContentLoaded