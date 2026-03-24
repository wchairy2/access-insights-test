/* Access Insights — Main JavaScript */

'use strict';
    const $ = (s,c=document)=>c.querySelector(s);
    const $$ = (s,c=document)=>[...c.querySelectorAll(s)];
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setCurrentNavLink(targetId){
      $$('#nav-menu a').forEach(a=>{
        const isCurrent = a.getAttribute('href') === `#${targetId}`;
        if(isCurrent) a.setAttribute('aria-current','location');
        else a.removeAttribute('aria-current');
      });
    }

    function getHashTarget(hash){
      if(!hash || hash === '#') return null;
      let id = '';
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch {
        return null;
      }
      if(!id) return null;
      return document.getElementById(id);
    }

    /* Smooth scroll + focus management — WCAG 2.4.3 */
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        if(e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        const hash = link.getAttribute('href');
        const target = getHashTarget(hash);
        if (!target) return;

        e.preventDefault();
        closeMobileMenu();
        if (prefersReduced) { target.scrollIntoView({block:'start'}); }
        else { target.scrollIntoView({behavior:'smooth',block:'start'}); }

        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex','-1');
          target.addEventListener('blur', ()=>target.removeAttribute('tabindex'), {once:true});
        }
        target.focus({preventScroll:true});

        if(window.location.hash !== hash){
          history.pushState(null, '', hash);
        }

        if(target.id){
          setCurrentNavLink(target.id);
        }
      });
    });

    /* Nav scroll tint */
    const navbar = $('#navbar');
    function syncNavHeight(){
      const navHeight = Math.ceil(navbar.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--nav-total-h', `${navHeight}px`);
    }
    syncNavHeight();

    window.addEventListener('resize', syncNavHeight, {passive:true});
    window.addEventListener('orientationchange', syncNavHeight);
    if(window.visualViewport){
      window.visualViewport.addEventListener('resize', syncNavHeight);
    }
    if(document.fonts && document.fonts.ready){
      document.fonts.ready.then(syncNavHeight);
    }
    if(window.ResizeObserver){
      const navResizeObserver = new ResizeObserver(syncNavHeight);
      navResizeObserver.observe(navbar);
    }

    window.addEventListener('scroll',()=>{
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    },{passive:true});

    /* aria-current on scroll — WCAG 4.1.2
       Uses scroll position rather than IntersectionObserver so tall sections
       (which never reach a 45% threshold) still highlight correctly. */
    const navSections = $$('section[id]');
    function updateActiveNav(){
      const navH = navbar.getBoundingClientRect().height;
      const scrollMid = window.scrollY + navH + 40;
      let active = navSections[0];
      for(const sec of navSections){
        if(sec.offsetTop <= scrollMid) active = sec;
        else break;
      }
      if(active) setCurrentNavLink(active.id);
    }
    window.addEventListener('scroll', updateActiveNav, {passive:true});
    updateActiveNav();

    const initialTarget = getHashTarget(window.location.hash) || $('#home');
    if(initialTarget && initialTarget.id){
      setCurrentNavLink(initialTarget.id);
    }

    /* Fade-up */
    const fuObserver = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          fuObserver.unobserve(entry.target);
        }
      });
    },{threshold:0.1});
    $$('.fade-up:not(.visible)').forEach(el=>fuObserver.observe(el));

    /* Mobile menu — WCAG 4.1.2, 2.1.2 */
    const hamburger = $('#hamburger');
    const navMenu   = $('#nav-menu');
    const mobileNav = window.matchMedia('(max-width: 1023px)');
    const navLinks = $$('a[href^="#"]', navMenu);

    function isMobileNav(){
      return mobileNav.matches;
    }

    function setMobileMenuAccessibilityState(isOpen){
      if(!isMobileNav()){
        navMenu.removeAttribute('aria-hidden');
        navMenu.removeAttribute('inert');
        return;
      }
      navMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      if(isOpen) navMenu.removeAttribute('inert');
      else navMenu.setAttribute('inert', '');
    }

    function syncMenuMode(){
      if(isMobileNav()){
        setMobileMenuAccessibilityState(navMenu.classList.contains('open'));
        return;
      }
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded','false');
      setMobileMenuAccessibilityState(false);
    }

    function openMobileMenu(){
      if(!isMobileNav()) return;
      navMenu.classList.add('open');
      hamburger.setAttribute('aria-expanded','true');
      setMobileMenuAccessibilityState(true);
      const firstLink = navLinks[0];
      if(firstLink) firstLink.focus();
    }
    function closeMobileMenu(restoreFocus = false){
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded','false');
      setMobileMenuAccessibilityState(false);
      if(restoreFocus && isMobileNav()) hamburger.focus();
    }
    hamburger.addEventListener('click',()=>{
      hamburger.getAttribute('aria-expanded')==='true' ? closeMobileMenu() : openMobileMenu();
    });
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape' && navMenu.classList.contains('open')){
        closeMobileMenu(true);
      }
      if(e.key==='Tab' && navMenu.classList.contains('open') && isMobileNav()){
        const tabbable = navLinks.filter(link=>!link.hidden);
        if(!tabbable.length) return;
        const first = tabbable[0];
        const last = tabbable[tabbable.length - 1];
        if(e.shiftKey && document.activeElement === first){
          e.preventDefault();
          last.focus();
        } else if(!e.shiftKey && document.activeElement === last){
          e.preventDefault();
          first.focus();
        }
      }
    });
    document.addEventListener('click',e=>{
      if(navMenu.classList.contains('open') &&
         !navMenu.contains(e.target) &&
         !hamburger.contains(e.target)) closeMobileMenu();
    });
    if(mobileNav.addEventListener){
      mobileNav.addEventListener('change', syncMenuMode);
    } else if(mobileNav.addListener){
      mobileNav.addListener(syncMenuMode);
    }
    syncMenuMode();

    /* Form validation — WCAG 3.3.1, 3.3.3 */
    const form = $('#contact-form');
    const submitBtn = $('.btn-submit', form);
    const status = $('#form-status');
    const success = $('#form-success');
    const submitError = $('#form-error');
    const formControls = $$('input, textarea, button', form).filter(el => el.name !== 'bot-field');
    const submitDefaultText = submitBtn ? submitBtn.textContent : '';

    function announceStatus(message){
      if(!status) return;
      status.textContent = '';
      window.requestAnimationFrame(() => {
        status.textContent = message;
      });
    }

    function setSubmittingState(isSubmitting){
      form.setAttribute('aria-busy', isSubmitting ? 'true' : 'false');
      formControls.forEach(control => {
        control.disabled = isSubmitting;
      });
      if(submitBtn){
        submitBtn.setAttribute('aria-busy', isSubmitting ? 'true' : 'false');
        submitBtn.textContent = isSubmitting ? 'Sending...' : submitDefaultText;
      }
    }

    function validateField(input){
      const errId = input.getAttribute('aria-describedby');
      const errEl = errId ? $('#'+errId) : null;
      let valid = true;
      if(input.required && !input.value.trim()) valid=false;
      else if(input.type==='email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) valid=false;
      if(valid) input.removeAttribute('aria-invalid');
      else input.setAttribute('aria-invalid', 'true');
      if(errEl){
        errEl.classList.toggle('visible',!valid);
        errEl.hidden = valid;
      }
      return valid;
    }

    $$('#contact-form input, #contact-form textarea').forEach(input=>{
      input.addEventListener('blur',()=>{
        // Avoid announcing "invalid" as users first navigate through empty required fields.
        if(input.value.trim() || input.getAttribute('aria-invalid')==='true') validateField(input);
      });
      input.addEventListener('input',()=>{
        if(input.getAttribute('aria-invalid')==='true') validateField(input);
      });
    });

    form.addEventListener('submit',e=>{
      e.preventDefault();
      announceStatus('');
      success.hidden = true;
      success.classList.remove('visible');
      submitError.hidden = true;
      submitError.classList.remove('visible');

      const required = $$('[required]',form);
      let allValid = true;
      required.forEach(el=>{ if(!validateField(el)) allValid=false; });
      if(!allValid){
        announceStatus('Please fix the highlighted fields and try again.');
        const first = $('[aria-invalid="true"]',form);
        if(first) first.focus();
        return;
      }

      const formData = new FormData(form);
      const payload = new URLSearchParams(formData).toString();
      setSubmittingState(true);
      announceStatus('Sending your message.');

      fetch('/',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body: payload
      })
      .then(response=>{
        if(!response.ok) throw new Error(`Netlify form submission failed (${response.status})`);
        form.hidden = true;
        form.setAttribute('aria-hidden', 'true');
        success.hidden = false;
        success.classList.add('visible');
        announceStatus('Message sent successfully.');
        success.focus();
      })
      .catch(()=>{
        submitError.hidden = false;
        submitError.classList.add('visible');
        announceStatus('Message failed to send. Please try again.');
        submitError.focus();
      })
      .finally(()=>{
        setSubmittingState(false);
      });
    });
