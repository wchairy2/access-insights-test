/* Access Insights — Main JavaScript */

'use strict';
    const $ = (s,c=document)=>c.querySelector(s);
    const $$ = (s,c=document)=>[...c.querySelectorAll(s)];
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Smooth scroll + focus management — WCAG 2.4.3 */
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const id = link.getAttribute('href');
        const target = $(id);
        if (!target) return;
        e.preventDefault();
        closeMobileMenu();
        if (prefersReduced) { target.scrollIntoView(); }
        else { target.scrollIntoView({behavior:'smooth',block:'start'}); }
        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex','-1');
          target.addEventListener('blur', ()=>target.removeAttribute('tabindex'), {once:true});
        }
        target.focus({preventScroll:true});
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

    /* aria-current on scroll — WCAG 4.1.2 */
    const sectionObserver = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          $$('#nav-menu a').forEach(a=>a.removeAttribute('aria-current'));
          const a = $(`#nav-menu a[href="#${entry.target.id}"]`);
          if(a) a.setAttribute('aria-current','page');
        }
      });
    },{threshold:0.45});
    $$('section[id]').forEach(s=>sectionObserver.observe(s));

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

    function openMobileMenu(){
      navMenu.classList.add('open');
      hamburger.setAttribute('aria-expanded','true');
      hamburger.setAttribute('aria-label','Close navigation menu');
    }
    function closeMobileMenu(){
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded','false');
      hamburger.setAttribute('aria-label','Open navigation menu');
    }
    hamburger.addEventListener('click',()=>{
      hamburger.getAttribute('aria-expanded')==='true' ? closeMobileMenu() : openMobileMenu();
    });
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape' && navMenu.classList.contains('open')){
        closeMobileMenu(); hamburger.focus();
      }
    });
    document.addEventListener('click',e=>{
      if(navMenu.classList.contains('open') &&
         !navMenu.contains(e.target) &&
         !hamburger.contains(e.target)) closeMobileMenu();
    });

    /* Form validation — WCAG 3.3.1, 3.3.3 */
    const form = $('#contact-form');

    function validateField(input){
      const errId = input.getAttribute('aria-describedby');
      const errEl = errId ? $('#'+errId) : null;
      let valid = true;
      if(input.required && !input.value.trim()) valid=false;
      else if(input.type==='email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) valid=false;
      input.setAttribute('aria-invalid', valid ? 'false' : 'true');
      if(errEl) errEl.classList.toggle('visible',!valid);
      return valid;
    }

    $$('#contact-form input, #contact-form textarea').forEach(input=>{
      input.addEventListener('blur',()=>validateField(input));
      input.addEventListener('input',()=>{
        if(input.getAttribute('aria-invalid')==='true') validateField(input);
      });
    });

    form.addEventListener('submit',e=>{
      e.preventDefault();
      const required = $$('[required]',form);
      let allValid = true;
      required.forEach(el=>{ if(!validateField(el)) allValid=false; });
      if(!allValid){
        const first = $('[aria-invalid="true"]',form);
        if(first) first.focus();
        return;
      }
      form.style.display='none';
      const success = $('#form-success');
      success.classList.add('visible');
      success.focus();
    });
