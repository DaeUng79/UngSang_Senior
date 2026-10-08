(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const states = new Map();
  function sync(state) {
    const playing = state.ready && state.visible && !document.hidden && !state.userPaused;
    state.photo.classList.toggle('is-playing', playing);
    if (!state.ready) return;
    state.button.textContent = playing ? '잠시 머물러 읽기 Ⅱ' : '움직이는 사진 보기 ▷';
    state.button.setAttribute('aria-label', `${state.creator} 님이 엮은 사진과 이야기 ${playing ? '일시정지' : '재생'}`);
  }
  async function loadPhotos(state) {
    if (state.ready || state.loading) return;
    state.loading = true;
    state.button.disabled = true;
    state.button.textContent = '사진 불러오는 중';
    try {
      await Promise.all([...state.photo.querySelectorAll('img')].map(async img => {
        // Decode only near the viewport. The second photo has no src until now.
        img.loading = 'eager';
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        if (img.dataset.src) img.src = img.dataset.src;
        await img.decode();
      }));
      state.ready = true;
      state.photo.classList.add('is-ready');
      state.button.disabled = false;
      sync(state);
    } catch {
      state.button.disabled = false;
      state.button.textContent = '사진 다시 불러오기 ↻';
      state.button.setAttribute('aria-label', `${state.creator}의 사진 다시 불러오기`);
    } finally {
      state.loading = false;
    }
  }
  const nearby = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) loadPhotos(states.get(entry.target));
    });
  }, {rootMargin:'400px 0px'});
  const visible = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const state = states.get(entry.target);
      state.visible = entry.isIntersecting && entry.intersectionRatio >= .25;
      sync(state);
    });
  }, {threshold:[0,.25]});
  document.querySelectorAll('.motion-figure').forEach(figure => {
    const state = {
      photo:figure.querySelector('.motion-photo'), button:figure.querySelector('.motion-toggle'),
      creator:figure.closest('.archive-work').dataset.creator,
      visible:false, ready:false, loading:false, userPaused:reduced.matches
    };
    states.set(state.photo,state);
    state.button.addEventListener('click', () => {
      if (!state.ready) { loadPhotos(state); return; }
      state.userPaused = state.photo.classList.contains('is-playing');
      sync(state);
    });
    nearby.observe(state.photo);
    visible.observe(state.photo);
  });
  document.addEventListener('visibilitychange', () => states.forEach(sync));
  reduced.addEventListener('change', () => {
    if (reduced.matches) states.forEach(state => { state.userPaused = true; sync(state); });
  });
})();
