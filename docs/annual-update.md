# 매년 기록물을 사이트에 반영하는 절차

[README로 돌아가기](../README.md) · 기준일 2026-10-08

## 운영 방식

기본안은 **이전 전시를 보존하고 새 연도를 추가**하는 것입니다. 현재 2026년 전시 주소 `/archive/`는 유지하고, 다음 전시는 `/archive/2027/`처럼 추가합니다. 아래의 2027은 예시 연도입니다.

현재 사이트는 연도 선택 메뉴와 연도별 자동 제작 기능을 갖추고 있지 않습니다. 이 문서는 현재 제작기를 연도별 작업 사본에서 사용하는 절차입니다. 2026년 파일을 이동하거나 새 연도 화면을 미리 공개하지 않았습니다.

| 담당 | 준비·수행할 일 |
|---|---|
| 사업 담당자 | 작품 선정, 원문·이름·촬영 시기 확정, 원본 확보, 공개 범위 확인, 최종 화면 확인 |
| 사진·콘텐츠 작업자 | 사진 추출, 웹용 편집, 두 시점 배치, 최종 프레임·WebP·MP4 제작, 발췌 문구 정리 |
| 웹 담당자 | 데이터 입력, 전시 생성, 연도 링크 연결, 미리보기, GitHub 반영, 배포 기록 |

## 1. 연간 자료를 확정합니다

[작품 정리 양식](templates/works.csv)을 복사해 한 작품에 한 행씩 작성합니다.

- 관리번호: `2027-001`처럼 연도와 순번을 함께 기록합니다.
- 크리에이터 이름, 작품 제목, 과거·현재 사진 파일을 각각 적습니다.
- 크리에이터는 사진 수집·이야기 구성 담당자입니다. 사진 제공자, 사진 속 인물, 이야기의 주체와 구분합니다. 이름별 안내를 ‘해당 크리에이터가 엮은 기록’으로 작성하고, 1인칭 원문을 크리에이터 개인의 경험으로 바꾸지 않습니다.
- 과거·현재의 장소, 촬영 연월일, 설명을 별도로 작성합니다.
- 원문에 연도만 있으면 월·일을 임의로 붙이지 않습니다. 알 수 없는 값은 담당자가 확정한 표기로 기재합니다.
- 사진 위에는 짧은 발췌 문구를, 사진 옆·아래에는 전체 설명을 표시합니다.
- 공개 확인 상태와 담당자 확인일은 내부 관리 대장에 기록합니다. 동의서·개인 연락처는 공개 저장소에 넣지 않습니다.

첫 화면 사진 11장과 작품 전시 12건은 별도입니다. 새 작품의 개수가 바뀌어도 첫 화면 사진을 반드시 같은 수로 만들 필요는 없습니다.

## 2. 원본과 작업 공간을 준비합니다

연도별 원본은 기관의 보존 저장소에 다음처럼 모읍니다. 이는 권장 보관 구조이며 현재 2026년 원본 경로를 옮긴 것은 아닙니다.

```text
2027/
  originals/       받은 원본 사진·PDF
  text/            확정 원문·작품 대장
  working/         편집본·프레임·배치 정보
  final/           공개용 WebP·MP4·완성 전시
  administration/  계획·결과·공개 확인 관련 내부 문서
```

현행 제작기는 `output/video/pages-02-12/` 등 고정 경로를 사용합니다. 따라서 새 연도는 프로젝트 안의 **`work/2027/`라는 별도 작업 사본**에서 만듭니다. 메인 프로젝트의 2026년 `output/`을 새 자료로 덮어쓰지 않습니다.

프로젝트 루트에서 아래 명령은 **처음 한 번**만 실행합니다. `work/2027/`이 이미 있으면 중단하도록 작성되어 있습니다.

```sh
python3 - <<'PY'
from pathlib import Path
import shutil
root = Path.cwd()
stage = root / 'work/2027'
stage.mkdir(parents=True, exist_ok=False)
shutil.copytree(root / 'scripts', stage / 'scripts',
                ignore=shutil.ignore_patterns('__pycache__'))
(stage / 'site/assets/brand').mkdir(parents=True)
shutil.copy2(root / 'site/assets/brand/welfare-logo.webp',
             stage / 'site/assets/brand/welfare-logo.webp')
shutil.copytree(root / 'site/assets/fonts', stage / 'site/assets/fonts')
(stage / 'output/video/pages-02-12').mkdir(parents=True)
print(stage)
PY
```

`work/2027/scripts/motion_overlays.json`은 복사된 2026년 자료입니다. 아래 단계에서 새 작품 전체로 교체해야 합니다.

## 3. 사진과 영상을 준비합니다

