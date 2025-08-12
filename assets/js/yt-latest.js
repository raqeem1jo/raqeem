
(function(){
  function qs(sel, root=document){ return root.querySelector(sel); }
  const cfg = window.YT_CONFIG || {};

  async function resolveChannelId(){
    if (cfg.channelId && cfg.channelId.trim()) return cfg.channelId.trim();
    if (cfg.handle && cfg.apiKey){
      const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(cfg.handle)}&key=${cfg.apiKey}`;
      const r = await fetch(url);
      const d = await r.json();
      if (d && d.items && d.items[0] && d.items[0].id) return d.items[0].id;
    }
    throw new Error("تعذر تحديد قناة يوتيوب (handle/channelId).");
  }

  async function loadLatest(){
    const container = qs('#yt-latest');
    if (!container) return;
    container.innerHTML = '<div class="loading">جاري جلب أحدث الفيديوهات...</div>';
    try{
      const channelId = await resolveChannelId();
      const max = cfg.maxResults || 12;
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=${max}&key=${cfg.apiKey}`;
      const r = await fetch(url);
      const d = await r.json();
      if (!d || !Array.isArray(d.items)){ throw new Error('استجابة غير متوقعة من يوتيوب'); }
      if (!d.items.length){ container.innerHTML = '<p>لا يوجد فيديوهات حالياً.</p>'; return; }
      const cards = d.items.map(it => {
        const id = it.id && it.id.videoId ? it.id.videoId : null;
        const s = it.snippet || {};
        const title = s.title || 'فيديو';
        const date = s.publishedAt ? new Date(s.publishedAt).toLocaleDateString('ar-JO') : '';
        if (!id) return '';
        return `
          <div class="video">
            <iframe loading="lazy" src="https://www.youtube.com/embed/${id}" title="${title}" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
            <div class="video-meta">
              <div class="video-title">${title}</div>
              <div class="video-date">${date ? 'نُشر في ' + date : ''}</div>
            </div>
          </div>`;
      }).join('');
      container.innerHTML = `<div class="lux-grid">${cards}</div>`;
    }catch(e){
      console.error(e);
      container.innerHTML = '<p>تعذّر جلب الفيديوهات. تأكّد من القناة ومفتاح API.</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', loadLatest);

  // Simple client-side search (expects .video-title)
  document.addEventListener('input', (e)=>{
    if (e.target && e.target.id === 'yt-search'){
      const q = e.target.value.trim();
      document.querySelectorAll('#yt-latest .video').forEach(card => {
        const t = (card.querySelector('.video-title')||{}).textContent || '';
        card.style.display = (!q || t.includes(q)) ? '' : 'none';
      });
    }
  });
})();
