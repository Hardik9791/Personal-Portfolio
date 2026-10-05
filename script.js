class PortfolioApp {
    constructor() {
        this.projects = [
            {
                title: 'AWS Static Website Hosting',
                description: 'Deployed a scalable static website hosted on AWS with S3, Route 53, ACM, and CloudFront.',
                link: 'https://hardikaws.online',
                github: 'https://github.com/Hardik9791/my-resume-on-AWS/blob/main/Project%20Documentation.pdf',
                image: 'Project Diagram.png',
                tech: ['AWS S3', 'Route 53', 'CloudFront', 'ACM'],
            },
            {
                title: 'AWS Serverless Application',
                description: 'Built a serverless web application on AWS with S3, API Gateway, Lambda, and DynamoDB.',
                link: 'https://medium.com/@cloud.hardikrathod/how-to-build-a-serverless-web-application-using-aws-efeb164d6962',
                github: 'https://github.com/Hardik9791/Serverless-Web-App-using-AWS/blob/main/Project%20Documentation.pdf',
                image: 'Serverless Application on AWS.gif',
                tech: ['AWS S3', 'API Gateway', 'Lambda', 'DynamoDB'],
            },
            {
                title: 'AWS Based CICD Pipeline',
                description: 'Built a CICD Pipeline on AWS with S3, CodePipeline, CodeBuild, and CodeDeploy.',
                link: '',
                github: 'https://github.com/Hardik9791/Serverless-CICD/blob/main/Project%20Documentation%20.pdf',
                image: 'CICD Pipeline.gif',
                tech: ['AWS S3', 'CodePipeline', 'CodeBuild', 'CodeDeploy'],
            },
            {
                title: 'AWS  Disaster Recovery',
                description: 'Implemented a backup and disaster recovery solution for data availibility using AWS Backup.',
                link: '',
                github: 'https://github.com/Hardik9791/Disaster-Recovery-on-AWS',
                image: 'DR.png',
                tech: ['AWS Backup','AWS S3', 'Amazon EC2', 'Amazon RDS'],
            },
        ];

        this.dependencies = { gsap, ScrollTrigger };
        this.selectors = {
            preloader: '#preloader',
            projectContainer: '#project-container',
            sections: 'section[id]',
            navLinks: '.nav-links a:not([href="#"])', // Ensure this matches your HTML
            skills: '.skill',
            modal: '#myModal',
            modalContent: '.modal-content',
            modalImg: '#modal-img',
            modalCaption: '#modal-caption',
            closeBtn: '.close',
            form: '#contact-form',
            scrollTop: '#scroll-top',
            backToTop: '.back-to-top',
            themeToggle: '#theme-toggle',
            typewriter: '.typewriter',
        };
    }

    async init() {
        emailjs.init('Fbwy_q2acxNCyfNbN');
        try {
            this.validateDependencies();
            this.dependencies.gsap.registerPlugin(this.dependencies.ScrollTrigger);
            this.showPreloader();
            await Promise.all([
                this.setupProjects(),
                this.setupNavigation(),
                this.setupAnimations(),
                this.setupTypewriter(),
                this.setupModal(),
                this.setupForm(),
                this.setupScrollToTop(),
                this.setupBackToTop(),
                this.setupThemeToggle(),
                this.setupAnalytics(),
                this.setupCloudAnimation(), // New cloud animation
                this.setupExploreButton(),
                this.setupMobileNav(),
            ]);
            this.setInitialActiveLink();
            this.hidePreloader();
            console.log('Portfolio initialized successfully');
        } catch (error) {
            console.error('Initialization failed:', error);
            this.showFallbackMessage();
        }
    }

    validateDependencies() {
        Object.entries(this.dependencies).forEach(([name, lib]) => {
            if (typeof lib === 'undefined') throw new Error(`${name} not loaded.`);
        });
    }

    showPreloader() {
        const preloader = document.querySelector(this.selectors.preloader);
        if (preloader) preloader.style.display = 'flex';
    }

    hidePreloader() {
        const preloader = document.querySelector(this.selectors.preloader);
        if (preloader) {
            this.dependencies.gsap.to(preloader, {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out',
                onComplete: () => preloader.style.display = 'none',
            });
        }
    }

    showFallbackMessage() {
        document.body.innerHTML = '<div class="error">Portfolio failed to load. Please refresh.</div>';
    }

    async setupProjects() {
        const container = document.querySelector(this.selectors.projectContainer);
        if (!container) return;

        const projects = await this.fetchProjects();
        projects.forEach((project, index) => {
            const card = this.createElement('div', { class: 'project-card', 'data-index': index, role: 'listitem' });
            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="tech-stack">${project.tech.map(t => `<span>${t}</span>`).join('')}</div>
                <div class="project-links">
                    ${project.link === ''?'': `<a href="${project.link}" target="_blank" class="btn" rel="noopener noreferrer">View Project</a>`}
                    <a href="${project.github}" target="_blank" class="btn secondary" rel="noopener noreferrer">GitHub</a>
                </div>
            `;
            card.querySelector('img').addEventListener('click', () => this.openModal(project.image, project.title));
            container.appendChild(card);
        });
    }

    async fetchProjects() {
        return new Promise(resolve => setTimeout(() => resolve(this.projects), 500));
    }

    setupExploreButton() {
        const exploreBtn = document.querySelector('.hero .btn[href="#projects"]');
        if (!exploreBtn) return;
    
        exploreBtn.addEventListener('click', e => {
            e.preventDefault();
            this.smoothScrollTo('projects');
        });
    }

    setupNavigation() {
        const sections = document.querySelectorAll(this.selectors.sections);
        const navLinks = document.querySelectorAll(this.selectors.navLinks);

        if (!sections.length || !navLinks.length) {
            console.warn('Navigation elements missing:', { sections: sections.length, navLinks: navLinks.length });
            return;
        }

        navLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                console.log('Nav clicked:', targetId); // Debug log to confirm click
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    this.smoothScrollTo(targetId);
                } else {
                    console.error(`Section "${targetId}" not found`);
                    alert('Section not found.');
                }
            });
        });

        sections.forEach(section => {
            this.dependencies.ScrollTrigger.create({
                trigger: section,
                start: 'top 20%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse',
                onEnter: () => this.updateActiveNav(section.id),
                onEnterBack: () => this.updateActiveNav(section.id),
            });
        });
    }

    updateActiveNav(sectionId) {
        document.querySelectorAll(this.selectors.navLinks).forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
    }

    smoothScrollTo(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;

        this.dependencies.gsap.to(window, {
            scrollTo: { y: target, offsetY: 50 },
            duration: 1.2,
            ease: 'power3.out',
            onComplete: () => this.updateActiveNav(targetId),
        });
    }

    setInitialActiveLink() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            this.smoothScrollTo(hash);
            return;
        }

        const sections = document.querySelectorAll(this.selectors.sections);
        const scrollPos = window.scrollY + window.innerHeight / 2;
        for (const section of sections) {
            const { top, bottom } = section.getBoundingClientRect();
            const sectionTop = top + window.scrollY;
            const sectionBottom = bottom + window.scrollY;
            if (scrollPos >= sectionTop && scrollPos <= sectionBottom) {
                this.updateActiveNav(section.id);
                break;
            }
        }
    }

    setupMobileNav() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        if (!hamburger || !navLinks) return;
    
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    setupAnimations() {
        const { gsap } = this.dependencies;

        // Enhanced Hero Animation
        const heroTl = gsap.timeline();
        heroTl
            .from('.hero h1', { opacity: 0, y: -70, duration: 1.2, ease: 'power4.out' })
            .from('.typewriter', { opacity: 0, x: -50, duration: 1, ease: 'power3.out' }, '-=0.5')
            .from('.social-icons a', { opacity: 0, scale: 0.5, stagger: 0.2, duration: 0.8, ease: 'elastic.out(1, 0.5)' }, '-=0.6')
            .from('.hero .btn, .social-icons .contact-icon', { opacity: 0, y: 30, stagger: 0.25, duration: 1, ease: 'power4.out' }, '-=0.5');

        // Section Animations
        document.querySelectorAll(this.selectors.sections).forEach(section => {
            gsap.from(section.querySelectorAll('.container > *'), {
                opacity: 0,
                y: 50,
                stagger: 0.2,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    toggleActions: 'play none none reset',
                },
            });
        });
    

        document.querySelectorAll(this.selectors.skills).forEach(skill => {
            skill.addEventListener('mouseenter', () => gsap.to(skill, { scale: 1.1, duration: 0.3, ease: 'power3.out' }));
            skill.addEventListener('mouseleave', () => gsap.to(skill, { scale: 1, duration: 0.3, ease: 'power3.out' }));
        });
    }

    setupCloudAnimation() {
        const { gsap } = this.dependencies;
        const clouds = document.createElement('div');
        clouds.className = 'clouds';
        document.body.appendChild(clouds);

        for (let i = 0; i < 5; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.width = `${Math.random() * 200 + 100}px`;
            cloud.style.height = `${Math.random() * 60 + 40}px`;
            cloud.style.background = 'rgba(255, 255, 255, 0.3)';
            cloud.style.borderRadius = '50%';
            cloud.style.position = 'absolute';
            cloud.style.top = `${Math.random() * 80}vh`;
            cloud.style.left = `${Math.random() * 100}vw`;
            clouds.appendChild(cloud);

            gsap.to(cloud, {
                x: '+=200',
                duration: Math.random() * 20 + 10,
                repeat: -1,
                yoyo: true,
                ease: 'linear',
            });
        }
    }

    setupTypewriter() {
        const el = document.querySelector(this.selectors.typewriter);
        if (!el) return;

        const text = el.textContent;
        el.textContent = '';
        let i = 0;
        const type = () => {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(type, 100);
            }
        };
        setTimeout(type, 1000);
    }

    setupModal() {
        const { modal, modalContent, modalImg, modalCaption, closeBtn } = this.getModalElements();
        if (!modal) return;

        this.openModal = (imgSrc, caption) => {
            modal.style.display = 'flex';
            modalImg.src = imgSrc;
            modalCaption.textContent = caption;
            modal.setAttribute('aria-hidden', 'false');
            this.dependencies.gsap.fromTo(modalContent, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
            closeBtn.focus();
        };

        const closeModal = () => {
            this.dependencies.gsap.to(modalContent, {
                opacity: 0,
                y: -20,
                duration: 0.3,
                ease: 'power3.in',
                onComplete: () => {
                    modal.style.display = 'none';
                    modal.setAttribute('aria-hidden', 'true');
                },
            });
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', e => e.target === modal && closeModal());
        window.addEventListener('keydown', e => e.key === 'Escape' && modal.style.display === 'flex' && closeModal());
    }

    getModalElements() {
        return {
            modal: document.querySelector(this.selectors.modal),
            modalContent: document.querySelector(this.selectors.modalContent),
            modalImg: document.querySelector(this.selectors.modalImg),
            modalCaption: document.querySelector(this.selectors.modalCaption),
            closeBtn: document.querySelector(this.selectors.closeBtn),
        };
    }

    setupForm() {
        const form = document.querySelector(this.selectors.form);
        if (!form) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        const successMsg = this.createElement('div', { class: 'form-success' });

        form.addEventListener('submit', async e => {
            e.preventDefault();
            const formData = new FormData(form);
            const email = formData.get('email');

            if (!this.validateEmail(email)) {
                form.querySelector('input[name="email"]').setCustomValidity('Invalid email.');
                form.reportValidity();
                return;
            }

            // Show "Sending..." immediately
        submitBtn.disabled = true;
        successMsg.textContent = 'Sending...';
        document.querySelector(this.selectors.form).appendChild(successMsg);
        this.dependencies.gsap.fromTo(
            successMsg,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.2, ease: 'power3.out' }
        );

            try {
            await this.submitForm(formData);
            // Update to success message
            successMsg.textContent = 'Message sent successfully!';
            this.dependencies.gsap.to(successMsg, { 
                opacity: 1, 
                duration: 0.2, 
                onComplete: () => setTimeout(() => {
                    this.dependencies.gsap.to(successMsg, { 
                        opacity: 0, 
                        duration: 0.2, 
                        onComplete: () => successMsg.remove() 
                    });
                    submitBtn.disabled = false;
                    form.reset();
                }, 1500) 
            });
        } catch (error) {
            console.error('Form submission failed:', error);
            successMsg.textContent = 'Submission failed, please try again.';
            successMsg.style.color = '#dc3545'; // Red for error
            setTimeout(() => {
                this.dependencies.gsap.to(successMsg, { 
                    opacity: 0, 
                    duration: 0.2, 
                    onComplete: () => {
                        successMsg.remove();
                        submitBtn.disabled = false;
                    }
                });
            }, 1500);
        }
        });
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async submitForm(formData) {
        const data = Object.fromEntries(formData);
        const emailParams = {
            from_name: data.name,
            from_email: data.email,
            message: data.message,
        };
    
        try {
            const response = await emailjs.send(
                'service_7yz5t8r', // Replace with your EmailJS Service ID
                'template_84j8kh7', // Replace with your EmailJS Template ID
                emailParams,
                'Fbwy_q2acxNCyfNbN' // Replace with your EmailJS User ID
            );
            console.log('Email sent successfully:', response);
        } catch (error) {
            throw new Error('EmailJS failed: ' + error.text);
        }
    }

    showSuccessMessage() {
        const success = this.createElement('div', { class: 'form-success' });
        success.textContent = 'Message sent successfully!';
        document.querySelector(this.selectors.form).appendChild(success);
        this.dependencies.gsap.fromTo(
            success,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.2, ease: 'power3.out', onComplete: () => setTimeout(() => success.remove(), 1500) }
        );
    }

    setupScrollToTop() {
        const btn = document.querySelector(this.selectors.scrollTop);
        if (!btn) return;

        const toggleVisibility = this.throttle(() => {
            btn.style.opacity = window.scrollY > 300 ? '1' : '0';
            btn.style.pointerEvents = window.scrollY > 300 ? 'auto' : 'none';
        }, 100);

        window.addEventListener('scroll', toggleVisibility);
        btn.addEventListener('click', () =>
            this.dependencies.gsap.to(window, { scrollTo: 0, duration: 1.5, ease: 'power3.out' })
        );
    }

    setupBackToTop() {
        document.querySelectorAll(this.selectors.backToTop).forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                this.smoothScrollTo('home');
            });
        });
    }

    setupThemeToggle() {
        const toggle = document.querySelector(this.selectors.themeToggle);
        if (!toggle) return;

        const applyTheme = isDark => document.body.classList.toggle('dark-mode', isDark);
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) applyTheme(savedTheme === 'dark');

        toggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            this.dependencies.gsap.to('body', { duration: 0.3, backgroundColor: isDark ? '#1a1a1a' : '#fff' });
        });
    }

    setupAnalytics() {
        console.log('Page loaded:', window.location.pathname);
        document.querySelectorAll(this.selectors.navLinks).forEach(link => {
            link.addEventListener('click', () => console.log('Navigated to:', link.getAttribute('href')));
        });
    }

    createElement(tag, attributes = {}) {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
        return element;
    }

    throttle(func, limit) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

document.addEventListener('DOMContentLoaded', () => new PortfolioApp().init());