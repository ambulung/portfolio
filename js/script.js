document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li a');

    const banners = document.querySelectorAll('.banner-card');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-button');

    const backToTopBtn = document.getElementById('backToTopBtn');

    // --- Mobile Nav Toggle ---
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');

        // Reset all animations first for consistency when opening/closing
        navLinks.forEach(link => link.style.animation = '');

        if (nav.classList.contains('nav-active')) {
            navLinks.forEach((link, index) => {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            });
        }

        burger.classList.toggle('toggle');
    });

    // Close nav when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default hash jump to allow smooth scroll

            const targetId = link.getAttribute('href').substring(1); // Remove the '#'
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }

            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(navLink => { // Use a different variable name for clarity
                    navLink.style.animation = ''; // Clear animations immediately on close
                });
            }
            
            // Set active class immediately after clicking a nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
        });
    });


    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('#specializations, #contact');
    const header = document.querySelector('header'); // Select header for dynamic height
    let headerHeight = header.offsetHeight; // Initial height

    // Update header height if it changes (e.g., due to responsiveness, though less common for fixed header)
    const updateHeaderHeight = () => {
        headerHeight = header.offsetHeight;
    };
    window.addEventListener('resize', updateHeaderHeight); // Update on resize

    const highlightNavLink = () => {
        let currentSectionId = '';

        // Calculate offset dynamically based on header height
        const offset = headerHeight + 50; // Add some extra padding

        sections.forEach(section => {
            const sectionTop = section.offsetTop - offset;
            const sectionBottom = sectionTop + section.clientHeight; // Changed to sectionBottom for clarity

            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === '#' + currentSectionId) { // Precise check
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink(); // Call on load


    // --- Modal Functionality ---
    banners.forEach(banner => {
        banner.addEventListener('click', () => {
            const modalId = banner.dataset.modalTarget;
            const modal = document.getElementById(modalId);
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        });
    });

    const closeModals = () => {
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.classList.remove('modal-open');
    };

    closeButtons.forEach(button => {
        button.addEventListener('click', closeModals);
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModals();
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModals();
        }
    });


    // --- Back to Top Button Functionality (Simplified as it's always visible in footer) ---
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Smooth scroll to the top
        });
    });

    // --- Ripple Button Functionality ---
    const rippleButtons = document.querySelectorAll('.has-ripple'); // Select all buttons with the 'has-ripple' class

    const RIPPLE_IN_DURATION = '250ms';
    const RIPPLE_OUT_DURATION = '250ms';

    rippleButtons.forEach(button => {
        const ripple = button.querySelector('.ripple');
        if (!ripple) return; // Skip if no ripple span found inside the button

        button.addEventListener('mouseenter', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Position the ripple at the mouse entry point
            ripple.style.left = `${x - 50}px`; // Adjust by half ripple width/height
            ripple.style.top = `${y - 50}px`;

            // Calculate scale to cover the entire button
            const radius = Math.sqrt(Math.max(x, rect.width - x) ** 2 + Math.max(y, rect.height - y) ** 2);
            const scale = (radius * 2) / 100; // 100 is ripple's base width/height

            // Reset and start ripple animation
            ripple.style.transition = 'none';
            ripple.style.transform = 'scale(0)';
            ripple.style.opacity = '1';
            ripple.offsetHeight; // Force reflow to apply 'none' transition immediately

            ripple.style.transition = `transform ${RIPPLE_IN_DURATION} ease-out, opacity ${RIPPLE_IN_DURATION} ease-out`;
            ripple.style.transform = `scale(${scale})`;

            // JS no longer controls the button's appearance (color/bg), CSS :hover does.
        });

        button.addEventListener('mouseleave', () => {
            ripple.style.transition = `transform ${RIPPLE_OUT_DURATION} ease-in, opacity ${RIPPLE_OUT_DURATION} ease-in`;
            ripple.style.transform = 'scale(0)';
            ripple.style.opacity = '0';

            // JS no longer controls the button's appearance (color/bg), CSS :hover does.
        });

        ripple.addEventListener('transitionend', (e) => {
            // Reset ripple only after it has fully faded out
            if (e.propertyName === 'opacity' && ripple.style.opacity === '0') {
                ripple.style.transition = 'none';
                ripple.style.transform = 'scale(0)';
                ripple.style.opacity = '1'; // Reset to opaque for next activation
                ripple.offsetHeight; // Force reflow
            }
        });
    });
});