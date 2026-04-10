// =========================================
// Editable business details
// TODO: Replace these placeholders with the real business details.
// =========================================
const SITE_CONFIG = {
    businessName: "Velori Capture",
    businessNameFull: "Velori Capture Studio",
    email: "hello@veloricapture.com",
    phoneDisplay: "+27 71 234 5678",
    phoneHref: "+27712345678",
    // TODO: Replace with the real WhatsApp number in the format 277XXXXXXXXX
    whatsappNumber: "277XXXXXXXXX",
    serviceArea: "Johannesburg, South Africa",
    serviceAreaShort: "Johannesburg",
    responseTime: "Most enquiries receive a reply within one business day.",
    turnaround: "Preview images within 48 hours and polished final delivery within the agreed timeline.",
    social: {
        instagram: "https://www.instagram.com/",
        facebook: "https://www.facebook.com/"
    },
    canonicalBase: "https://www.veloricapture.com",
    whatsappPreview: "Hi Velori Capture Studio, I would like to enquire about availability for a photography booking."
};

// Initialize all shared site behaviors once the DOM is ready.
document.addEventListener("DOMContentLoaded", () => {
    hydrateSiteDetails();
    initializeCanonicalUrls();
    initializeStructuredData();
    initializeScrollProgress();
    initializeMenu();
    initializeBackToTop();
    initializeScrollButtons();
    initializeRevealAnimations();
    initializeParallaxMotion();
    initializeHeroImageRotation();
    initializeHeroWordRotation();
    initializeRotatingBlade();
    initializeWhatsAppPreview();
    initializeInlineWhatsAppPreview();
    initializeGalleryLightbox();
    initializeLiveFeatures();
    initializeStatCounters();
    initializeGalleryFilters();
    initializeContactForm();
});

// Write centralized business details into marked elements and links.
function hydrateSiteDetails() {
    document.querySelectorAll("[data-site-field]").forEach((element) => {
        const field = element.dataset.siteField;
        const value = field ? SITE_CONFIG[field] : "";

        if (typeof value === "string") {
            element.textContent = value;
        }
    });

    const linkMap = {
        email: `mailto:${SITE_CONFIG.email}`,
        phone: `tel:${SITE_CONFIG.phoneHref}`,
        whatsapp: buildWhatsAppLink(SITE_CONFIG.whatsappPreview),
        instagram: SITE_CONFIG.social.instagram,
        facebook: SITE_CONFIG.social.facebook
    };

    document.querySelectorAll("[data-site-link]").forEach((element) => {
        const linkKey = element.dataset.siteLink;
        const href = linkKey ? linkMap[linkKey] : "";

        if (href) {
            element.setAttribute("href", href);
        }
    });

    document.querySelectorAll(".floating-whatsapp").forEach((button) => {
        button.innerHTML = WHATSAPP_ICON;
    });
}

// Keep canonical and social URLs easy to update from one place.
function initializeCanonicalUrls() {
    const pagePath = document.body.dataset.pagePath || "/";
    const pageUrl = new URL(pagePath, SITE_CONFIG.canonicalBase).toString();

    document.querySelector('link[rel="canonical"]')?.setAttribute("href", pageUrl);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", pageUrl);
}

// Inject JSON-LD for a local photography business.
function initializeStructuredData() {
    const pageUrl = new URL(document.body.dataset.pagePath || "/", SITE_CONFIG.canonicalBase).toString();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: SITE_CONFIG.businessNameFull,
        image: "https://picsum.photos/seed/lumen-og-home/1200/630",
        url: pageUrl,
        telephone: SITE_CONFIG.phoneDisplay,
        email: SITE_CONFIG.email,
        areaServed: SITE_CONFIG.serviceArea,
        address: {
            "@type": "PostalAddress",
            addressLocality: SITE_CONFIG.serviceAreaShort,
            addressCountry: "ZA"
        },
        sameAs: [SITE_CONFIG.social.instagram, SITE_CONFIG.social.facebook],
        description: "Professional photography for weddings, portraits, events, and brands in Johannesburg."
    });

    document.head.append(script);
}

// Create and update the top-of-page reading progress bar.
function initializeScrollProgress() {
    if (!document.querySelector(".scroll-progress")) {
        const progress = document.createElement("div");
        progress.className = "scroll-progress";
        progress.innerHTML = '<div class="scroll-progress-bar" id="scroll-progress-bar"></div>';
        document.body.prepend(progress);
    }

    const bar = document.getElementById("scroll-progress-bar");

    if (!bar) {
        return;
    }

    const updateProgress = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
        bar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
}

