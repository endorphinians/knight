/**
 * Combined JavaScript from two provided scripts
 * Author: Combined and corrected by ChatGPT
 */
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    const selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (listener) => {
    window.addEventListener('scroll', listener);
  };

  /**
   * Navbar links active state on scroll
   */
  const navbarlinksActive = () => {
    const position = window.scrollY + 200;
    const navbarlinks = select('#navbar .scrollto', true);
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      const section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    });
  };

  window.addEventListener('load', navbarlinksActive);
  onscroll(navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    const header = select('#header');
    let offset = header.offsetHeight;
    if (!header.classList.contains('header-scrolled')) {
      offset -= 16;
    }
    const elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth',
    });
  };

  /**
   * Header fixed top on scroll
   */
  const headerFixed = () => {
    const selectHeader = select('#header');
    if (selectHeader) {
      const headerOffset = selectHeader.offsetTop;
      if ((headerOffset - window.scrollY) <= 0) {
        selectHeader.classList.add('fixed-top');
        selectHeader.nextElementSibling.classList.add('scrolled-offset');
      } else {
        selectHeader.classList.remove('fixed-top');
        selectHeader.nextElementSibling.classList.remove('scrolled-offset');
      }
    }
  };

  window.addEventListener('load', headerFixed);
  onscroll(headerFixed);

  /**
   * Back to top button
   */
  const backtotop = select('.back-to-top');
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active');
      } else {
        backtotop.classList.remove('active');
      }
    };
    window.addEventListener('load', toggleBacktotop);
    onscroll(toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', (e) => {
    select('#navbar').classList.toggle('navbar-mobile');
    e.target.classList.toggle('bi-list');
    e.target.classList.toggle('bi-x');
  });

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', (e) => {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault();
      e.target.nextElementSibling.classList.toggle('dropdown-active');
    }
  }, true);

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on('click', '.scrollto', (e) => {
    if (select(e.target.hash)) {
      e.preventDefault();
      const navbar = select('#navbar');
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile');
        const navbarToggle = select('.mobile-nav-toggle');
        navbarToggle.classList.toggle('bi-list');
        navbarToggle.classList.toggle('bi-x');
      }
      scrollto(e.target.hash);
    }
  }, true);

  /**
   * Scroll with offset on page load with hash links in the URL
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Portfolio isotope and filter
   */
  window.addEventListener('load', () => {
    const portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      const portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows',
      });

      const portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter'),
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh();
        });
      }, true);
    }
  });

  /**
   * Initiate portfolio lightbox
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox',
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 380,
    loop: true,
    autoplay: {
      delay: 5200,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 580,
    loop: true,
    autoplay: {
      delay: 5200,
      disableOnInteraction: false,
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
  });

  /**
  * Masonry layout
  */

$('.grid').masonry({
  // set itemSelector so .grid-sizer is not used in layout
  itemSelector: '.grid-item',
  // use element for option
  columnWidth: '.grid-sizer',
  percentPosition: true
})


  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1200,
      easing: 'ease-in-out',
      once: false,
      mirror: false,
    });
  });

  /**
   * Custom Scroll Animation Handling
   */
  document.addEventListener('DOMContentLoaded', () => {
    let lastScrollTop = 0;
    const contentItems = document.querySelectorAll('.content');

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      contentItems.forEach((item) => {
        const itemOffset = item.getBoundingClientRect().top + window.pageYOffset;
        const windowHeight = window.innerHeight;
        if (scrollTop > lastScrollTop) {
          // Scrolling down
          if (scrollTop + windowHeight > itemOffset + 100) {
            item.classList.add('animate');
          }
        } else {
          // Scrolling up
          if (scrollTop + windowHeight < itemOffset + item.clientHeight + 100) {
            item.classList.remove('animate');
          }
        }
      });
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check to animate items on load
  });
})();
