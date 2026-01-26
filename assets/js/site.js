function responsiveMenu() {
  const menu = document.getElementById("main-menu");
  if (!menu) return;
  menu.classList.toggle("open");
}

/* Mark active nav link (works for static sites) */
(function markActiveNav() {
  const path = location.pathname.replace(/\/+$/, "") || "/";
  const links = document.querySelectorAll("#main-menu a[href]");
  links.forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;

    // Compare normalized paths (ignores trailing slash)
    const target = href.replace(/\/+$/, "") || "/";
    if (target === path) a.setAttribute("aria-current", "page");
  });
})();

/* Donation Toast Logic */
(function () {
  const toastHTML = `
    <div id="donate-toast" class="toast-container">
      <div class="toast-content">
        <button id="close-toast" class="close-toast" aria-label="Close">&times;</button>
        <h3>Support the Project</h3>
        <p>Help keep FluxLinux alive. Your donations support server costs and development time.</p>
        <a href="https://ko-fi.com/fluxlinux" target="_blank" class="button suggested">Support on Ko-fi</a>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', toastHTML);

  const toast = document.getElementById('donate-toast');
  const closeBtn = document.getElementById('close-toast');

  // Show toast
  toast.style.display = 'block';

  // Close logic
  closeBtn.addEventListener('click', function () {
    toast.style.display = 'none';
  });
})();
