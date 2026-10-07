# 웅상을 기억하는 방법

웅상 아카이빙 모바일 웹 전시. HTML/CSS/JavaScript만 사용하는 GitHub Pages용 정적 사이트입니다.

## 미리보기

`python3 -m http.server 8765 --directory site` 실행 후 http://localhost:8765 접속.

## GitHub Pages 배포

1. 이 폴더를 GitHub 저장소의 `main` 브랜치로 올립니다. 원본 `doc` 폴더는 `.gitignore`로 제외했습니다.
2. 저장소 Settings → Pages → Build and deployment → Source에서 **GitHub Actions**를 선택합니다.
3. Actions에서 Publish archive to GitHub Pages를 실행합니다. `site` 폴더만 공개됩니다.

참고: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## 내용과 접수 주소 수정

- 11개 장면의 문구·사진 순서·지속 시간: `site/app.js`의 `scenes`.
- 전시 원문 및 참여 안내: `site/index.html`.
- 문의 화면의 전화·이메일: `site/index.html`의 `tel:` 및 `mailto:` 링크. 별도 접수·업로드 기능은 포함하지 않았습니다.
- 글꼴은 설명 이미지의 분위기를 참고한 Noto Sans KR와 Nanum Brush Script입니다. 이미지의 원래 글꼴은 확인되지 않았으므로 동일 서체라고 가정하지 않았습니다. OFL 라이선스 파일을 포함했습니다.
- 글꼴은 사용 문자를 추려 압축했습니다. 새로운 문구로 바꾸면 `scripts/prepare_assets.py`로 다시 생성하거나 필요한 문자의 폴백 서체가 표시됩니다. 원본 글꼴 경로는 스크립트를 참고하세요.

## 모바일 동작

총 약 92초, 마지막 장면에서 정지합니다. 일시정지, 장면 선택, 좌우 넘기기, 키보드 방향키, 글로 읽기를 지원합니다. 다른 탭으로 이동하거나 안내 창을 열면 재생 시간이 멈춥니다. 모션 줄이기 및 데이터 절약 설정은 자동 재생을 끕니다.

640px/1080px WebP 두 크기를 제공하며, 모바일은 첫 사진 이후 640px 버전을 사용합니다. 일반 연결은 다음 사진 한 장만 미리 읽고, 느린 연결·데이터 절약에서는 미리 읽지 않습니다. 배경 사진은 앞서 AI로 글자를 지운 결과물로 원본과 세부 묘사가 다를 수 있습니다.
