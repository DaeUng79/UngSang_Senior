# 파일 관리 기준

[README로 돌아가기](../README.md) · 2026-10-08 기준

파일을 **사이트 운영에 필요한 것**, **다시 제작하거나 기록을 보존하는 데 필요한 것**, **정리 가능한 것**으로 나눕니다. 웹에서 사용하지 않는 원본도 보존 가치가 있으므로 ‘불필요’와 구별합니다. 이번 정리는 분류·목록 작성이며 원본과 기존 결과물을 삭제하거나 이동하지 않았습니다.

## 1. 매년 사용하는 운영 파일

| 경로 | 역할 | 관리 |
|---|---|---|
| `site/index.html`, `app.js`, `style.css` | 첫 화면, 문의 안내, 전시 연결 | GitHub 보관·Pages 공개 |
| `site/assets/photos/` | 첫 화면 11장, 각 640px·1080px | 교체 전 원본과 이전 공개본 보존 |
| `site/assets/brand/welfare-logo.webp` | 투명 복지관 마크 | 유지 |
| `site/assets/fonts/`, `assets/favicon.svg` | 글꼴·라이선스·아이콘 | 글꼴과 라이선스를 함께 유지 |
| `site/archive/` 최상위 파일 | 2026년 전시 완성본 | 이전 전시로 계속 유지 |
| `scripts/build_public_archive.py` | 완성 자산을 공개 폴더에 복사 | 유지 |
| `scripts/render_archive_gallery.py` | 확정 글·목록으로 HTML 생성 | 유지 |
| `scripts/archive_gallery.html` | 전시 화면 원본 템플릿 | 수정은 여기서 시작 |
| `scripts/archive.css`, `archive.js` | 전시 배치·이름 필터 | 유지 |
| `scripts/motion-sample.css`, `motion-sample.js` | 전체 12작품의 사진·글 전환 | 이름이 sample이어도 현재 운영 필수 |
| `scripts/motion_overlays.json` | 발췌 문구·사진 위 글 위치 | 작품 변경 때 수정 |
| `scripts/prepare_motion_photos.py` | 최종 PNG→반응형 WebP | 사진 변경 때 사용 |
| `scripts/prepare_assets.py` | 첫 화면 사진·부분 글꼴 제작 | 첫 화면 자산 변경 때 사용, 환경 확인 필요 |
| `.github/workflows/pages.yml` | main의 site/ 배포 | 유지 |
| `README.md`, `docs/`, `records/` | 인수인계·기준 데이터 | GitHub 보관, Pages 배포 대상 아님 |

전시 MP4는 자동 재생용으로 사용하지 않아도 ‘영상 간직하기’ 다운로드에 연결되어 있습니다. `site/archive/archive_pageNN_5s.mp4`를 지우면 링크가 끊깁니다.

## 2. 2026년 제작·보존 자료

| 경로 | 보존 이유 | GitHub 취급 |
|---|---|---|
| `doc/` 전체 | 사진·작품집·포스터·기존 HWP 원자료 | 로컬 또는 기관 저장소 |
| `output/video/archive-content.json` | 현재 제작기가 읽는 전체 원문 | 공개 기준 사본만 records/2026에 보관 |
| `output/video/pages-02-12/manifest.json` | 작품 순서·영상·크기·제작 방식 | 공개 기준 사본만 records/2026에 보관 |
| `output/video/pageNN/source-*.png` | PDF에서 추출한 사진 | 기관 보존 |
| `output/video/page01/past_clean.png`, `present_clean.png` | 1페이지 제작 입력 | 기관 보존 |
| `output/video/pageNN/outpainted/frame_start.png`, `frame_end.png` | WebP 재생성에 필요한 최종 프레임 | 반드시 보존 |
| `outpainted/*_expanded.png`, `*_generated.png`, `alignment.json` | 최종 합성·생성 원본·배치 근거 | 재편집·출처 확인용 보존 |
| `output/video/generation-02-12.json`, `batch-02-12-alignment.json`, `pages-02-12-sources.json` | 생성·정렬·원본 연결 기록 | 기관 보존, 로컬 절대경로 포함 가능 |
| `output/video/page01/outpainted/README.md` | 1페이지 제작 정보·프롬프트 | 기관 보존 |
| `output/branding/` | 로고 투명 PNG·출처·편집 프롬프트 | 기관 보존 |
| `output/video/ungsang_pages_01-12_5s.zip` | 12작품 묶음 전달본 | 버전을 표시해 보관 |

기존 ZIP은 생성 시점의 묶음이며, 이후 수정한 사이트 로고·CSS 등이 자동 반영되지 않습니다. ‘항상 최신 사이트 백업’으로 간주하지 않습니다. 현재 웹 상태는 `site/`와 Git 커밋으로 보존합니다.

### 2026년 전용 제작 스크립트

아래 스크립트는 매년 그대로 실행하는 공통 운영 도구가 아닙니다. 현재 로컬에 보존하며 새 작업에 사용할 때 페이지·좌표·파일명을 조정합니다.

