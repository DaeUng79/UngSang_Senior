(() => {
  const scenes = [
    { image:1, label:'프롤로그 · 우리의 동네, 웅상', style:'intro', title:'웅상을|기억하는|방법', body:'웅상을 기록하다.\n시간을 건너, 당신에게.', caption:'사진 속에 남아 있는, 우리의 어린 날', seconds:8 },
    { image:2, label:'01 · 한 장의 시작', style:'emphasis', title:'오래된 사진 한 장이|우리 동네의|역사가 됩니다.', body:'빛바랜 앨범 속에 잠들어 있던\n웅상의 옛 모습을', caption:'함께였기에, 오래 기억되는 순간', seconds:9 },
    { image:3, label:'02 · 다시 꺼내는 기억', style:'rise', title:'이웃의 사진을 모아|다시 꺼내어봅니다.', body:'선배시민들이 지인과 이웃의\n사진을 모으고 이야기를 엮어', caption:'우리의 여름은, 이런 모습이었습니다', seconds:9 },
    { image:4, label:'03 · 그 시절, 그 자리', style:'rise', title:'그 시절 그 자리를|다시 찾아가', body:'현재의 모습을 담아 완성한\n‘과거와 현재의 기록’입니다.', caption:'여럿의 손길로 만들어온 동네', seconds:8 },
    { image:5, label:'04 · 변해가는 풍경', style:'emphasis', title:'논 밭이|아파트가 되고,', body:'', caption:'시간이 흐르고, 풍경이 바뀌어도', seconds:7 },
    { image:9, label:'05 · 남아 있는 풍경', style:'rise', title:'초가집이|주택이 되기까지', body:'', caption:'이제는 사진으로 만나는 그때의 집', seconds:7 },
    { image:6, label:'06 · 시간을 걷다', style:'rise', title:'조용하고 천천히,|그러나 끊임없이', body:'웅상은 변해왔습니다.', caption:'우리가 함께 지나온 시간', seconds:8 },
    { image:10, label:'07 · 어제와 오늘 사이', style:'memory', title:'선배시민이 엮은|사진과 이야기를 따라', body:'이웃의 기억이\n마을의 기록으로 이어집니다.', caption:'익숙한 나무 아래, 남아 있는 어린 날', seconds:9 },
    { image:7, label:'08 · 우리의 길 위에', style:'memory', title:'우리가 오늘 걷는|이 길 위에도,', body:'누군가의 어린 시절과\n젊은 날이 남아있습니다.', caption:'한 장에 담긴, 나란히 앉았던 기억', seconds:9 },
    { image:11, label:'09 · 당신에게 묻습니다', style:'emphasis', title:'당신의 앨범에는|어떤 웅상이|남아 있나요?', body:'', caption:'평범해서 더 소중한, 어느 겨울날', seconds:8 },
    { image:8, label:'에필로그 · 다음 이야기는 당신의 기억', style:'invitation', title:'당신의 기억도|들려주세요.', body:'그 이야기가 다음\n웅상의 역사가 됩니다.', caption:'기억은, 함께 나눌 때 이어집니다', seconds:10 }
  ];
  const $ = s => document.querySelector(s);
  const stage = $('#exhibit');
  const images = [$('#photo-a'), $('#photo-b')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const lowData = !!connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '');
  const resolution = lowData || innerWidth < 900 ? 640 : 1080;
  let index=0, active=0, elapsed=0, paused=reduced.matches || lowData, busy=true, dialogOpen=false, last=0, warmed=-1;
  const path = scene => `./assets/photos/${String(scene.image).padStart(2,'0')}-${resolution}.webp`;
  const buttons=scenes.map((scene,i) => {
    const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`${i+1}번째 장면: ${scene.title.replaceAll('|',' ')}`);
    b.addEventListener('click',()=>go(i));$('#timeline').append(b);return b;
  });
  function controls(){
    stage.classList.toggle('paused',paused || dialogOpen || document.hidden);
    $('#play').setAttribute('aria-label',index===10 && elapsed>=10000?'처음부터 다시 보기':paused?'재생':'일시정지');
    $('#play-icon').textContent=paused?'▷':'Ⅱ';
    $('#play-label').textContent=paused?(index===10?'기억은 계속됩니다':'잠시 머무르는 중'):'기억을 따라 걷는 중';
    $('#previous').disabled=index===0 || busy;$('#next').disabled=index===10 || busy;
  }
  function render(){
    const scene=scenes[index];stage.dataset.image=scene.image;$('#eyebrow').textContent=scene.label;
    const copy=document.createElement('div');copy.id='scene-copy';copy.className=`scene-copy ${scene.style}`;
    const heading=document.createElement(index===0?'h1':'h2');
    scene.title.split('|').forEach((line,i)=>{if(i && index!==0)heading.append(document.createElement('br'));const span=document.createElement('span');span.textContent=line;heading.append(span);});
    if(index===0){const dot=document.createElement('span');dot.className='title-dot';dot.textContent='.';heading.lastChild.append(dot);}
    copy.append(heading);
    if(scene.body){const p=document.createElement('p');p.className='scene-body';scene.body.split('\n').forEach((line,i)=>{if(i)p.append(document.createElement('br'));p.append(line);});copy.append(p);}
    $('#scene-copy').replaceWith(copy);$('#photo-caption').textContent=scene.caption;
    $('#scene-number').textContent=String(index+1).padStart(2,'0');$('#final-cta').hidden=index!==10;
    buttons.forEach((b,i)=>{b.className=i<index?'past':i===index?'current':'';b.style.setProperty('--progress','0');if(i===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});controls();
  }
  function finishPhotoFade(image){
    if(reduced.matches)return Promise.resolve();
    return new Promise(resolve=>{
      const finish=()=>{clearTimeout(timeout);image.removeEventListener('transitionend',onEnd);resolve();};
      const onEnd=event=>{if(event.target===image && event.propertyName==='opacity')finish();};
      const timeout=setTimeout(finish,2000);
      image.addEventListener('transitionend',onEnd);
    });
  }
  async function go(target){
    if(busy || target<0 || target>=scenes.length)return;
    busy=true;controls();const nextImage=images[1-active];
    const waitNotice=setTimeout(()=>{$('#load-message').textContent='다음 사진을 불러오고 있습니다…';$('#load-message').hidden=false;},1200);
    try{
      nextImage.removeAttribute('srcset');nextImage.src=path(scenes[target]);await nextImage.decode();
      clearTimeout(waitNotice);
      const outgoing=images[active];
      nextImage.dataset.image=scenes[target].image;
      // Keep the outgoing zoom until its opacity transition is completely hidden.
      const fading=finishPhotoFade(outgoing);
      outgoing.classList.remove('active');nextImage.classList.add('active','drifting');active=1-active;index=target;elapsed=0;warmed=-1;render();
      $('#load-message').hidden=true;
      await fading;
      outgoing.classList.remove('drifting');
    }catch{paused=true;$('#load-message').textContent='사진을 불러오지 못했습니다. 연결을 확인하고 장면을 다시 선택해주세요.';$('#load-message').hidden=false;}
    finally{clearTimeout(waitNotice);busy=false;controls();}
  }
  $('#play').addEventListener('click',()=>{if(index===10 && elapsed>=10000){elapsed=0;go(0);paused=false;}else paused=!paused;controls();});
  $('#previous').addEventListener('click',()=>go(index-1));$('#next').addEventListener('click',()=>go(index+1));
  document.addEventListener('keydown',e=>{if(dialogOpen || /INPUT|TEXTAREA|BUTTON|A/.test(document.activeElement.tagName))return;if(e.key==='ArrowRight'){e.preventDefault();go(index+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(index-1);}if(e.code==='Space'){e.preventDefault();$('#play').click();}});
  let touchStart=null;
  stage.addEventListener('touchstart',e=>{if(e.target.closest('button,a'))return;touchStart={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};},{passive:true});
  stage.addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.5)go(index+(dx<0?1:-1));touchStart=null;},{passive:true});
  document.querySelectorAll('[data-dialog]').forEach(button=>button.addEventListener('click',()=>{dialogOpen=true;document.getElementById(button.dataset.dialog).showModal();controls();}));
  document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{dialogOpen=false;controls();});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom)dialog.close();}});});
  document.addEventListener('visibilitychange',()=>{last=0;controls();});
  reduced.addEventListener('change',()=>{if(reduced.matches){paused=true;controls();}});
  if(lowData)$('#player-note').textContent='데이터 절약 · 재생을 눌러 시작';
  function tick(now){
    const dt=last?Math.min(now-last,250):0;last=now;
    if(!paused && !busy && !dialogOpen && !document.hidden){
      elapsed+=dt;const duration=scenes[index].seconds*1000;buttons[index].style.setProperty('--progress',Math.min(elapsed/duration,1));
      if(!lowData && elapsed>duration/2 && index<10 && warmed!==index+1){warmed=index+1;const next=new Image();next.src=path(scenes[warmed]);}
      if(elapsed>=duration){if(index<10)go(index+1);else{paused=true;controls();}}
    }
    requestAnimationFrame(tick);
  }
  buttons[0].className='current';buttons[0].setAttribute('aria-current','step');controls();
  images[0].decode().catch(()=>{paused=true;$('#load-message').textContent='첫 사진을 불러오지 못했습니다. 연결을 확인하고 첫 장면을 다시 선택해주세요.';$('#load-message').hidden=false;}).finally(()=>{busy=false;controls();requestAnimationFrame(tick);});
})();
