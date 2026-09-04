/*--------------------------------------------------------------
# Theme Switcher Script (Light / Dark Mode Persistence)
--------------------------------------------------------------*/
(function () {
  // Read saved theme or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Helper to update toggle button icon & title
  function updateToggleBtn(btn, theme) {
    if (!btn) return;
    if (theme === 'light') {
      btn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
      btn.setAttribute('title', 'Switch to Dark Mode');
      btn.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
      btn.innerHTML = '<i class="bi bi-sun-fill"></i>';
      btn.setAttribute('title', 'Switch to Light Mode');
      btn.setAttribute('aria-label', 'Switch to Light Mode');
    }
  }

  // Initialize theme toggle when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

    updateToggleBtn(toggleBtn, currentTheme);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = activeTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        updateToggleBtn(toggleBtn, newTheme);
      });
    }
  });
})();