// Handle the mobile navigation menu with keyboard and focus support.
function initializeMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!toggle || !navLinks) {
        return;
    }

    const focusableSelector = 'a, button, [tabindex]:not([tabindex="-1"])';
    let lastFocusedElement = null;

    const getFocusableItems = () => Array.from(navLinks.querySelectorAll(focusableSelector));

    const closeMenu = ({ restoreFocus = true } = {}) => {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("has-overlay-open");

        if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
            lastFocusedElement.focus();
        }
    };

    const openMenu = () => {
        lastFocusedElement = document.activeElement;
        navLinks.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("has-overlay-open");
        getFocusableItems()[0]?.focus();
    };

    toggle.addEventListener("click", () => {
        if (navLinks.classList.contains("open")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu({ restoreFocus: false });
        });
    });

    document.addEventListener("click", (event) => {
        if (!navLinks.classList.contains("open")) {
            return;
        }

        if (!navLinks.contains(event.target) && !toggle.contains(event.target)) {
            closeMenu({ restoreFocus: false });
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!navLinks.classList.contains("open")) {
            return;
        }

        if (event.key === "Escape") {
            closeMenu();
            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        const focusableItems = getFocusableItems();
        const firstItem = focusableItems[0];
        const lastItem = focusableItems[focusableItems.length - 1];

        if (!firstItem || !lastItem) {
            return;
        }

        if (event.shiftKey && document.activeElement === firstItem) {
            event.preventDefault();
            lastItem.focus();
        } else if (!event.shiftKey && document.activeElement === lastItem) {
            event.preventDefault();
            firstItem.focus();
        }
    });
}

// Show a floating return-to-top button after the user scrolls down.
function initializeBackToTop() {
    const button = document.getElementById("back-to-top");

    if (!button) {
        return;
    }

    const toggleVisibility = () => {
        if (window.scrollY > 360) {
            button.classList.add("show");
        } else {
            button.classList.remove("show");
        }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();

    button.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// Scroll to target sections from elements that declare a data-scroll-target.
function initializeScrollButtons() {
    const buttons = document.querySelectorAll("[data-scroll-target]");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-scroll-target");
            const target = targetId ? document.getElementById(targetId) : null;

            if (!target) {
                return;
            }

            const headerOffset = document.querySelector(".site-header")?.offsetHeight || 0;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset - 12;

            window.scrollTo({
                top: targetTop,
                behavior: "smooth"
            });
        });
    });
}

// Reveal marked elements as they enter the viewport.
function initializeRevealAnimations() {
    const elements = document.querySelectorAll(".reveal");

    if (!elements.length) {
        return;
    }

    elements.forEach((element, index) => {
        element.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
    });

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
    });

    elements.forEach((element) => observer.observe(element));
}

// Add subtle scroll-based movement to selected homepage elements.
function initializeParallaxMotion() {
    const backdrop = document.querySelector(".hero-backdrop");
    const pageHeroes = document.querySelectorAll(".page-hero");
    const visual = document.querySelector(".hero-visual");
    const livePanel = document.querySelector(".live-panel");

    if (!backdrop && !pageHeroes.length && !visual && !livePanel) {
        return;
    }

    const updateMotion = () => {
        const scrollY = window.scrollY;

        if (backdrop) {
            backdrop.style.setProperty("--hero-parallax-offset", `${Math.min(scrollY * 0.12, 56)}px`);
        }

        pageHeroes.forEach((hero) => {
            const heroTop = hero.offsetTop;
            const distance = window.scrollY - heroTop;
            const offset = Math.max(Math.min(distance * 0.08, 42), -18);
            hero.style.setProperty("--hero-parallax-offset", `${offset}px`);
        });

        if (visual) {
            visual.style.transform = `translateY(${Math.min(scrollY * 0.04, 18)}px)`;
        }

        if (livePanel) {
            livePanel.style.transform = `translateY(${Math.min(scrollY * 0.015, 10)}px)`;
        }
    };

    window.addEventListener("scroll", updateMotion, { passive: true });
    updateMotion();
}