1. 원본을 보관한 뒤 PDF 내부 사진을 추출합니다. PDF의 제목·이름 등 편집 문자와 사진 자체의 간판·촬영일 표시는 구분합니다.
2. 과거·현재를 같은 화면 크기로 배치합니다. 원본 인물·건물·주요 지형을 유지하고, 촬영 방향이 다르면 무리하게 겹치지 않습니다.
3. 여백 확장은 필요한 작품만 판단합니다. 과거에 없던 현대 건물이나 확인할 수 없는 사물을 만들어 넣지 않습니다. 생성 영역과 원본을 구분해 기록합니다.
4. 최종 프레임을 `work/2027/output/video/page01/outpainted/frame_start.png`, `frame_end.png` 형태로 저장합니다. 번호는 새 연도 안의 작품 순번입니다.
5. 각 작품의 MP4를 `work/2027/output/video/pages-02-12/archive_page01_5s.mp4` 형태로 저장합니다. 현행 화면에는 다운로드 링크가 있으므로 MP4도 준비합니다. 영상을 제공하지 않는 사업이면 제작기를 수정해 링크를 제거해야 합니다.
6. 두 프레임의 크기를 같게 하고 `manifest.json`의 `size`에 실제 큰 WebP와 같은 폭·높이를 적습니다. 모바일용은 640px입니다. 현재 자산은 큰 쪽 폭이 1070 또는 1152px입니다.

2026년 전용 `extract_archive_pages.py`는 **2~12페이지**, `prepare_archive_batch.py`는 **사진별 고정 좌표**, `create_archive_batch_videos.py`는 **고정된 AI 확장 대상**을 사용합니다. 새 PDF에 그대로 실행하는 공통 도구가 아닙니다. 새 연도에는 페이지 수·사진 순서·좌표를 검토해 작업 사본의 스크립트를 수정하거나 최종 프레임을 별도 제작합니다.

특히 `create_archive_batch_videos.py`를 인자 없이 실행하면 2~12페이지 목록을 새로 작성하므로 기존 1페이지 항목이 빠집니다. 2026년 일부 수정은 해당 페이지 번호를 인자로 지정하고 1페이지 최종본을 보존합니다.

사진 인코딩이 필요하면 Python 가상환경에 `imageio-ffmpeg`를 준비한 뒤, 완성 프레임과 다음 단계의 manifest가 갖춰진 상태에서 실행합니다.

```sh
python3 work/2027/scripts/prepare_motion_photos.py
```

다음 네 파일이 작품별로 만들어집니다.

```text
motion01-start.webp       과거 큰 사진
motion01-start-640.webp   과거 모바일 사진
motion01-end.webp         현재 큰 사진
motion01-end-640.webp     현재 모바일 사진
```

`prepare_motion_photos.py`는 PNG를 WebP로 변환하며 AI 생성이나 구도 정렬을 하지 않습니다. 외부 패키지·원본 글꼴 등 환경 관련 사항은 [파일 관리 기준](file-management.md)을 참고합니다.

## 4. 작품 데이터 세 가지를 작성합니다

### A. 전체 원문

경로: `work/2027/output/video/archive-content.json`

```json
{
  "source": "2027년 확정 작품집.pdf",
  "extraction_method": "원본 대조 후 담당자가 확정한 문구",
  "works": [{
    "page": 1,
    "creator": "크리에이터 이름",
    "title": "작품 제목",
    "before": {"location": "과거 촬영 장소", "date": "촬영 시기", "description": "과거 사진의 전체 설명"},
    "after": {"location": "현재 촬영 장소", "date": "2027년", "description": "현재 사진의 전체 설명"}
  }]
}
```

### B. 사진 위 발췌 글과 배치

경로: `work/2027/scripts/motion_overlays.json`

```json
{
  "1": {
    "anchor": "top-right",
    "before": {"place": "짧게 쓴 과거 장소", "quote": "과거 설명에서\n발췌한 짧은 문장"},
    "after": {"place": "짧게 쓴 현재 장소", "quote": "현재 설명에서\n발췌한 짧은 문장"}
  }
}
```

`anchor`는 현재 CSS가 지원하는 `top-right`, `top-left`, `bottom-right` 중 선택합니다. 인물 얼굴·주요 건물을 피하고 필요하면 `"narrow": true`를 추가합니다. JSON의 `\n`은 줄바꿈입니다. 날짜는 A의 원문에서 가져옵니다.

### C. 작품 순서와 파일 정보

경로: `work/2027/output/video/pages-02-12/manifest.json`

```json
[
  {"page": 1, "file": "archive_page01_5s.mp4", "size": [1152, 960]}
]
```

