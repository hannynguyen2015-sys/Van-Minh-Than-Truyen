/* Thước 5000 năm: cho biết người đọc đang ở năm nào. Vì sao chuyển động: vị trí cuộn = vị trí trong thời gian. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  if (/[?&]still=1/.test(location.search)) root.setAttribute('data-still', '');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || root.hasAttribute('data-still');

  // Nổi lên khi vào khung (chỉ khi được phép chuyển động)
  var rise = document.querySelectorAll('[data-rise], .legend');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    rise.forEach(function (el) { io.observe(el); });
  } else { rise.forEach(function (el) { el.classList.add('in'); }); }

  // Thước dính đầu màn hình
  var eras = Array.prototype.slice.call(document.querySelectorAll('.era'));
  var segs = Array.prototype.slice.call(document.querySelectorAll('.ruler__seg'));
  var now = document.querySelector('.ruler__now');
  if (!eras.length || !now) return;
  var last = -2, ticking = false;
  function update() {
    ticking = false;
    var line = window.innerHeight * 0.35, idx = -1, frac = 0;
    for (var i = 0; i < eras.length; i++) {
      var r = eras[i].getBoundingClientRect();
      if (r.top <= line) { idx = i; frac = Math.min(1, Math.max(0, (line - r.top) / r.height)); }
    }
    segs.forEach(function (s, i) {
      var f = i < idx ? 1 : i === idx ? frac : 0;
      s.firstElementChild.style.transform = 'scaleX(' + f.toFixed(3) + ')';
      if (i === idx) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current');
    });
    if (idx !== last) {
      last = idx;
      var src = idx >= 0 ? eras[idx] : null;
      now.innerHTML = src ? src.getAttribute('data-short') + '<span>' + src.getAttribute('data-years') + '</span>' : '5000 năm<span>khoảng 2852 TCN – 1912</span>';
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