// Rotate the main hero images with a soft fade while keeping the layered layout intact.
function initializeHeroImageRotation() {
    const rotatingImages = document.querySelectorAll('[data-rotating-image="true"]');

    if (!rotatingImages.length) {
        return;
    }

    rotatingImages.forEach((image, imageIndex) => {
        const slides = (image.dataset.rotationImages || "")
            .split(",")
            .map((entry) => entry.trim())
            .filter(Boolean)
            .map((entry) => {
                const [src, alt] = entry.split("|");

                return {
                    src: src?.trim() || "",
                    alt: alt?.trim() || "Hero image"
                };
            })
            .filter((slide) => slide.src);

        if (slides.length < 2) {
            return;
        }

        let currentIndex = 0;
        const interval = Number(image.dataset.rotationInterval || "6200") + (imageIndex * 220);

        window.setInterval(() => {
            image.classList.add("is-swapping");

            window.setTimeout(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                image.src = slides[currentIndex].src;
                image.alt = slides[currentIndex].alt;
                image.classList.remove("is-swapping");
            }, 620);
        }, interval);
    });
}

// Rotate highlighted hero words across all page hero sections.
function initializeHeroWordRotation() {
    const rotatingWords = document.querySelectorAll(".hero-rotating-word");

    if (!rotatingWords.length) {
        return;
    }

    rotatingWords.forEach((rotatingWord, elementIndex) => {
        const words = (rotatingWord.dataset.words || "")
            .split(",")
            .map((word) => capitalizeWord(word.trim()))
            .filter(Boolean);

        if (words.length < 2) {
            return;
        }

        // Reserve enough width for the longest word so the heading does not reflow while rotating.
        const longestWord = words.reduce((longest, word) => word.length > longest.length ? word : longest, words[0]);
        const measurement = document.createElement("span");
        measurement.textContent = longestWord;
        measurement.style.position = "absolute";
        measurement.style.visibility = "hidden";
        measurement.style.whiteSpace = "nowrap";
        measurement.style.font = window.getComputedStyle(rotatingWord).font;
        document.body.append(measurement);
        rotatingWord.style.width = `${Math.ceil(measurement.getBoundingClientRect().width)}px`;
        measurement.remove();

        let currentIndex = 0;

        window.setInterval(() => {
            rotatingWord.classList.add("is-changing");

            window.setTimeout(() => {
                currentIndex = (currentIndex + 1) % words.length;
                rotatingWord.textContent = words[currentIndex];
                rotatingWord.classList.remove("is-changing");
            }, 520);
        }, 3900 + (elementIndex * 260));
    });
}

// Only animate the homepage client-name blade while the trust section is in view.
function initializeRotatingBlade() {
    const blades = document.querySelectorAll("[data-rotating-blade]");

    if (!blades.length) {
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle("is-active", entry.isIntersecting);
        });
    }, {
        threshold: 0.35
    });

    blades.forEach((blade) => observer.observe(blade));
}

// Keep rotating hero words consistently title-cased in the UI.
function capitalizeWord(word) {
    if (!word) {
        return "";
    }

    return word.charAt(0).toUpperCase() + word.slice(1);
}

// Open the WhatsApp preview modal before leaving the site.
function initializeWhatsAppPreview() {
    const trigger = document.querySelector(".floating-whatsapp");
    const preview = document.getElementById("whatsapp-preview");

    if (!trigger || !preview) {
        return;
    }

    const dialog = preview.querySelector(".whatsapp-preview-card");
    const closeElements = preview.querySelectorAll("[data-close-whatsapp]");
    const focusableSelector = 'a, button, [tabindex]:not([tabindex="-1"])';
    let lastFocusedElement = null;

    const getFocusableItems = () => Array.from(dialog.querySelectorAll(focusableSelector));

    const closePreview = () => {
        preview.hidden = true;
        document.body.classList.remove("has-overlay-open");
        lastFocusedElement?.focus();
    };

    trigger.addEventListener("click", (event) => {
        event.preventDefault();
        lastFocusedElement = document.activeElement;
        preview.hidden = false;
        document.body.classList.add("has-overlay-open");
        getFocusableItems()[0]?.focus();
    });

    closeElements.forEach((element) => {
        element.addEventListener("click", closePreview);
    });

    preview.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closePreview();
            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        const focusableItems = getFocusableItems();
        const firstItem = focusableItems[0];
        const lastItem = focusableItems[focusableItems.length - 1];

        if (!firstItem || !lastItem) {
            return;
        }

        if (event.shiftKey && document.activeElement === firstItem) {
            event.preventDefault();
            lastItem.focus();
        } else if (!event.shiftKey && document.activeElement === lastItem) {
            event.preventDefault();
            firstItem.focus();
        }
    });
}

