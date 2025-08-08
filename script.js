
// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  }));
}

// Statistics Counters
function animateCounter(el) {
  const target = +el.getAttribute('data-target');
  const duration = 1500;
  const start = 0;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(start + progress * (target - start));
    el.textContent = value.toLocaleString('ar-EG');
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.stat-number').forEach(el => animateCounter(el));
});

/** =====================
 * YouTube Grid Loader
 * ===================== */
async function initYouTubeGrid({ channelId, apiKey, maxResults = 9 }) {
  try {
    const chRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );
    const chData = await chRes.json();
    const uploadsId = chData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsId) throw new Error("تعذر الحصول على قائمة الرفع للقناة.");

    const plRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=${maxResults}&key=${apiKey}`
    );
    const plData = await plRes.json();
    const items = (plData && plData.items) || [];

    const container = document.getElementById("youtube-grid");
    if (!container) return;
    container.innerHTML = "";

    if (!items.length) {
      container.innerHTML = '<p class="error" style="text-align:center">لا يوجد فيديوهات حالياً.</p>';
      return;
    }

    items.forEach(item => {
      const { title, resourceId, thumbnails } = item.snippet;
      const videoId = resourceId.videoId;
      const thumb = (thumbnails && (thumbnails.medium || thumbnails.high || thumbnails.default)) || {};
      const card = document.createElement("div");
      card.className = "video-card";
      card.setAttribute("data-videoid", videoId);
      card.setAttribute("data-thumb", (thumb && thumb.url) || "");
      card.innerHTML = `
        <div class="thumb" style="position:relative; aspect-ratio:16/9; overflow:hidden;">
          <img src="${thumb.url || ""}" alt="${title}" loading="lazy" decoding="async" style="width:100%; height:100%; object-fit:cover;">
          <button class="play-btn" type="button" aria-label="تشغيل الفيديو" style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); border:none; background:rgba(0,0,0,0.55); color:#fff; padding:14px 18px; border-radius:999px; font-size:18px; cursor:pointer;">▶</button>
        </div>
        <h4 class="video-title">${title}</h4>
      `;
      card.querySelector(".thumb").addEventListener("click", () => playInCard(videoId, card));
      card.querySelector(".play-btn").addEventListener("click", (e) => { e.stopPropagation(); playInCard(videoId, card); });
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    const container = document.getElementById("youtube-grid");
    if (container) container.innerHTML = `<p class="error" style="text-align:center">تعذر جلب الفيديوهات الآن.</p>`;
  }
}

/** =====================
 * Play In-Card YouTube
 * ===================== */
function playInCard(videoId, cardEl) {
  try {
    // stop other playing cards
    document.querySelectorAll('.video-card.is-playing').forEach(el => {
      if (el !== cardEl) revertCard(el);
    });
    const thumb = cardEl.querySelector('.thumb');
    if (!thumb) return;
    thumb.innerHTML = '';
    thumb.style.position = 'relative';
    if (!thumb.style.aspectRatio) thumb.style.aspectRatio = '16/9';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.title = 'YouTube video player';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.style.position = 'absolute';
    iframe.style.inset = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    thumb.appendChild(iframe);
    cardEl.classList.add('is-playing');
  } catch (e) {
    console.error(e);
  }
}

function revertCard(cardEl) {
  try {
    const imgSrc = cardEl.getAttribute('data-thumb');
    const title = cardEl.querySelector('.video-title')?.textContent || '';
    const thumb = cardEl.querySelector('.thumb');
    if (!thumb) return;
    thumb.innerHTML = `
      <img src="${imgSrc || ''}" alt="${title}" style="width:100%; height:100%; object-fit:cover;">
      <button class="play-btn" type="button" aria-label="تشغيل الفيديو" style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); border:none; background:rgba(0,0,0,0.55); color:#fff; padding:14px 18px; border-radius:999px; font-size:18px; cursor:pointer;">▶</button>
    `;
    thumb.querySelector(".play-btn").addEventListener("click", (e) => { e.stopPropagation(); playInCard(cardEl.getAttribute('data-videoid'), cardEl); });
    thumb.addEventListener("click", () => playInCard(cardEl.getAttribute('data-videoid'), cardEl));
    cardEl.classList.remove('is-playing');
  } catch (e) {
    console.error(e);
  }
}


/* === Raqeem Polish Pack JS === */
document.addEventListener('DOMContentLoaded', () => {
  // Add reveal class to major blocks
  const revealTargets = [
    ...document.querySelectorAll('section, .program-card, .team-member, .trainer-card, .partner-card, .video-card')
  ];
  revealTargets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target);} });
  }, {threshold: .12, rootMargin: '0px 0px -10% 0px'});
  revealTargets.forEach(el=>io.observe(el));

  // Scrollspy for navbar
  const sections = ['home','programs','team','trainers','platform','partners','contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const links = Array.from(document.querySelectorAll('.nav-link'));
  const spy = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const id = e.target.id;
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      }
    });
  }, {threshold: .6});
  sections.forEach(s=>spy.observe(s));

  // Parallax hero image (very subtle)
  const heroImg = document.querySelector('.hero-logo');
  if(heroImg){
    window.addEventListener('scroll', () => {
      const y = Math.min(20, window.scrollY / 40);
      heroImg.style.transform = `translateY(${y}px)`;
    }, {passive:true});
  }

  // Ripple effect on primary buttons
  document.querySelectorAll('.view-all-btn').forEach(btn => {
    btn.addEventListener('click', function(e){
      const span = document.createElement('span');
      span.className = 'ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      span.style.width = span.style.height = size + 'px';
      span.style.left = (e.clientX - rect.left - size/2) + 'px';
      span.style.top = (e.clientY - rect.top - size/2) + 'px';
      this.appendChild(span);
      setTimeout(()=>span.remove(), 600);
    });
  });
});


/* === Pro Animations Pack JS === */
document.addEventListener('DOMContentLoaded', () => {
  // Scroll progress
  const bar = document.getElementById('scroll-progress');
  const onScroll = () => {
    const s = window.scrollY;
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    const p = Math.max(0, Math.min(1, s / (dh || 1)));
    bar.style.width = (p*100) + '%';
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  // Magnetic button hover (view-all only to be safe)
  document.querySelectorAll('.view-all-btn').forEach(btn => {
    let rafId = null;
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width/2);
      const y = e.clientY - (r.top + r.height/2);
      const tx = (x / r.width) * 10;
      const ty = (y / r.height) * 10;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(()=>{
        btn.style.transform = `translate(${tx}px, ${ty}px)`;
      });
    });
    btn.addEventListener('mouseleave', ()=>{
      cancelAnimationFrame(rafId);
      btn.style.transform = 'translate(0,0)';
    });
  });

  // Tilt effect for cards
  const tiltEls = document.querySelectorAll('.program-card, .team-member, .trainer-card, .partner-card, .video-card');
  tiltEls.forEach(el => {
    el.classList.add('tilt');
    let raf = null;
    function handleMove(e){
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      const rx = (y * -6).toFixed(2);
      const ry = (x * 6).toFixed(2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{
        el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
    }
    function reset(){ el.style.transform='translateY(0)'; }
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', reset);
  });

  // Nav underline indicator
  const nav = document.querySelector('.nav-menu');
  if(nav){
    const underline = document.createElement('div');
    underline.className = 'nav-underline';
    nav.appendChild(underline);
    const items = nav.querySelectorAll('.nav-link');
    function moveUnderline(el){
      const r = el.getBoundingClientRect();
      const nr = nav.getBoundingClientRect();
      underline.style.left = (r.left - nr.left) + 'px';
      underline.style.width = r.width + 'px';
    }
    items.forEach(a=>{
      a.addEventListener('mouseenter', ()=>moveUnderline(a));
      a.addEventListener('focus', ()=>moveUnderline(a));
    });
    const active = nav.querySelector('.nav-link.active') || items[0];
    if(active) moveUnderline(active);
    nav.addEventListener('mouseleave', ()=>{ underline.style.width='0px'; });
  }

  // Particles in hero (lightweight)
  const hero = document.querySelector('.hero');
  if(hero){
    const canvas = document.createElement('canvas');
    canvas.id = 'particles';
    hero.style.position = 'relative';
    hero.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let w,h, dpr = Math.min(2, window.devicePixelRatio || 1);
    const particles = Array.from({length: 45}, ()=>({x:0,y:0,vx:0,vy:0,s:0, a: Math.random()*Math.PI*2}));
    function resize(){
      w = canvas.width = hero.clientWidth * dpr;
      h = canvas.height = hero.clientHeight * dpr;
      canvas.style.width = hero.clientWidth + 'px';
      canvas.style.height = hero.clientHeight + 'px';
    }
    function reset(p){
      p.x = Math.random()*w; p.y = Math.random()*h;
      const sp = .2 + Math.random()*.8;
      p.vx = Math.cos(p.a)*sp; p.vy = Math.sin(p.a)*sp;
      p.s = 1 + Math.random()*2;
    }
    particles.forEach(reset);
    resize();
    window.addEventListener('resize', resize);
    let last = performance.now();
    function tick(now){
      const dt = Math.min(32, now - last); last = now;
      ctx.clearRect(0,0,w,h);
      ctx.globalAlpha = .6;
      ctx.fillStyle = '#ffffff';
      particles.forEach(p=>{
        p.x += p.vx*dt; p.y += p.vy*dt;
        if(p.x<0||p.x>w||p.y<0||p.y>h) reset(p);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI*2); ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
});


// Counters on visibility (once)
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.stat-number');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const el = e.target;
        const target = +el.getAttribute('data-target');
        const duration = 1600;
        const start = 0;
        const startTime = performance.now();
        function tick(now){
          const progress = Math.min((now - startTime) / duration, 1);
          const value = Math.floor(start + progress * (target - start));
          el.textContent = value.toLocaleString('ar-EG');
          if(progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      }
    });
  }, {threshold:.5});
  counters.forEach(c => io.observe(c));
});


document.addEventListener('DOMContentLoaded', () => {
  // Add floating call pill on mobile
  const pill = document.createElement('a');
  pill.href = 'tel:0791087449';
  pill.className = 'footer-call-float';
  pill.innerHTML = '<i class="fas fa-phone"></i> اتصل الآن';
  document.body.appendChild(pill);
});
