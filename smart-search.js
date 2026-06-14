"use strict";

const runSearchEngine = () => {
  const injectSearchStyles = () => {
    const d = document,
      c = `.search-out{position:absolute;top:55px;left:0;width:320px;background:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.15);z-index:999;border:1px solid #eee;overflow:hidden;animation:searchFadeIn .3s ease}.search-item{display:flex;align-items:center;padding:12px;gap:12px;border-bottom:1px solid #f9f9f9;transition:background .2s;direction:rtl;text-align:right}.search-item:hover{background:#fcfcfc}.s-thumb img{width:75px;height:75px;border-radius:8px;object-fit:cover;background:#eee}.s-info a{display:block;font-size:14px;font-weight:600;color:#222;text-decoration:none;margin-bottom:4px;line-height:1.4}.s-info span{font-size:11px;color:#888}.search-label{padding:15px;text-align:center;font-size:13px;color:#666;direction:rtl}.more-result{background:#f8f9fa;padding:10px;text-align:center;font-size:16px;border-top:1px solid #eee}.more-result a{color:#007bff;text-decoration:none;font-weight:bold}.loader{width:18px;height:18px;border:2px solid #f3f3f3;border-top:2px solid #3498db;border-radius:50%;display:inline-block;animation:searchSpin .8s linear infinite;vertical-align:middle;margin-left:8px}@keyframes searchSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes searchFadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}`,
      s = d.createElement("style");
    s.innerText = c;
    d.head.appendChild(s);
  };

  const initSmartSearch = () => {
    const d = document,
      w = d.querySelector('.search-wrap'),
      f = d.querySelector('.searchform'),
      i = d.querySelector('.searchbar'),
      o = d.querySelector('.search-out'),
      r = d.querySelector('.search-result'),
      l = d.querySelector('.search-label'),
      m = d.querySelector('.more-result'),
      c = d.querySelector('.searchicon span'),
      b = d.querySelector('.tl-bloglink');
    let t;

    const g = (C = !1) => {
      const isOpen = w.style.width === '250px';
      if (isOpen || C) {
        w.style.width = '0';
        f.style.width = '0';
        f.style.opacity = '0';
        if (o) o.style.display = 'none';
        c.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>';
      } else {
        w.style.width = '250px';
        f.style.width = '250px';
        f.style.opacity = '1';
        i.focus();
        c.innerHTML = '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
      }
    };

    const p = async () => {
      const q = i.value.trim();
      if (!b) return;
      const D = b.getAttribute('data-url').replace('http:', 'https:');
      if (q.length < 2) {
        if (o) o.style.display = 'none';
        return;
      }
      if (o) o.style.display = 'block';
      if (l) {
        l.style.display = 'block';
        l.innerHTML = '<div class="loader"></div> جاري البحث...';
      }
      try {
        const res = await fetch(`${D}/feeds/posts/default?max-results=5&alt=json&q=${encodeURIComponent(q)}`),
          j = await res.json();
        r.innerHTML = '';
        if (j.feed.entry && j.feed.entry.length > 0) {
          j.feed.entry.forEach(E => {
            const P = formatBlogData(E),
              th = imageEngine.smartResize(P.img, 's100-c-rw'),
              it = `<div class="search-item"><a href="${P.link}" class="s-thumb"><img src="${th}" alt="${P.title}"/></a><div class="s-info"><a href="${P.link}">${P.title}</a><span>${P.date.split('T')[0]}</span></div></div>`;
            r.insertAdjacentHTML('beforeend', it);
          });
          if (l) l.style.display = 'none';
          if (m) {
            m.innerHTML = `<a href="${D}search?q=${encodeURIComponent(q)}">كل النتائج لـ <b>${q}</b></a>`;
            m.style.display = 'block';
          }
        } else {
          if (l) l.innerHTML = 'لا توجد نتائج مطابقة.';
          if (m) m.style.display = 'none';
        }
      } catch (e) {
        if (l) l.innerHTML = 'تعذر الاتصال بالخادم.';
      }
    };

    i.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = i.value.trim();
        if (q.length >= 2 && b) {
          const D = b.getAttribute('data-url').replace('http:', 'https:'),
            u = `${D}search?q=${encodeURIComponent(q)}`,
            a = d.createElement('a');
          a.href = u;
          d.body.appendChild(a);
          a.click();
          a.remove();
          g(!0);
        }
      }
    });

    i.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(p, 500);
    });

    c.addEventListener('click', e => {
      e.stopPropagation();
      g();
    });

    d.addEventListener('mouseup', e => {
      if (w.style.width === '250px' && !w.contains(e.target) && !c.contains(e.target)) {
        g(!0);
      }
    });

    // تنفيذ فتح الشريط مباشرة
    g();
  };

  injectSearchStyles();
  initSmartSearch();
  console.log("Search Engine Applied Externally.");
};

runSearchEngine();