- `extract_archive_pages.py`: 작품집 2~12페이지 사진 추출
- `prepare_archive_batch.py`: 2~12페이지 확장 가이드·좌표 작성
- `create_archive_batch_videos.py`: 2~12페이지 합성·MP4·프레임 제작
- `prepare_page01_outpaint.py`, `create_page01_outpainted_video.py`: 채택한 1페이지 방식
- `package_archive_batch.py`: 제작 이력 포함 ZIP 구성

내장 이미지 생성 도구의 편집은 별도 작업입니다. 이 스크립트들만으로 AI 생성 원본이 자동 재현되지는 않습니다.

## 3. 정리 대상과 삭제 조건

| 파일·폴더 | 분류 | 정리 기준 |
|---|---|---|
| `.DS_Store`, `scripts/__pycache__/` | 자동 생성 캐시 | 업무·웹 운영에 불필요, 삭제 가능 |
| `tmp/pdfs/` | PDF 판독 이미지·비교 화면·로그 | 원자료·확정 원문·최종 프레임 보존 후 삭제 가능 |
| `output/video/page01/aligned_*.png` | 초기 정합 시안 | 채택한 outpainted 최종본과 제작 기록 보존 후 별도 시안 보관 또는 삭제 |
| `page01/archive_page01_5s.mp4`, `archive_page01_aligned_5s.mp4` | 초기 영상 시안 | 최종 다운로드 영상과 혼동하지 않도록 구분 |
| `scripts/create_page01_video.py`, `create_page01_aligned_video.py` | 초기 시안용 코드 | 웹 운영에 불필요, 시안 이력과 함께 별도 보관 가능 |
| `scripts/motion_sample.html` | 1작품 실험 화면 원본 | 전체 전시는 archive_gallery.html을 사용, 시안 보관 가능 |
| `output/video/ungsang_pages_02-12_5s.zip` | 1페이지 추가 전 전달본 | 최신 1~12페이지 묶음·원자료 확보 후 구버전 보관 또는 삭제 |
| `pages-02-12/poster*.jpg`, `frame_transition.png`, 확장 가이드 이미지 | 재생성 가능한 중간 결과 | 편집을 마감하고 재제작 입력이 보존된 후 정리 가능 |
| `/private/tmp/ungsang-pages-publish` | 임시 Git 배포 사본 | 원격 반영과 영구 작업 사본 확보 후 정리 가능 |

`past_generated.png`와 `present_generated.png`는 임시 이미지처럼 보여도 AI 생성 결과를 재현·설명하는 근거입니다. 정리 대상에서 제외합니다. 최종 `frame_start.png`, `frame_end.png`도 웹페이지에서 직접 읽지 않지만 보존합니다.

## 4. 환경과 재제작 한계

| 작업 | 필요한 환경 |
|---|---|
| 공개 사이트 열기 | 웹 브라우저 |
| 로컬 미리보기·기존 미디어로 HTML 재생성 | Python 3 표준 라이브러리 |
| PNG→WebP·MP4 제작 | Python, `imageio-ffmpeg` 및 FFmpeg 실행 환경 |
| PDF 사진 추출·일부 합성 계산 | `pypdf`, `Pillow` |
| 첫 화면 사진·글꼴 제작 | `Pillow`, `fonttools`, 원본 TTF |
| AI 편집 | 이미지 편집 도구와 별도로 보존한 입력·프롬프트 |

제작 스크립트는 임시 패키지 경로 `/private/tmp/ungsang-video-tools`를 우선 참조하지만 일반 Python 환경의 `imageio_ffmpeg`도 불러올 수 있습니다. 새 환경에서는 가상환경에 해당 패키지를 설치해 사용합니다. 임시 폴더 자체를 백업 환경으로 삼지 않습니다.

`prepare_assets.py`는 `/private/tmp/ungsang-sans.ttf`, `/private/tmp/ungsang-brush.ttf`를 고정 참조합니다. 사진 11장을 먼저 덮어쓴 다음 글꼴을 만들기 때문에, **글꼴 준비 여부를 확인하기 전에 실행하지 않습니다.** 현재 WOFF와 라이선스는 `site/assets/fonts/`에 있습니다. 새 원본 글꼴을 확보한 경우 경로를 수정한 작업 사본에서 사용합니다.

`build_public_archive.py`는 대상 폴더에서 오래된 파일을 지우지 않습니다. 작품 수가 줄거나 파일명이 달라지면 참조되지 않는 공개 자산을 별도로 검토합니다. 연도별 하위 전시 폴더는 보존합니다.

## 5. 보관·공개 원칙

- `.gitignore`로 `doc/`, `output/`, `tmp/`, `work/`, 가상환경·캐시를 제외합니다. 무시 규칙은 이미 커밋한 파일을 숨기거나 삭제하지 않습니다.
- 운영 문서와 공개 원문 데이터는 GitHub에서 버전 관리합니다. 내부 담당자 연락처·동의 서류·행정 원문은 기관 저장소에서 관리합니다.
- 파일 보존 목록의 해시는 2026-10-08 작성 시점 기준입니다. 수정 후 달라지는 것은 정상이며, 연도 마감 때 새 목록을 남깁니다.
- 사이트 복구에는 `site/`와 배포 설정이, 글 수정에는 기준 데이터와 템플릿이, 사진 재제작에는 원본·최종 프레임·제작 이력이 추가로 필요합니다.
