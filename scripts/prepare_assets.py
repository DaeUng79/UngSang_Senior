"""Create responsive web assets without changing the supplied photographs."""
from pathlib import Path
from PIL import Image, ImageOps
from fontTools import subset
root = Path(__file__).resolve().parents[1]
photos = root / 'site/assets/photos'
photos.mkdir(parents=True, exist_ok=True)
for n in range(1, 12):
    source = root / f'doc/clean image/image{n}_clean.png'
    with Image.open(source) as im:
        im = ImageOps.exif_transpose(im).convert('RGB')
        for width, quality in ((640, 72), (1080, 78)):
            copy = im.copy()
            copy.thumbnail((width, round(width * im.height / im.width)), Image.Resampling.LANCZOS)
            copy.save(photos / f'{n:02}-{width}.webp', 'WEBP', quality=quality, method=6)
text = ''.join(p.read_text() for p in (root/'site').glob('*') if p.suffix in ('.js','.html'))
for source, target in (('/private/tmp/ungsang-sans.ttf','sans'),('/private/tmp/ungsang-brush.ttf','brush')):
    options = subset.Options()
    options.flavor = 'woff'
    font = subset.load_font(source, options)
    sub = subset.Subsetter(options=options)
    sub.populate(text=text + '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz →←↗▷Ⅱ×ㅇ.')
    sub.subset(font)
    subset.save_font(font, str(root/f'site/assets/fonts/{target}.woff'), options)
for width in (640,1080):
    sizes=[p.stat().st_size for p in photos.glob(f'*-{width}.webp')]
    print(f'{width}px: {sum(sizes)/1024:.0f} KB total, {min(sizes)/1024:.0f}–{max(sizes)/1024:.0f} KB per image')
print('fonts:', {p.name: round(p.stat().st_size/1024) for p in (root/'site/assets/fonts').glob('*.woff')})