// Show a WhatsApp chat-style preview directly above the contact sidebar button.
function initializeInlineWhatsAppPreview() {
    const trigger = document.getElementById("contact-whatsapp-trigger");
    const preview = document.getElementById("contact-whatsapp-preview");

    if (!trigger || !preview) {
        return;
    }

    const closeButton = preview.querySelector("[data-close-inline-whatsapp]");

    const closePreview = ({ restoreFocus = true } = {}) => {
        preview.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
        trigger.classList.add("is-pulsing");

        if (restoreFocus) {
            trigger.focus();
        }
    };

    const openPreview = () => {
        preview.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
        trigger.classList.remove("is-pulsing");
        closeButton?.focus();
    };

    trigger.classList.add("is-pulsing");

    trigger.addEventListener("click", () => {
        if (preview.hidden) {
            openPreview();
        } else {
            closePreview();
        }
    });

    closeButton?.addEventListener("click", () => closePreview());

    document.addEventListener("click", (event) => {
        if (preview.hidden) {
            return;
        }

        if (!preview.contains(event.target) && !trigger.contains(event.target)) {
            closePreview({ restoreFocus: false });
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !preview.hidden) {
            closePreview();
        }
    });
}

// Open selected gallery items inside a lightbox dialog.
function initializeGalleryLightbox() {
    const lightbox = document.getElementById("gallery-lightbox");
    const image = document.getElementById("lightbox-image");
    const title = document.getElementById("lightbox-title");
    const category = document.getElementById("lightbox-category");
    const triggers = document.querySelectorAll(".gallery-shot-button");

    if (!lightbox || !image || !title || !category || !triggers.length) {
        return;
    }

    const dialog = lightbox.querySelector(".lightbox-dialog");
    const closeButton = lightbox.querySelector(".lightbox-close");
    const focusableSelector = 'button, [href], [tabindex]:not([tabindex="-1"])';
    let lastFocusedElement = null;

    const getFocusableItems = () => Array.from(dialog.querySelectorAll(focusableSelector));

    const closeLightbox = () => {
        lightbox.hidden = true;
        document.body.classList.remove("has-overlay-open");
        lastFocusedElement?.focus();
    };

    triggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            lastFocusedElement = document.activeElement;
            image.src = trigger.dataset.lightboxSrc || "";
            image.alt = trigger.dataset.lightboxTitle || "Gallery image";
            title.textContent = trigger.dataset.lightboxTitle || "";
            category.textContent = trigger.dataset.lightboxCategory || "";
            lightbox.hidden = false;
            document.body.classList.add("has-overlay-open");
            closeButton?.focus();
        });
    });

    lightbox.querySelectorAll("[data-close-lightbox]").forEach((element) => {
        element.addEventListener("click", closeLightbox);
    });

    lightbox.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeLightbox();
            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        const focusableItems = getFocusableItems();
        const firstItem = focusableItems[0];
        const lastItem = focusableItems[focusableItems.length - 1];

        if (!firstItem || !lastItem) {
            return;
        }

        if (event.shiftKey && document.activeElement === firstItem) {
            event.preventDefault();
            lastItem.focus();
        } else if (!event.shiftKey && document.activeElement === lastItem) {
            event.preventDefault();
            firstItem.focus();
        }
    });
}

// Keep only the Johannesburg clock where it appears naturally in the layout.
function initializeLiveFeatures() {
    const liveTime = document.getElementById("live-time");

    if (!liveTime) {
        return;
    }

    const updateLiveContent = () => {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-ZA", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Africa/Johannesburg"
        });

        liveTime.textContent = formatter.format(now);
    };

    updateLiveContent();
    window.setInterval(updateLiveContent, 30000);
}

// Animate hero stats once they enter view.
function initializeStatCounters() {
    const counters = document.querySelectorAll(".stat-number");

    if (!counters.length) {
        return;
    }

    const animateCounter = (counter) => {
        const target = Number(counter.dataset.target || "0");
        const suffix = counter.dataset.suffix || "";
        const duration = 1400;
        const startTime = performance.now();

        const step = (timestamp) => {
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * eased);

            counter.textContent = `${value}${suffix}`;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            animateCounter(entry.target);
            currentObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.6
    });

    counters.forEach((counter) => observer.observe(counter));
}

// Filter gallery items by the selected category button.
function initializeGalleryFilters() {
    const buttons = document.querySelectorAll(".gallery-filter-button");
    const items = document.querySelectorAll(".masonry-item[data-category]");

    if (!buttons.length || !items.length) {
        return;
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter || "all";

            buttons.forEach((item) => {
                item.classList.remove("active");
                item.setAttribute("aria-pressed", "false");
            });

            button.classList.add("active");
            button.setAttribute("aria-pressed", "true");

            items.forEach((item) => {
                const category = item.dataset.category || "";
                const showItem = filter === "all" || category === filter;

                item.classList.toggle("is-hidden", !showItem);
            });
        });
    });
}

