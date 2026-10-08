(() => {
  const works = [...document.querySelectorAll('.archive-work')];
  const buttons = [...document.querySelectorAll('.creator-nav button')];
  const status = document.getElementById('selection-status');
  const choose = creator => {
    for (const work of works) {
      work.hidden = creator !== 'all' && work.dataset.creator !== creator;
      if (work.hidden) work.querySelector('video')?.pause();
    }
    for (const button of buttons) {
      const selected = button.dataset.creator === creator;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    }
    status.textContent = creator === 'all' ? '이웃의 사진과 이야기로 엮은 웅상의 기록을 펼칩니다.' : `${creator} 님이 모으고 엮은 기록을 펼칩니다.`;
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    choose(button.dataset.creator);
    history.replaceState(null, '', `${location.pathname}${location.search}#collection`);
  }));
  works.forEach(work => {
    const video = work.querySelector('video');
    if (!video) return;
    video.addEventListener('play', () => {
      works.forEach(other => { if (other !== work) other.querySelector('video')?.pause(); });
    });
    work.querySelector('.replay').addEventListener('click', () => {
      video.currentTime = 0;
      video.play().catch(() => { video.focus(); });
    });
  });
  window.addEventListener('hashchange', () => {
    const target = works.find(work => `#${work.id}` === location.hash);
    if (target?.hidden) {
      choose('all');
      target.scrollIntoView();
    }
  });
})();
