(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header ? header.offsetHeight : 0

    let targetEl = select(el)
    if (targetEl) {
      let elementPos = targetEl.offsetTop
      window.scrollTo({
        top: elementPos - offset,
        behavior: 'smooth'
      })
    }
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function (e) {
    let navbar = select('#navbar')
    let header = select('#header')
    if (navbar) {
      navbar.classList.toggle('navbar-mobile')
      if (header) {
        header.classList.toggle('mobile-nav-active')
      }
      document.body.classList.toggle('mobile-nav-active')
      let toggleIcon = select('.mobile-nav-toggle')
      if (toggleIcon) {
        toggleIcon.classList.toggle('bi-list')
        toggleIcon.classList.toggle('bi-x')
      }
    }
  })

  /**
   * Close mobile nav on link click
   */
  on('click', '.navbar-mobile a', function (e) {
    let navbar = select('#navbar')
    let header = select('#header')
    let toggleIcon = select('.mobile-nav-toggle')
    if (navbar && navbar.classList.contains('navbar-mobile')) {
      navbar.classList.remove('navbar-mobile')
      if (header) {
        header.classList.remove('mobile-nav-active')
      }
      document.body.classList.remove('mobile-nav-active')
      if (toggleIcon) {
        toggleIcon.classList.add('bi-list')
        toggleIcon.classList.remove('bi-x')
      }
    }
  }, true)

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on('click', '.scrollto', function (e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar && navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        if (navbarToggle) {
          navbarToggle.classList.toggle('bi-list')
          navbarToggle.classList.toggle('bi-x')
        }
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with offset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.remove();
      }, 300);
    });
  }

  /**
   * Portfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer && typeof Isotope !== 'undefined') {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function (e) {
        e.preventDefault();
        portfolioFilters.forEach(function (el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function () {
          if (typeof AOS !== 'undefined') {
            AOS.refresh()
          }
        });
      }, true);
    }
  });

  /**
   * Initiate portfolio lightbox 
   */
  if (typeof GLightbox !== 'undefined') {
    if (select('.portfolio-lightbox')) {
      GLightbox({ selector: '.portfolio-lightbox' });
    }
    if (select('.portfolio-details-lightbox')) {
      GLightbox({ selector: '.portfolio-details-lightbox', width: '90%', height: '90vh' });
    }
  }

  /**
   * Portfolio details slider
   */
  if (typeof Swiper !== 'undefined') {
    if (select('.portfolio-details-slider')) {
      new Swiper('.portfolio-details-slider', {
        speed: 400,
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', type: 'bullets', clickable: true }
      });
    }
    if (select('.testimonials-slider')) {
      new Swiper('.testimonials-slider', {
        speed: 600,
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        slidesPerView: 'auto',
        pagination: { el: '.swiper-pagination', type: 'bullets', clickable: true }
      });
    }
  }

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
        mirror: false
      });
    }
  });

  /**
   * Initiate Pure Counter 
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

})();