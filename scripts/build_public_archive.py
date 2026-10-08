"""Publishable gallery assets for the existing GitHub Pages site."""
from pathlib import Path
import json
import shutil
from render_archive_gallery import render

root = Path(__file__).resolve().parents[1]
source = root/'output/video/pages-02-12'
target = root/'site/archive'
target.mkdir(parents=True,exist_ok=True)
records = json.loads((source/'manifest.json').read_text())
render(root,records)
files = [source/name for name in ('index.html','archive.css','archive.js','motion-sample.css','motion-sample.js','welfare-logo.webp')]
files += list(source.glob('motion*.webp'))
files += [source/record['file'] for record in records]
for file in files:
    shutil.copy2(file,target/file.name)
p = target/'index.html'
p.write_text(p.read_text().replace('href="https://daeung79.github.io/UngSang_Senior/"','href="../"'))
print(f'Prepared {len(records)} works and {len(files)} public files in {target}')
