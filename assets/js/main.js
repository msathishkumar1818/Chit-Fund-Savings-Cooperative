/**
 * VRIDHI CHIT FUND & SAVINGS COOPERATIVE - SHARED JAVASCRIPT
 * Global Controller: Preloader, Fixed Header, Dark Mode (#000000), RTL/LTR,
 * Click-only Dropdowns, Mobile Drawer, Accordions, and Scroll-to-Top.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initThemeManager();
  initDirectionManager();
  initFixedHeader();
  initDesktopDropdown();
  initMobileNavigation();
  initScrollToTop();
  initActiveNavLinks();
});

/* ==========================================================================
   1. BRANDED PRELOADER
   ========================================================================== */
function initPreloader() {
  const loader = document.getElementById('site-loader');
  if (!loader) return;

  const hideLoader = () => {
    loader.classList.add('hidden');
    setTimeout(() => {
      loader.remove();
    }, 450);
  };

  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 200);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 200));
    // Failsafe in case of network stall
    setTimeout(hideLoader, 1800);
  }
}

/* ==========================================================================
   2. PURE #000000 DARK MODE CONTROLLER
   ========================================================================== */
function initThemeManager() {
  const THEME_KEY = 'vridhi_theme_mode';
  const htmlRoot = document.documentElement;
  const toggleButtons = document.querySelectorAll('.theme-toggle-btn');

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem(THEME_KEY);
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
  applyTheme(isDark);

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDark = htmlRoot.classList.contains('dark');
      applyTheme(!currentDark);
    });
  });

  function applyTheme(dark) {
    if (dark) {
      htmlRoot.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      htmlRoot.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
    updateThemeIcons(dark);
  }

  function updateThemeIcons(dark) {
    toggleButtons.forEach(btn => {
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        if (dark) {
          sunIcon.classList.remove('hidden');
          moonIcon.classList.add('hidden');
        } else {
          sunIcon.classList.add('hidden');
          moonIcon.classList.remove('hidden');
        }
      }
    });
  }
}

/* ==========================================================================
   3. RTL / LTR DIRECTION CONTROLLER
   ========================================================================== */
function initDirectionManager() {
  const DIR_KEY = 'vridhi_doc_direction';
  const htmlRoot = document.documentElement;
  const dirButtons = document.querySelectorAll('.lang-toggle-btn');

  const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
  applyDir(savedDir);

  dirButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDir = htmlRoot.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDir(newDir);
    });
  });

  function applyDir(dir) {
    htmlRoot.setAttribute('dir', dir);
    localStorage.setItem(DIR_KEY, dir);

    // Ensure mobile drawer is cleanly closed if direction is toggled
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('mobile-backdrop');
    const openBtn = document.getElementById('mobile-menu-open');
    if (drawer && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      document.body.style.overflow = '';
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    }

    dirButtons.forEach(btn => {
      const label = btn.querySelector('.dir-label');
      if (label) {
        label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left to Right' : 'Switch to Right to Left');
    });
  }
}

/* ==========================================================================
   4. FIXED COMPACT HEADER SCROLL BEHAVIOR
   ========================================================================== */
function initFixedHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 15) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   5. DESKTOP CLICK-ONLY DROPDOWN (NO HOVER)
   ========================================================================== */
