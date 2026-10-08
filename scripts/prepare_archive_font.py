"""Build a small, self-hosted serif from the archive's actual text.

Only the CLI needs FontTools and Brotli. The renderer uses the standard-library
helpers to catch new characters before publishing a stale font subset.
"""
from pathlib import Path
from html.parser import HTMLParser
import argparse
import hashlib
import json
import string


class VisibleText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)


def archive_characters(root):
    parser = VisibleText()
    parser.feed((root / 'scripts/archive_gallery.html').read_text())
    parts = parser.parts + [string.printable]

    def strings(value):
        if isinstance(value, str):
            parts.append(value)
        elif isinstance(value, dict):
            for item in value.values():
                strings(item)
        elif isinstance(value, list):
            for item in value:
                strings(item)

    for path in ('output/video/archive-content.json', 'scripts/motion_overlays.json'):
        strings(json.loads((root / path).read_text()))
    for path in ('scripts/archive.js', 'scripts/motion-sample.js', 'scripts/render_archive_gallery.py'):
        parts.append((root / path).read_text())
    return {char for char in ''.join(parts) if not char.isspace()}


def archive_font(root):
    folder = root / 'site/assets/fonts'
    info = json.loads((folder / 'archive-serif.json').read_text())
    missing = archive_characters(root) - set(info['characters'])
    if missing:
        raise ValueError('전시 웹폰트에 새 글자가 필요합니다. prepare_archive_font.py를 먼저 실행하세요: '
                         + ''.join(sorted(missing)))
    if not (folder / info['file']).is_file():
        raise FileNotFoundError(folder / info['file'])
    return info


def main():
    from fontTools import subset
    from fontTools.ttLib import TTFont
    from fontTools.varLib.instancer import instantiateVariableFont

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True, help='Original Noto Serif KR TTF')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    characters = archive_characters(root)
    font = TTFont(args.source)
    if 'fvar' in font:
        font = instantiateVariableFont(font, {'wght': 400}, inplace=True)
    # Keep the original copyright/license records, give the derivative a new name.
    names = {1: 'Ungsang Archive Serif', 2: 'Regular',
             3: 'UngsangArchiveSerif-Regular', 4: 'Ungsang Archive Serif Regular',
             6: 'UngsangArchiveSerif-Regular', 16: 'Ungsang Archive Serif', 17: 'Regular'}
    for name_id, value in names.items():
        font['name'].removeNames(nameID=name_id)
        font['name'].setName(value, name_id, 3, 1, 0x409)
    options = subset.Options()
    options.flavor = 'woff2'
    sub = subset.Subsetter(options=options)
    sub.populate(text=''.join(sorted(characters)) + ' ')
    sub.subset(font)
    font.flavor = 'woff2'
    folder = root / 'site/assets/fonts'
    folder.mkdir(parents=True, exist_ok=True)
    import io
    buffer = io.BytesIO()
    font.save(buffer)
    data = buffer.getvalue()
    digest = hashlib.sha256(data).hexdigest()
    filename = f'archive-serif-{digest[:12]}.woff2'
    (folder / filename).write_bytes(data)
    info = {
        'family': 'Ungsang Archive Serif', 'weight': 400, 'file': filename,
        'sha256': digest, 'bytes': len(data), 'characters': ''.join(sorted(characters)),
        'source': 'https://github.com/google/fonts/tree/main/ofl/notoserifkr',
        'source_sha256': hashlib.sha256(args.source.read_bytes()).hexdigest(),
        'license': 'SERIF-LICENSE.txt',
    }
    (folder / 'archive-serif.json').write_text(json.dumps(info, ensure_ascii=False, indent=2) + '\n')
    print(f'Prepared {filename}: {len(data):,} bytes, {len(characters)} requested characters')


if __name__ == '__main__':
    main()
