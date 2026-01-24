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