function initDesktopDropdown() {
  const wrappers = document.querySelectorAll('.dropdown-wrapper');

  wrappers.forEach(wrapper => {
    const trigger = wrapper.querySelector('.dropdown-trigger');
    if (!trigger) return;

    // Strictly ensure closed by default
    wrapper.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');

    // ONLY toggle when Home is clicked
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const willOpen = !wrapper.classList.contains('open');

      // Close all other dropdowns
      wrappers.forEach(other => {
        other.classList.remove('open');
        const otherTrigger = other.querySelector('.dropdown-trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });

      if (willOpen) {
        wrapper.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        wrapper.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Auto-close when mouse leaves dropdown area
    let closeTimer;
    wrapper.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => {
        wrapper.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }, 250);
    });

    wrapper.addEventListener('mouseenter', () => {
      if (closeTimer) clearTimeout(closeTimer);
    });

    // Close when any dropdown link is clicked
    const links = wrapper.querySelectorAll('.dropdown-menu a');
    links.forEach(l => {
      l.addEventListener('click', () => {
        wrapper.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });
  });

  // Global click outside to automatically close
  document.addEventListener('click', (e) => {
    wrappers.forEach(wrapper => {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove('open');
        const trigger = wrapper.querySelector('.dropdown-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      wrappers.forEach(wrapper => {
        wrapper.classList.remove('open');
        const trigger = wrapper.querySelector('.dropdown-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* ==========================================================================
   6. MOBILE DRAWER NAVIGATION & ACCORDION
   ========================================================================== */
function initMobileNavigation() {
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-backdrop');
  const openBtn = document.getElementById('mobile-menu-open');
  const closeBtn = document.getElementById('mobile-menu-close');
  const accordions = document.querySelectorAll('.mobile-accordion');
  const accordionTriggers = document.querySelectorAll('.mobile-accordion-trigger');
  const allNavLinks = document.querySelectorAll('.mobile-drawer a');

  if (!drawer || !openBtn) return;

  function closeAllAccordions() {
    accordions.forEach(acc => acc.classList.remove('open'));
    accordionTriggers.forEach(trig => trig.setAttribute('aria-expanded', 'false'));
  }

  function openDrawer() {
    // Strictly reset and close all accordions by default whenever drawer opens
    closeAllAccordions();
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    openBtn.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
    openBtn.setAttribute('aria-expanded', 'false');
    closeAllAccordions();
  }

  // Strictly ensure closed by default on page load
  closeAllAccordions();

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
  }

  // Mobile accordion for Home submenu: ONLY toggle on click
  accordionTriggers.forEach(trigger => {
    const parentAccordion = trigger.closest('.mobile-accordion');
    if (!parentAccordion) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const willOpen = !parentAccordion.classList.contains('open');

      // Close all accordions first
      closeAllAccordions();

      if (willOpen) {
        parentAccordion.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        parentAccordion.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close drawer on clicking ANY navigation item
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(closeDrawer, 120);
    });
  });

  // ESC to close drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   7. SCROLL TO TOP
   ========================================================================== */
function initScrollToTop() {
  const btn = document.getElementById('scroll-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   8. ACTIVE NAVIGATION LINK DETECTION
   ========================================================================== */
function initActiveNavLinks() {
  let rawFile = window.location.pathname.split('/').pop().toLowerCase();
  if (!rawFile || rawFile === '' || rawFile === 'index' || rawFile.startsWith('index.')) {
    rawFile = 'index.html';
  }

  const isHome1 = (rawFile === 'index.html');
  const isHome2 = (rawFile === 'home-2.html');
  const isHome = (isHome1 || isHome2);

  // Desktop Home Dropdown Trigger highlight
  const desktopHomeTriggers = document.querySelectorAll('.dropdown-wrapper .dropdown-trigger');
  desktopHomeTriggers.forEach(btn => {
    if (isHome) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Mobile Home Accordion Trigger highlight
  const mobileHomeTriggers = document.querySelectorAll('.mobile-accordion-trigger');
  mobileHomeTriggers.forEach(btn => {
    if (isHome) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Submenu links for Home 1 and Home 2 in Desktop Dropdown and Mobile Drawer
  const home1Links = document.querySelectorAll('.dropdown-menu a[href*="index.html"], .mobile-accordion-content a[href*="index.html"]');
  const home2Links = document.querySelectorAll('.dropdown-menu a[href*="home-2.html"], .mobile-accordion-content a[href*="home-2.html"]');

  home1Links.forEach(link => {
    if (isHome1) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  home2Links.forEach(link => {
    if (isHome2) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Highlight specific page links across desktop nav, mobile nav
  const allNavLinks = document.querySelectorAll('.desktop-nav-cluster > a.nav-link, .mobile-drawer nav > a.mobile-nav-link');
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkFile = href.split('/').pop().split('#')[0].split('?')[0].toLowerCase();

    if (linkFile === rawFile) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}


/* ==========================================================================
   9. INTERACTIVE CHIT SCHEMES CALCULATOR
   ========================================================================== */
function initChitCalculator() {
  const chitSelect = document.getElementById('calc-chit-value');
  const monthSlider = document.getElementById('calc-bid-month');
  if (!chitSelect || !monthSlider) return;

  const displayChitValue = document.getElementById('calc-out-chit');
  const displayInstallment = document.getElementById('calc-out-installment');
  const displayDividend = document.getElementById('calc-out-dividend');
  const displayNetPayable = document.getElementById('calc-out-net');
  const displayBidMonth = document.getElementById('calc-display-month');
  const displayPrizeMoney = document.getElementById('calc-out-prize');

  function updateCalculations() {
    const totalChit = parseInt(chitSelect.value, 10) || 500000;
    const months = parseInt(chitSelect.options[chitSelect.selectedIndex].getAttribute('data-months') || '25', 10);
    const bidMonth = parseInt(monthSlider.value, 10) || 1;

    monthSlider.max = months;
    if (displayBidMonth) displayBidMonth.textContent = 'Month ' + bidMonth + ' of ' + months;

    const baseMonthlyInstallment = totalChit / months;
    
    // Reverse auction discount formula: Capped at 25% max early, tapering down towards end
    const maxDiscountRate = 0.25;
    const currentDiscountRate = Math.max(0.05, maxDiscountRate * ((months - bidMonth + 1) / months));
    const grossAuctionDiscount = totalChit * currentDiscountRate;
    const foremanFee = totalChit * 0.05;
    const netDividendPool = Math.max(0, grossAuctionDiscount - foremanFee);
    const dividendPerMember = Math.round(netDividendPool / months);
    const netMonthlyPayable = Math.round(baseMonthlyInstallment - dividendPerMember);
    const netPrizeMoney = Math.round(totalChit - grossAuctionDiscount);

    const formatRupees = (val) => '&#8377;' + Math.round(val).toLocaleString('en-IN');

    if (displayChitValue) displayChitValue.innerHTML = formatRupees(totalChit);
    if (displayInstallment) displayInstallment.innerHTML = formatRupees(baseMonthlyInstallment);
    if (displayDividend) displayDividend.innerHTML = formatRupees(dividendPerMember);
    if (displayNetPayable) displayNetPayable.innerHTML = formatRupees(netMonthlyPayable);
    if (displayPrizeMoney) displayPrizeMoney.innerHTML = formatRupees(netPrizeMoney);
  }

  chitSelect.addEventListener('change', updateCalculations);
  monthSlider.addEventListener('input', updateCalculations);
  updateCalculations();
}

document.addEventListener('DOMContentLoaded', () => {
  initChitCalculator();
});


/* ==========================================================================
   10. LOGIN PAGE — TAB SWITCHER + PASSWORD TOGGLE
   ========================================================================== */
(function initLoginPage() {
  // Tab Switcher
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const panelLogin = document.getElementById('panel-login');
  const panelRegister = document.getElementById('panel-register');
  const goToRegister = document.getElementById('go-to-register');
  const goToLogin = document.getElementById('go-to-login');

  function activateTab(which) {
    if (!tabLogin || !tabRegister || !panelLogin || !panelRegister) return;
    if (which === 'login') {
      tabLogin.classList.add('active');
      tabLogin.setAttribute('aria-selected', 'true');
      tabRegister.classList.remove('active');
      tabRegister.setAttribute('aria-selected', 'false');
      panelLogin.classList.remove('hidden');
      panelRegister.classList.add('hidden');
    } else {
      tabRegister.classList.add('active');
      tabRegister.setAttribute('aria-selected', 'true');
      tabLogin.classList.remove('active');
      tabLogin.setAttribute('aria-selected', 'false');
      panelRegister.classList.remove('hidden');
      panelLogin.classList.add('hidden');
    }
  }

  if (tabLogin) tabLogin.addEventListener('click', () => activateTab('login'));
  if (tabRegister) tabRegister.addEventListener('click', () => activateTab('register'));
  if (goToRegister) goToRegister.addEventListener('click', () => activateTab('register'));
  if (goToLogin) goToLogin.addEventListener('click', () => activateTab('login'));

  // Password Toggle
  const togglePwBtn = document.getElementById('toggle-password');
  const pwInput = document.getElementById('member-password');
  if (togglePwBtn && pwInput) {
    togglePwBtn.addEventListener('click', () => {
      const isPassword = pwInput.type === 'password';
      pwInput.type = isPassword ? 'text' : 'password';
      const showIcon = togglePwBtn.querySelector('.pw-eye-show');
      const hideIcon = togglePwBtn.querySelector('.pw-eye-hide');
      if (showIcon && hideIcon) {
        showIcon.classList.toggle('hidden', isPassword);
        hideIcon.classList.toggle('hidden', !isPassword);
      }
      togglePwBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  }

  // Basic form submission intercept (UI demo)
  const loginForm = document.getElementById('member-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = 'dashboard.html';
    });
  }
})();

/* ==========================================================================
   11. MEMBER PORTAL — INTERACTIVE TAB SWITCHER & MOBILE SIDEBAR DRAWER
   Matches Reference Design: Overview, My Schemes, Contributions, Auctions,
   Statements, Profile with instant tab switching and smooth navigation.
   ========================================================================== */
(function initMemberPortal() {
  const portalRoot = document.querySelector('.portal-layout');
  if (!portalRoot) return;

  const sidebar = document.getElementById('portal-sidebar');
  const overlay = document.getElementById('portal-overlay');
  const mobileToggle = document.getElementById('portal-mobile-toggle');
  const sidebarClose = document.getElementById('portal-sidebar-close');
  const navButtons = document.querySelectorAll('[data-portal-tab]');
  const tabPanels = document.querySelectorAll('.portal-tab-panel');
  const mainArea = document.querySelector('.portal-main');

  // Tab Switching Function
  function switchTab(tabId) {
    if (!tabId) return;

    // 1. Update Navigation Buttons
    navButtons.forEach(btn => {
      const btnTab = btn.getAttribute('data-portal-tab');
      if (btnTab === tabId && btn.classList.contains('portal-nav-item')) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else if (btn.classList.contains('portal-nav-item')) {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // 2. Switch Tab Panels
    tabPanels.forEach(panel => {
      if (panel.id === 'tab-' + tabId) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });

    // 3. Close mobile drawer if open
    closeSidebar();

    // 4. Smooth scroll main area to top
    if (mainArea) {
      mainArea.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Attach click listeners to all tab trigger buttons
  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = btn.getAttribute('data-portal-tab');
      switchTab(tabId);
    });
  });

  // Mobile Drawer Controls
  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = sidebar && sidebar.classList.contains('open');
      if (isOpen) closeSidebar();
      else openSidebar();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
  }

  // ESC key closes drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });

  // Handle URL hash changes (e.g. #schemes, #contributions)
  function checkHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'schemes', 'contributions', 'auctions', 'statements', 'profile'].includes(hash)) {
      switchTab(hash);
    }
  }
  window.addEventListener('hashchange', checkHash);
  checkHash();
})();
