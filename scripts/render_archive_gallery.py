"""Render the public archive from transcribed PDF text and existing videos."""
from pathlib import Path
import html
import json
import shutil
import re
from prepare_archive_font import archive_font

def motion_figure(work, record, overlay):
    esc = html.escape
    page = work['page']
    width,height = record['size']
    compact = ' compact' if page != 1 else ''
    narrow = ' narrow' if overlay.get('narrow') else ''
    captions = []
    for key,phase in [('before','past'),('after','present')]:
        date = re.fullmatch(r'(\d{4})(.*)', work[key]['date'])
        year = f'{esc(date[1])}<span>{esc(date[2])}</span>' if date else esc(work[key]['date'])
        place = esc(overlay[key]['place']).replace('\n','<br>')
        quote = esc(overlay[key]['quote']).replace('\n','<br>')
        captions.append(f'''<div class="motion-caption caption-{phase}" aria-hidden="true"><p class="motion-year">{year}</p><p class="motion-place">{place}</p><p class="motion-quote">{quote}</p></div>''')
    sizes = '(max-width:680px) calc(100vw - 40px), (max-width:1200px) 50vw, 608px'
    return f'''<figure class="motion-figure">
      <div class="motion-photo {esc(overlay['anchor'])}{compact}{narrow}" style="--photo-aspect:{width}/{height}" role="img" aria-label="{esc(work['creator'])} 님이 엮은 웅상의 기록. {esc(work['before']['date'])}의 사진과 {esc(work['after']['date'])}의 사진, 그리고 이야기가 천천히 교차합니다.">
        <img class="motion-past" src="motion{page:02d}-start-640.webp" srcset="motion{page:02d}-start-640.webp 640w, motion{page:02d}-start.webp {width}w" sizes="{sizes}" width="{width}" height="{height}" alt="" loading="lazy" decoding="async">
        <img class="motion-present" data-src="motion{page:02d}-end-640.webp" data-srcset="motion{page:02d}-end-640.webp 640w, motion{page:02d}-end.webp {width}w" sizes="{sizes}" width="{width}" height="{height}" alt="" decoding="async">
        <div class="motion-shade" aria-hidden="true"></div>{''.join(captions)}
      </div>
      <figcaption><span>그때</span><span class="time-thread" aria-hidden="true"></span><span>지금</span></figcaption>
      <div class="film-actions"><button type="button" class="motion-toggle" disabled>사진 불러오는 중</button><a href="{esc(record['file'])}" download>영상 간직하기 <span aria-hidden="true">↓</span></a></div>
      <noscript><p class="place">사진 속 이야기는 ‘그때’와 ‘지금’에서 읽을 수 있습니다.</p></noscript>
    </figure>'''

def render(root, records):
    font = archive_font(root)
    out = root/'output/video/pages-02-12'
    content = json.loads((root/'output/video/archive-content.json').read_text())
    works = {work['page']: work for work in content['works']}
    overlays = json.loads((root/'scripts/motion_overlays.json').read_text())
    creators = list(dict.fromkeys(works[r['page']]['creator'] for r in records))
    esc = html.escape
    buttons = '<button type="button" class="selected" data-creator="all" aria-pressed="true">모든 기록</button>'
    buttons += ''.join(f'<button type="button" data-creator="{esc(name)}" aria-pressed="false">{esc(name)}</button>' for name in creators)
    cards = []
    for record in records:
        p = record['page']
        work = works[p]
        creator, title = esc(work['creator']), esc(work['title'])
        stories = []
        for key,label in [('before','그때'),('after','지금')]:
            moment = work[key]
            stories.append(f'''<section class="moment {key}" aria-label="{label}의 사진 이야기">
              <div class="moment-heading"><span>{label}</span><time>{esc(moment['date'])}</time></div>
              <p class="place">{esc(moment['location'])}</p>
              <p class="story">{esc(moment['description'])}</p>
            </section>''')
        figure = motion_figure(work, record, overlays[str(p)])
        cards.append(f'''<article class="archive-work" id="page{p:02d}" data-creator="{creator}" aria-labelledby="title{p:02d}">
          <header class="work-heading"><p class="creator"><span>사진 수집 · 이야기 구성</span><strong>{creator}</strong></p>
            <h2 id="title{p:02d}">{title}</h2></header>
          <div class="work-body">{figure}<div class="memories">{''.join(stories)}</div></div>
        </article>''')
    template = (root/'scripts/archive_gallery.html').read_text()
    (out/'index.html').write_text(template.replace('{{CREATOR_BUTTONS}}', buttons).replace('{{WORKS}}', '\n'.join(cards)).replace('{{HOME_URL}}','https://daeung79.github.io/UngSang_Senior/').replace('{{ARCHIVE_SERIF_URL}}', font['file']).replace('{{ARCHIVE_FONT_VERSION}}', font['sha256'][:12]))
    for name in ('archive.css','archive.js','motion-sample.css','motion-sample.js'):
        shutil.copy2(root/'scripts'/name, out/name)
    css = out/'archive.css'
    css.write_text(css.read_text().replace('{{ARCHIVE_SERIF_URL}}', font['file']))
    for name in (font['file'], 'SERIF-LICENSE.txt'):
        shutil.copy2(root/'site/assets/fonts'/name, out/name)
    shutil.copy2(root/'site/assets/brand/welfare-logo.webp',out/'welfare-logo.webp')
    shutil.copy2(root/'output/video/archive-content.json', out/'archive-content.json')

    # A readable extraction remains available independently of the website.
    lines = ['# 웅상 아카이빙 작품 원문', '', '출처: 아카이빙작품_출력.pdf. 페이지별 제목·크리에이터·전후 설명·장소·촬영일을 화면 판독하여 옮겼습니다. 원문에 없는 월·일은 보완하지 않았습니다. 크리에이터 이름과 역할은 담당자의 확인 내용을 반영했습니다. 크리에이터는 사진을 수집하고 이야기를 구성한 담당자입니다.', '']
    for work in content['works']:
        lines += [f"## {work['page']:02d} · {work['creator']}", '', f"### {work['title']}", '']
        for key,label in [('before','전'),('after','후')]:
            moment = work[key]
            lines += [f"**{label} · {moment['date']}**", '', moment['location'], '', moment['description'], '']
    (out/'archive-text.md').write_text('\n'.join(lines))
