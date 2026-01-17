$(document).ready(function () {
    // Shared settings and helpers (moved out so verification can reuse)
    const baseSettings = {
        infinite: true,                    // Infinite scroll loop
        speed: 8000,                       // SLOWER - 4000ms transition
        autoplay: true,                    // Auto-play enabled
        autoplaySpeed: 0,                  // Continuous motion (0 = no pause)
        cssEase: 'infinite',                 // Linear easing for consistent motion
        slidesToShow: 5,                   // Show 3 items
        slidesToScroll: 1,                 // Scroll 1 at a time
        arrows: false,                     // No nav arrows
        dots: false,                       // No dots
        pauseOnHover: true,                // PAUSE on hover - KEY FEATURE
        pauseOnFocus: false,
        swipeToSlide: false,               // Disable swipe
        swipe: false,                      // Disable swipe gestures
        draggable: false,                  // Disable drag
        touchMove: false,                  // Disable touch
        variableWidth: false,              // Fixed width
        useTransform: false,                // Use CSS transforms for smooth animation
        centerMode: false,
        waitForAnimate: false,
        adaptiveHeight: false,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 5, speed: 8000, autoplaySpeed: 0 } },
            { breakpoint: 992, settings: { slidesToShow: 2, speed: 5000, autoplaySpeed: 0 } },
            { breakpoint: 768, settings: { slidesToShow: 2, speed: 4000, autoplaySpeed: 0 } },
            { breakpoint: 576, settings: { slidesToShow: 1, speed: 3000, autoplaySpeed: 0 } }
        ]
    };

    function ensureMinSlides($slider, minSlides) {
        const $slides = $slider.find('.hype-slide');
        let count = $slides.length;
        if (count >= minSlides) return;
        let i = 0;
        while (count < minSlides) {
            const $clone = $slides.eq(i % $slides.length).clone(true);
            $slider.append($clone);
            count++;
            i++;
        }
    }

    // Guard to prevent double-initialization
    let hypeSlidersInitialized = false;

    // Initialize Hype List Marquee Sliders with Slick
    function initializeHypeSliders() {
        if (hypeSlidersInitialized) {
            return;
        }

        try {
            // Initialize Row 1 - RTL
            if ($('.hype-slider-1').length) {
                const slideCount1 = $('.hype-slider-1 .hype-slide').length;
                ensureMinSlides($('.hype-slider-1'), 15); // Ensure at least 15 slides for seamless loop
                const row1Settings = Object.assign({}, baseSettings, { rtl: true });
                $('.hype-slider-1').slick(row1Settings);
            }

            // Initialize Row 2 - LTR
            if ($('.hype-slider-2').length) {
                const slideCount2 = $('.hype-slider-2 .hype-slide').length;
                ensureMinSlides($('.hype-slider-2'), 15); // Ensure at least 15 slides for seamless loop
                const row2Settings = Object.assign({}, baseSettings, { rtl: false });
                $('.hype-slider-2').slick(row2Settings);
            }

            // Initialize Row 3 - RTL
            if ($('.hype-slider-3').length) {
                const slideCount3 = $('.hype-slider-3 .hype-slide').length;
                ensureMinSlides($('.hype-slider-3'), 15); // Ensure at least 15 slides for seamless loop
                const row3Settings = Object.assign({}, baseSettings, { rtl: true });
                $('.hype-slider-3').slick(row3Settings);
            }

            // Initialize Row 4 - LTR
            if ($('.hype-slider-4').length) {
                const slideCount4 = $('.hype-slider-4 .hype-slide').length;
                ensureMinSlides($('.hype-slider-4'), 15); // Ensure at least 15 slides for seamless loop
                const row4Settings = Object.assign({}, baseSettings, { rtl: false });
                $('.hype-slider-4').slick(row4Settings);
            }

            // Attach hover handlers after initialization
            setTimeout(attachHoverHandlers, 300);
            hypeSlidersInitialized = true;
        } catch (error) {
            console.error('❌ Error initializing SLICK sliders:', error);
        }
    }

    // Hover handlers function
    function attachHoverHandlers() {
        const $sliders = $('.hype-slider-1, .hype-slider-2, .hype-slider-3, .hype-slider-4');
        $sliders.on('mouseenter', function () {
            if ($(this).hasClass('slick-initialized')) {
                // Smooth deceleration stop (300ms ease-out)
                $(this).find('.slick-track').stop(true, false);
                $(this).slick('slickPause');
            }
        }).on('mouseleave', function () {
            if ($(this).hasClass('slick-initialized')) {
                $(this).slick('slickPlay');
            }
        });

        // Also handle hover on cards - SMOOTH response with gentle stop
        $('.hype-card').on('mouseenter', function (e) {
            e.stopPropagation();
            const $slider = $(this).closest('.hype-slider');
            if ($slider.hasClass('slick-initialized')) {
                // Smooth deceleration stop (300ms ease-out)
                $slider.find('.slick-track').stop(false, false).animate({}, 300, 'swing', function () {
                    $(this).stop();
                });
                $slider.slick('slickPause');
            }
        }).on('mouseleave', function (e) {
            e.stopPropagation();
            const $slider = $(this).closest('.hype-slider');
            if ($slider.hasClass('slick-initialized')) {
                $slider.slick('slickPlay');
            }
        });
    }

    // Initialize sliders when DOM is ready
    initializeHypeSliders();

    // Verify sliders are initialized; retry if any failed (helps when DOM structure or timing causes init to skip)
    function verifyAndFixSliders(retries = 3, delay = 300) {
        const sliders = [
            { sel: '.hype-slider-1', rtl: true },
            { sel: '.hype-slider-2', rtl: false },
            { sel: '.hype-slider-3', rtl: true },
            { sel: '.hype-slider-4', rtl: false }
        ];

        let attempt = 0;

        function checkOnce() {
            attempt++;
            let allOk = true;
            sliders.forEach(s => {
                const $el = $(s.sel);
                if (!$el.length) {
                    console.warn('Slider not found in DOM:', s.sel);
                    allOk = false;
                    return;
                }
                // log slide count
                const slideCount = $el.find('.hype-slide').length;

                if (!$el.hasClass('slick-initialized')) {
                    console.warn('Slider not initialized, forcing init:', s.sel);
                    // ensure minimum slides then initialize
                    try {
                        ensureMinSlides($el, 5);
                        $el.slick(Object.assign({}, baseSettings, { rtl: s.rtl }));

                    } catch (err) {
                        console.error('Forced init failed for', s.sel, err);
                        allOk = false;
                    }
                } else {
                    // If already initialized, ensure it is playing
                    try {
                        $el.slick('slickPlay');
                        $el.slick('setPosition');
                    } catch (err) {
                        console.warn('Error while playing/setting position for', s.sel, err);
                        allOk = false;
                    }
                }
            });

            if (!allOk && attempt < retries) {
                setTimeout(checkOnce, delay);
            } else if (!allOk) {
                console.error('verifyAndFixSliders: Some sliders failed to initialize after', attempt, 'attempts');
            } else {

            }
        }
        setTimeout(checkOnce, delay);
    }

    // run verification
    verifyAndFixSliders(4, 300);

    // Re-initialize sliders on window resize for responsive behavior
    let hypeResizeTimer;
    $(window).on('resize', function () {
        clearTimeout(hypeResizeTimer);
        hypeResizeTimer = setTimeout(function () {
            // Check if sliders are initialized before destroying
            if ($('.hype-slider-1').hasClass('slick-initialized')) {
                $('.hype-slider-1').slick('unslick');
            }
            if ($('.hype-slider-2').hasClass('slick-initialized')) {
                $('.hype-slider-2').slick('unslick');
            }
            if ($('.hype-slider-3').hasClass('slick-initialized')) {
                $('.hype-slider-3').slick('unslick');
            }
            if ($('.hype-slider-4').hasClass('slick-initialized')) {
                $('.hype-slider-4').slick('unslick');
            }
            // Re-initialize after a short delay
            // allow re-init after unslicking
            hypeSlidersInitialized = false;
            setTimeout(initializeHypeSliders, 100);
        }, 250);
    });

    // Hero Slick Slider Initialization
    const heroSlider = $('.hero-slider');
    if (heroSlider.length) {
        heroSlider.slick({
            dots: false,
            arrows: true,
            infinite: true,
            speed: 1500,
            fade: false,
            cssEase: 'ease-in-out',
            autoplay: true,
            autoplaySpeed: 4000,
            pauseOnHover: false,
            swipe: true,
            touchThreshold: 50,
            waitForAnimate: false,
            prevArrow: '<button type="button" class="slick-prev"><img src="./images/the-slick-left-arrow.svg" class="slider-arrow-icon" alt="Previous"></button>',
            nextArrow: '<button type="button" class="slick-next"><img src="./images/the-slick-right-arrow.svg" class="slider-arrow-icon" alt="Next"></button>'
        });

        // Add accessibility attributes
        heroSlider.attr('role', 'region');
        heroSlider.attr('aria-label', 'Hero image carousel');
        heroSlider.attr('aria-live', 'polite');

        // Update aria-hidden states on slide change
        heroSlider.on('afterChange', function (event, slick, currentSlide) {
            const slides = $(this).find('.slide');
            slides.each(function (index) {
                if (index === currentSlide) {
                    $(this).attr('aria-hidden', 'false');
                } else {
                    $(this).attr('aria-hidden', 'true');
                }
            });
        });

        // Initialize aria-hidden states
        heroSlider.find('.slide').each(function (index) {
            if (index === 0) {
                $(this).attr('aria-hidden', 'false');
            } else {
                $(this).attr('aria-hidden', 'true');
            }
        });

        // Performance optimization - pause when not visible
        let observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroSlider.slick('slickPlay');
                } else {
                    heroSlider.slick('slickPause');
                }
            });
        }, { threshold: 0.1 });
        observer.observe(heroSlider[0]);
    }

    // Themed Bundles Slider Initialization
    const themedBundlesSlider = $('.themed-bundles-slider');
    if (themedBundlesSlider.length) {
        themedBundlesSlider.slick({
            dots: false,
            arrows: true,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: false,
            swipe: true,
            touchThreshold: 50,
            waitForAnimate: false,
            prevArrow: '<button class="slick-prev"><img src="./images/the-slick-left-arrow.svg" class="slider-arrow-icon" alt="Previous"></button>',
            nextArrow: '<button class="slick-next"><img src="./images/the-slick-right-arrow.svg" class="slider-arrow-icon" alt="Next"></button>',
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });

        // Add accessibility attributes
        themedBundlesSlider.attr('role', 'region');
        themedBundlesSlider.attr('aria-label', 'Themed bundles product carousel');
        themedBundlesSlider.attr('aria-live', 'polite');

        // Update aria-hidden states on slide change
        themedBundlesSlider.on('afterChange', function (event, slick, currentSlide) {
            const slides = $(this).find('.slide');
            slides.each(function (index) {
                if (index >= currentSlide && index < currentSlide + slick.options.slidesToShow) {
                    $(this).attr('aria-hidden', 'false');
                } else {
                    $(this).attr('aria-hidden', 'true');
                }
            });
        });

        // Initialize aria-hidden states
        themedBundlesSlider.find('.slide').each(function (index) {
            if (index < 3) {
                $(this).attr('aria-hidden', 'false');
            } else {
                $(this).attr('aria-hidden', 'true');
            }
        });

        // Add aria-label to slider arrows
        themedBundlesSlider.find('.slick-prev').attr('aria-label', 'Previous themed bundles');
        themedBundlesSlider.find('.slick-next').attr('aria-label', 'Next themed bundles');

        // Add SVG arrow icons to slick prev/next buttons
        themedBundlesSlider.find('.slick-prev').html('<img src="./images/the-slick-left-arrow.svg" class="slider-arrow-icon" alt="Previous">');
        themedBundlesSlider.find('.slick-next').html('<img src="./images/the-slick-right-arrow.svg" class="slider-arrow-icon" alt="Next">');
    }

    // Button click handlers
    const browseButton = document.querySelector('.btn-hero');
    if (browseButton) {
        browseButton.addEventListener('click', function (e) {
            e.preventDefault();
            // Add navigation logic here
        });
    }

    // CTA button handlers for product cards
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const cardTitle = this.closest('.product-card').querySelector('.product-title').textContent;
            // Add navigation logic here
        });
    });

    // Tabbed Showcase Sliders Initialization
    const tabbedShowcaseSliders = {
        'first-look': null,
        'guest-experience': null,
        'on-ground-vibe': null,
        'gifting-suite': null,
        'fun-keepsakes': null
    };

    // Common slider configuration
    const sliderConfig = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        adaptiveHeight: false,
        touchThreshold: 15,
        prevArrow: '<button class="slick-prev"><img src="./images/the-slick-left-arrow.svg" class="slider-arrow-icon" alt="Previous"></button>',
        nextArrow: '<button class="slick-next"><img src="./images/the-slick-right-arrow.svg" class="slider-arrow-icon" alt="Next"></button>',
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    // Initialize slider function
    function initializeSlider(sliderClass) {
        const $slider = $(sliderClass);
        if ($slider.length && !$slider.hasClass('slick-initialized')) {
            $slider.slick(sliderConfig);

            // Add accessibility attributes
            $slider.attr('role', 'region');
            $slider.attr('aria-label', 'Product carousel');
            $slider.attr('aria-live', 'polite');

            // Update aria-hidden states on slide change
            $slider.on('afterChange', function (event, slick, currentSlide) {
                const slides = $(this).find('.slide');
                slides.each(function (index) {
                    if (index >= currentSlide && index < currentSlide + slick.options.slidesToShow) {
                        $(this).attr('aria-hidden', 'false');
                    } else {
                        $(this).attr('aria-hidden', 'true');
                    }
                });
            });

            // Initialize aria-hidden states
            $slider.find('.slide').each(function (index) {
                if (index < 4) {
                    $(this).attr('aria-hidden', 'false');
                } else {
                    $(this).attr('aria-hidden', 'true');
                }
            });

            // Add aria-label to slider arrows
            $slider.find('.slick-prev').attr('aria-label', 'Previous products');
            $slider.find('.slick-next').attr('aria-label', 'Next products');

            return $slider;
        }
    }

    // Initialize first tab slider on page load
    initializeSlider('.first-look-slider');

    // Tab change event handlers
    $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
        const targetTab = $(e.target).attr('data-bs-target');
        const tabId = targetTab.replace('#', '');

        // Initialize the slider for the newly active tab if not already initialized
        if (!tabbedShowcaseSliders[tabId]) {
            const sliderClass = '.' + tabId + '-slider';
            tabbedShowcaseSliders[tabId] = initializeSlider(sliderClass);
        }
        // Refresh the slider to ensure proper display
        if (tabbedShowcaseSliders[tabId]) {
            setTimeout(() => {
                tabbedShowcaseSliders[tabId].slick('refresh');
            }, 100);
        }
    });

    // Add click handlers for product cards in tabbed section
    $('.product-slider .product-card').on('click', function () {
        const cardTitle = $(this).find('.card-title-bar h4').text();

        // Add navigation logic here
    });

    // Mega Menu Elements

    const megaMenus = {
        'stationery': document.getElementById('stationery-mega-menu'),
        'decor': document.getElementById('decor-mega-menu'),
        'theme': document.getElementById('theme-mega-menu')
    };

    const navItems = {
        'stationery': document.getElementById('stationery-nav'),
        'decor': document.getElementById('decor-nav'),
        'theme': document.getElementById('theme-nav')
    };

    let menuTimeout;
    let isMobile = window.innerWidth <= 991.98;
    let activeMenu = null;

    // Function to check if device is mobile
    function checkMobile() {
        isMobile = window.innerWidth <= 991.98;
        if (!isMobile) {
            // Reset mobile menu states when resizing to desktop
            document.querySelectorAll('.mega-menu-heading').forEach(menu => {
                menu.classList.remove('active');
                const content = menu.nextElementSibling;
                if (content && content.classList.contains('list-unstyled')) {
                    content.style.display = '';
                }
            });
        }
    }

    // Show specific mega menu
    function showMegaMenu(menuId) {
        if (isMobile) return;

        // Hide any currently active menu
        if (activeMenu && activeMenu !== menuId) {
            hideMegaMenu(activeMenu);
        }

        clearTimeout(menuTimeout);
        megaMenus[menuId].classList.add('show');
        activeMenu = menuId;

        // Add active class to nav item
        navItems[menuId].classList.add('active');
    }

    // Hide specific mega menu
    function hideMegaMenu(menuId) {
        if (isMobile) return;

        menuTimeout = setTimeout(() => {
            if (megaMenus[menuId]) {
                megaMenus[menuId].classList.remove('show');

                // Remove active class from nav item
                if (navItems[menuId]) {
                    navItems[menuId].classList.remove('active');
                }

                if (activeMenu === menuId) {
                    activeMenu = null;
                }
            }
        }, 200);
    }

    // Initialize event listeners for each mega menu
    Object.keys(megaMenus).forEach(menuId => {
        const menu = megaMenus[menuId];
        const navItem = navItems[menuId];

        if (!menu || !navItem) return;

        // Desktop hover
        navItem.addEventListener('mouseenter', () => {
            showMegaMenu(menuId);
        });

        navItem.addEventListener('mouseleave', () => {
            hideMegaMenu(menuId);
        });

        // Keep menu open when hovering over it
        menu.addEventListener('mouseenter', () => {
            clearTimeout(menuTimeout);
            showMegaMenu(menuId);
        });

        menu.addEventListener('mouseleave', () => {
            hideMegaMenu(menuId);
        });

        // Mobile tap
        const navLink = navItem.querySelector('.nav-link');
        if (navLink) {
            navLink.addEventListener('click', (e) => {
                if (isMobile) {
                    e.preventDefault();
                    e.stopPropagation();
                    const isActive = menu.classList.contains('show');

                    // Close all mega menus
                    Object.values(megaMenus).forEach(m => {
                        if (m !== menu) {
                            m.classList.remove('show');
                        }
                    });

                    // Toggle current menu
                    if (isActive) {
                        menu.classList.remove('show');
                        navItem.classList.remove('active');
                        activeMenu = null;
                    } else {
                        menu.classList.add('show');
                        navItem.classList.add('active');
                        activeMenu = menuId;
                    }
                }
            });
        }
    });

    // Mobile accordion functionality
    const menuHeadings = document.querySelectorAll('.mega-menu-heading');

    menuHeadings.forEach(heading => {
        heading.addEventListener('click', function (e) {
            if (!isMobile) return;

            e.preventDefault();
            e.stopPropagation();

            this.classList.toggle('active');
            const content = this.nextElementSibling;

            if (this.classList.contains('active')) {
                content.style.display = 'block';
                content.style.animation = 'fadeIn 0.3s ease-in-out';
            } else {
                content.style.animation = 'fadeOut 0.3s ease-in-out';
                setTimeout(() => {
                    content.style.display = 'none';
                }, 200);
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.mega-menu') && !e.target.closest('.nav-item.dropdown')) {
            Object.keys(megaMenus).forEach(menuId => {
                hideMegaMenu(menuId);
            });
        }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            Object.keys(megaMenus).forEach(menuId => {
                hideMegaMenu(menuId);
            });
        }
    });

    // Handle window resize
    window.addEventListener('resize', function () {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(window.menuResizeTimer);
        window.menuResizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
            checkMobile();
        }, 400);
    });

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; max-height: 0; }
            to { opacity: 1; max-height: 1000px; }
        }
        @keyframes fadeOut {
            from { opacity: 1; max-height: 1000px; }
            to { opacity: 0; max-height: 0; }
        }
        .resize-animation-stopper * {
            animation: none !important;
            transition: none !important;
        }
    `;
    document.head.appendChild(style);

    // Initialize mobile state
    checkMobile();

    // ============================================
    // SEE IT IN ACTION SLIDER (Inspiration Grid)
    // ============================================

    // Convert inspiration grid to Slick slider for infinite scroll
    const inspirationSlider = $('.inspiration-slider');
    if (inspirationSlider.length) {
        inspirationSlider.slick({
            dots: false,
            arrows: true,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: true,
            prevArrow: '<button class="slick-prev inspiration-prev-btn"><img src="./images/the-slick-left-arrow.svg" class="slider-arrow-icon" alt="Previous"></button>',
            nextArrow: '<button class="slick-next inspiration-next-btn"><img src="./images/the-slick-right-arrow.svg" class="slider-arrow-icon" alt="Next"></button>',
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }

    // ============================================
    // REAL WEDDING INSPIRATION SLIDER
    // ============================================

    $('.real-wedding-slider').slick({
        autoplay: false,
        infinite: true,
        arrows: true,
        dots: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    // ============================================
    // DESIGNER SLIDER
    // ============================================

    // Initialize Designer Slider with Slick
    $('.designer-slider-container').slick({
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: $('.prev-arrow'),
        nextArrow: $('.next-arrow'),
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 4
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });

    // Add SVG arrow icons to testimonial slider buttons
    $('.prev-arrow').html('<img src="./images/the-slick-left-arrow.svg" class="slider-arrow-icon" alt="Previous">');
    $('.next-arrow').html('<img src="./images/the-slick-right-arrow.svg" class="slider-arrow-icon" alt="Next">');

    // ============================================
    // TESTIMONIALS SLIDER
    // ============================================

    // Initialize Testimonials Slider
    const testimonialsSlider = $('.testimonials-slider');
    if (testimonialsSlider.length) {
        testimonialsSlider.slick({
            autoplay: false,
            infinite: true,
            arrows: true,
            dots: false,
            speed: 500,
            slidesToShow: 2,
            slidesToScroll: 1,
            prevArrow: $('.testimonial-prev'),
            nextArrow: $('.testimonial-next'),
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });

        // Add SVG arrow icons to testimonial slider buttons
        $('.testimonial-prev').html('<img src="./images/the-slick-left-arrow.svg" class="slider-arrow-icon" alt="Previous">');
        $('.testimonial-next').html('<img src="./images/the-slick-right-arrow.svg" class="slider-arrow-icon" alt="Next">');

        // Add accessibility attributes
        testimonialsSlider.attr('role', 'region');
        testimonialsSlider.attr('aria-label', 'Customer testimonials carousel');
        testimonialsSlider.attr('aria-live', 'polite');
    }
});




document.addEventListener('DOMContentLoaded', function () {
    const openVideoButtons = document.getElementsByClassName('openVideoButton');
    const closeVideoButton = document.getElementById('closeVideoButton');
    const videoPopup = document.getElementById('videoPopup');
    const youtubeVideo = document.getElementById('youtubeVideo');

    // Loop through all elements with class "openVideoButton"
    Array.from(openVideoButtons).forEach(button => {
        button.addEventListener('click', function () {
            videoPopup.style.display = 'flex';
        });
    });

    closeVideoButton.addEventListener('click', function () {
        videoPopup.style.display = 'none';
        youtubeVideo.src = youtubeVideo.src; // Stop video
    });

    videoPopup.addEventListener('click', function (event) {
        if (event.target === videoPopup) {
            videoPopup.style.display = 'none';
            youtubeVideo.src = youtubeVideo.src;  // Stop video
        }
    });
});








document.addEventListener('DOMContentLoaded', function () {
  new Splide('.slider-1', {
    type   : 'loop',
    drag   : 'free',
    focus  : 'center',
    perPage: 5,
    gap    : '0rem', // same effect as margin-right: 2rem between slides

    autoScroll: {
      speed: 1,
    },

    // Responsive breakpoints
    breakpoints: {
      1200: {
        perPage: 4,
        gap: '1.5rem',
      },
      992: {
        perPage: 3,
        gap: '1.5rem',
      },
      768: {
        perPage: 2,
        gap: '1rem',
      },
      576: {
        perPage: 1,
        gap: '0.75rem',
      },
    },
  }).mount(window.splide.Extensions);
});



document.addEventListener('DOMContentLoaded', function () {
  new Splide('.slider-2', {
    type   : 'loop',
    drag   : 'free',
    focus  : 'center',
    perPage: 5,
    gap    : '0rem', // same effect as margin-right: 2rem between slides

    autoScroll: {
      speed: -1,
    },

    // Responsive breakpoints
    breakpoints: {
      1200: {
        perPage: 4,
        gap: '1.5rem',
      },
      992: {
        perPage: 3,
        gap: '1.5rem',
      },
      768: {
        perPage: 2,
        gap: '1rem',
      },
      576: {
        perPage: 1,
        gap: '0.75rem',
      },
    },
  }).mount(window.splide.Extensions);
});


document.addEventListener('DOMContentLoaded', function () {
  new Splide('.slider-3', {
    type   : 'loop',
    drag   : 'free',
    focus  : 'center',
    perPage: 5,
    gap    : '0rem', // same effect as margin-right: 2rem between slides

    autoScroll: {
      speed: 1,
    },

    // Responsive breakpoints
    breakpoints: {
      1200: {
        perPage: 4,
        gap: '1.5rem',
      },
      992: {
        perPage: 3,
        gap: '1.5rem',
      },
      768: {
        perPage: 2,
        gap: '1rem',
      },
      576: {
        perPage: 1,
        gap: '0.75rem',
      },
    },
  }).mount(window.splide.Extensions);
});


document.addEventListener('DOMContentLoaded', function () {
  new Splide('.slider-4', {
    type   : 'loop',
    drag   : 'free',
    focus  : 'center',
    perPage: 5,
    gap    : '0rem', // same effect as margin-right: 2rem between slides

    autoScroll: {
      speed: -1,
    },

    // Responsive breakpoints
    breakpoints: {
      1200: {
        perPage: 4,
        gap: '1.5rem',
      },
      992: {
        perPage: 3,
        gap: '1.5rem',
      },
      768: {
        perPage: 2,
        gap: '1rem',
      },
      576: {
        perPage: 1,
        gap: '0.75rem',
      },
    },
  }).mount(window.splide.Extensions);
});