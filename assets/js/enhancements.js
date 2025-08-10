// === Mobile + Animation Enhancements (auto-generated) ===

// 1) Viewport-safe animation on scroll using IntersectionObserver
(function(){
  const animateTargets = Array.from(document.querySelectorAll([
    "section","article",".section",".card",".feature",".tile",".stat",".step",
    "img","h2","h3","p","li",".hero",".cta",".price",".team",".faq",".testimonial"
  ].join(",")));

  animateTargets.forEach((el, i) => {
    el.classList.add("reveal");
    if (i % 3 === 0) el.classList.add("fade-up");
    if (i % 3 === 1) el.classList.add("fade-in");
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("in-view");
      else entry.target.classList.remove("in-view");
    });
  }, { threshold: 0.12 });

  animateTargets.forEach(el => io.observe(el));
})();

// 2) Basic mobile nav toggle if a <nav> exists
(function(){
  const nav = document.querySelector("nav");
  if (!nav) return;

  // If nav doesn't already have a toggle, inject one
  if (!nav.querySelector(".mobile-toggle")) {
    const btn = document.createElement("button");
    btn.className = "mobile-toggle";
    btn.setAttribute("aria-label", "Toggle menu");
    btn.innerHTML = "☰";
    Object.assign(btn.style, {
      fontSize: "20px", padding: "8px 12px", margin: "8px",
      background: "transparent", border: "1px solid rgba(0,0,0,.15)", borderRadius: "12px"
    });

    // Place the button at the start of the nav
    nav.insertBefore(btn, nav.firstChild);

    btn.addEventListener("click", () => {
      nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", nav.classList.contains("is-open"));
    });
  }
})();

// 3) Soft parallax for elements with .parallax
(function(){
  const hasParallax = document.querySelector(".parallax");
  if (!hasParallax) return;
  window.addEventListener("scroll", () => {
    const y = window.scrollY || window.pageYOffset;
    document.querySelectorAll(".parallax").forEach(el => {
      el.style.setProperty("--scroll", y.toString());
    });
  }, { passive: true });
})();