// Validate the static contact form and leave a clear integration point for Formspree.
function initializeContactForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    const submitButton = document.getElementById("contact-submit");

    if (!form || !status || !submitButton) {
        return;
    }

    const fields = {
        name: {
            input: form.querySelector('[name="name"]'),
            error: document.getElementById("contact-name-error"),
            validate: (value) => value.trim().length >= 2 ? "" : "Please enter your name so we know how to address you."
        },
        email: {
            input: form.querySelector('[name="email"]'),
            error: document.getElementById("contact-email-error"),
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Please enter a valid email address."
        },
        phone: {
            input: form.querySelector('[name="phone"]'),
            error: document.getElementById("contact-phone-error"),
            validate: (value) => value.trim() === "" || value.trim().length >= 7 ? "" : "Please enter a fuller phone or WhatsApp number, or leave this blank."
        },
        service: {
            input: form.querySelector('[name="service"]'),
            error: document.getElementById("contact-service-error"),
            validate: (value) => value.trim() ? "" : "Please select the type of photography you need."
        },
        date: {
            input: form.querySelector('[name="date"]'),
            error: document.getElementById("contact-date-error"),
            validate: () => ""
        },
        message: {
            input: form.querySelector('[name="message"]'),
            error: document.getElementById("contact-message-error"),
            validate: (value) => value.trim().length >= 20 ? "" : "Please share a bit more detail so the reply can be genuinely helpful."
        }
    };

    const setFieldState = (fieldKey) => {
        const field = fields[fieldKey];

        if (!field?.input || !field.error) {
            return "";
        }

        const message = field.validate(field.input.value);
        const hasError = Boolean(message);

        field.error.textContent = message;
        field.input.classList.toggle("is-invalid", hasError);
        field.input.setAttribute("aria-invalid", String(hasError));

        return message;
    };

    Object.keys(fields).forEach((fieldKey) => {
        fields[fieldKey].input?.addEventListener("blur", () => setFieldState(fieldKey));
        fields[fieldKey].input?.addEventListener("input", () => {
            if (fields[fieldKey].input.classList.contains("is-invalid")) {
                setFieldState(fieldKey);
            }
        });
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const errors = Object.keys(fields)
            .map((fieldKey) => ({
                fieldKey,
                message: setFieldState(fieldKey)
            }))
            .filter((item) => item.message);

        if (errors.length) {
            status.className = "form-status is-error";
            status.textContent = "Please review the highlighted fields and try again.";
            fields[errors[0].fieldKey].input?.focus();
            return;
        }

        status.className = "form-status is-loading";
        status.textContent = "Preparing your enquiry...";
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        try {
            await new Promise((resolve) => window.setTimeout(resolve, 850));

            // TODO: Replace the simulated delay with a real Formspree request.
            // Example:
            // const endpoint = form.dataset.formspreeEndpoint;
            // const response = await fetch(endpoint, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(Object.fromEntries(new FormData(form)))
            // });
            // if (!response.ok) throw new Error("Form submission failed");

            status.className = "form-status is-success";
            status.textContent = "Thanks, your enquiry is ready. Connect the marked Formspree endpoint when you are ready to receive submissions.";
            form.reset();
            Object.keys(fields).forEach((fieldKey) => setFieldState(fieldKey));
        } catch (error) {
            status.className = "form-status is-error";
            status.textContent = "Something went wrong while preparing the enquiry. Please try again or use WhatsApp instead.";
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Send Enquiry";
        }
    });
}

// Build the WhatsApp URL from the central message config.
function buildWhatsAppLink(message) {
    return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

const WHATSAPP_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" fill="currentColor" aria-hidden="true">
  <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.73.244-1.088 0-.058 0-.144-.03-.215-.1-.172-2.434-1.39-2.678-1.39zm-2.908 7.593c-1.747 0-3.48-.53-4.942-1.49L7.793 24.41l1.132-3.337a8.955 8.955 0 0 1-1.72-5.272c0-4.955 4.04-8.995 8.997-8.995S25.2 10.845 25.2 15.8c0 4.958-4.04 8.998-8.998 8.998zm0-19.798c-5.96 0-10.8 4.842-10.8 10.8 0 1.964.53 3.898 1.546 5.574L5 27.176l5.974-1.92a10.807 10.807 0 0 0 16.03-9.455c0-5.958-4.842-10.8-10.802-10.8z"/>
</svg>`;