이는 HTML 생성에 필요한 최소 예시입니다. 실제 크기로 바꾸고, 보존용 목록에는 2026년 예시처럼 `mode`, `note`, `duration`, `fps`, `frames`, `bytes`도 기록합니다. 전체 제작·패키지 스크립트는 이 추가 필드를 사용합니다.

세 파일의 작품 번호와 실제 미디어 파일이 모두 일치해야 합니다. 화면 순서는 manifest의 순서입니다. PDF 페이지와 다르게 정리했다면 작품 대장의 원본 페이지 열에 원래 쪽수를 남깁니다.

## 5. 새 연도 전시를 생성하고 연결합니다

먼저 작업 사본의 `archive_gallery.html`에서 제목·연도·소개글·연락처를 고칩니다. `render_archive_gallery.py`가 쓰는 `archive-text.md`의 고정 출처 문구도 새 원본 명칭에 맞춥니다. 첫 작품만 큰 글씨를 사용하는 현행 `page != 1` 규칙도 새 구성에 맞는지 확인합니다.

확정 문구에 맞춰 전시 명조 웹폰트를 준비합니다. Noto Serif KR 원본 TTF는 기관 보존본 또는 [공식 글꼴 저장소](https://github.com/google/fonts/tree/main/ofl/notoserifkr)에서 확보합니다. 예시의 원본 경로는 현재 로컬에 보관한 위치이며 GitHub 사본에는 포함하지 않습니다. Python 환경에 `fonttools`와 `brotli`가 필요합니다.

```sh
python3 work/2027/scripts/prepare_archive_font.py --source output/fonts/NotoSerifKR-wght.ttf
```

새 작업 사본의 데이터·템플릿에서 글자를 모아 WOFF2를 만듭니다. 글꼴 파일명에는 내용 해시가 붙어 캐시가 자동 구분되며, 라이선스와 함께 전시 폴더에 복사됩니다. 처음에는 복사한 2026년 글꼴이 들어 있으므로 새 연도 문구가 확정된 뒤 위 명령을 실행합니다.

```sh
python3 work/2027/scripts/build_public_archive.py
```

완성된 `work/2027/site/archive/`를 새 공개 폴더로 옮깁니다. 아래 명령은 **처음 게시할 때만** 사용하며 기존 연도 폴더가 있으면 중단합니다.

```sh
python3 - <<'PY'
from pathlib import Path
import shutil
root = Path.cwd()
source = root / 'work/2027/site/archive'
target = root / 'site/archive/2027'
shutil.copytree(source, target)
page = target / 'index.html'
page.write_text(page.read_text().replace('href="../"', 'href="../../"'))
PY
```

홈 링크가 한 단계 더 깊어지므로 `../../`로 고칩니다. 사진·CSS·JS·다운로드 링크는 같은 폴더 내 상대 경로여서 그대로 동작합니다. 후속 수정으로 재생성할 때도 공개 사본의 홈 링크 변환을 반복합니다.

다음 링크를 웹 담당자가 반영합니다.

- 첫 화면 `site/index.html`: `href="./archive/"` → `href="./archive/2027/"`.
- 2026년 전시의 원본 템플릿 `scripts/archive_gallery.html`: `href="./2027/"`인 ‘2027년 전시’ 링크 추가 후 2026년 생성기를 실행합니다.
- 새 전시의 작업 템플릿 `work/2027/scripts/archive_gallery.html`: `href="../"`인 ‘2026년 전시’ 링크는 위 홈 링크 일괄 변환과 충돌하므로 **`href="../index.html"`**로 작성합니다. 새 전시를 재생성·복사합니다.
- 새 연도 데이터 세 파일은 `records/2027/`에 확정 사본으로 보존합니다. 새 템플릿·수정 스크립트도 연도별 인수인계 자료에 함께 보관합니다.

아직 후속 연도 전시가 없는 현재는 위 링크를 추가하지 않습니다. 2026년 `/archive/#page01` 등 기존 작품 링크는 유지합니다.

2028년 이후에도 같은 방식으로 새 하위 폴더를 추가하고, 이미 공개된 연도별 링크를 모두 유지합니다. 작업 사본의 템플릿 변경도 함께 보존해야 다음 재생성 때 연도 메뉴가 사라지지 않습니다.

## 6. 담당자가 미리보기를 확인합니다

```sh
python3 -m http.server 8765 --directory site
```

모바일과 PC에서 확인할 항목:

- 새 연도 작품 수·이름·제목·전후 사진 연결이 맞는가?
- 날짜·장소·설명이 원문과 같은가? 사진 전환과 글 전환이 맞는가?
- 사진이 갑자기 원래 크기로 돌아가거나 인물 위에 긴 글이 겹치지 않는가?
- 이름별 필터, 일시정지, 영상 다운로드, 처음으로·이전 연도 링크가 동작하는가?
- 로고 배경이 투명하고 하단 마크·글자가 가운데 정렬되는가?
- 2026년 기존 전시와 첫 화면도 그대로 열리는가?

이 항목은 앞으로 공개할 때 담당자가 사용하는 절차입니다. 이 문서 작성 과정에서 새 연도 전시를 생성하거나 위 화면 검수를 수행한 것은 아닙니다.

## 7. GitHub에 반영하고 연도를 마감합니다

1. Git 체크아웃에서 최신 `main`을 가져옵니다. 작업 폴더와 체크아웃이 다르면 변경된 공개 파일과 관리 문서를 복사합니다.
2. 변경 목록을 보고 `site/`, 공개용 스크립트, 확정 데이터, 운영 문서만 커밋합니다. 새 전시에 필요 없는 이전 작업 파일이 섞이지 않았는지 살핍니다.
3. `main`에 푸시하면 현재 workflow가 `site/`를 배포합니다. Actions의 **Publish archive to GitHub Pages** 완료 상태를 확인합니다.
4. 공개 주소에서 담당자가 최종 확인하고 [인수인계 양식](templates/year-handover.md)에 주소·일시·커밋·확인자를 적습니다.
5. 기관 보존 저장소에 원본, 최종 프레임, 생성 기록, 확정 데이터, 공개 폴더, 제작 스크립트와 기본 문서를 함께 보관합니다.

Git 체크아웃 안에서 사용하는 명령 예시입니다. `git pull`은 작업 파일을 복사하기 전에 실행합니다. 충돌이나 다른 사람의 수정이 있으면 먼저 내용을 합친 뒤 진행합니다.

```sh
git pull --ff-only origin main
# 수정한 공개 파일과 운영 자료를 이 체크아웃에 반영한 다음:
git status --short
git add site scripts docs records README.md .gitignore
git commit -m "Publish 2027 archive"
git push origin main
```

문제가 있으면 배포 기록의 정상 커밋에서 필요한 `site/` 파일을 복구해 새 커밋으로 재배포합니다. 원격 이력을 강제로 덮어쓰지 않습니다. 여러 연도의 전시가 함께 있는 `site/archive/` 전체를 무심코 삭제·교체하지 않습니다.

## 2026년 글이나 배치만 수정할 때

로컬의 기존 `output/`이 있으면 README의 수정 원본을 고친 뒤 `python3 scripts/build_public_archive.py`를 실행합니다.

**GitHub에서 새로 받은 사본**에는 원자료가 없지만, 이미 공개한 미디어와 `records/2026/` 기준 데이터로 글·배치를 다시 만들 수 있습니다. 아래 복원은 최초 한 번만 실행하며 기존 작업 데이터가 있으면 중단합니다.

```sh
python3 - <<'PY'
from pathlib import Path
import shutil
root = Path.cwd()
out = root / 'output/video/pages-02-12'
content = root / 'output/video/archive-content.json'
if out.exists() or content.exists():
    raise SystemExit('기존 작업 데이터가 있습니다. 복원 대신 현재 자료를 사용하세요.')
out.mkdir(parents=True)
for pattern in ('motion*.webp', 'archive_page*_5s.mp4'):
    for asset in (root / 'site/archive').glob(pattern):
        shutil.copy2(asset, out / asset.name)
shutil.copy2(root / 'records/2026/manifest.json', out / 'manifest.json')
shutil.copy2(root / 'records/2026/archive-content.json', content)
print('2026년 글·배치 수정용 작업 데이터를 복원했습니다.')
PY
```

`scripts/motion_overlays.json`은 저장소의 현재 편집 원본입니다. `records/2026/motion_overlays.json`은 기준 사본이므로 편집 중인 파일 위에 자동으로 덮어쓰지 않습니다.

수정·생성·확인 후에는 세 데이터의 기준 사본, 작품 대장과 배포 기록도 함께 갱신합니다. 이 복원은 원본 사진·AI 생성 원본·최종 PNG 프레임을 복구하지 않습니다. 사진을 다시 편집하려면 로컬 보존 자료가 필요합니다.

새 글자를 넣어 생성기가 ‘전시 웹폰트에 새 글자가 필요합니다’라고 안내하면 원본 TTF를 확보하고 `python3 scripts/prepare_archive_font.py --source output/fonts/NotoSerifKR-wght.ttf`를 실행한 뒤 다시 전시를 생성합니다. 새 WOFF2와 `archive-serif.json`도 GitHub에 함께 반영합니다. 기존 글자를 그대로 사용하는 배치 수정은 글꼴 재생성 없이 가능합니다.
