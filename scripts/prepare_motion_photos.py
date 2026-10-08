"""Encode existing final still frames for responsive photo animations."""
from pathlib import Path
import json, subprocess, sys
sys.path.insert(0, '/private/tmp/ungsang-video-tools')
import imageio_ffmpeg

root = Path(__file__).resolve().parents[1]
out = root/'output/video/pages-02-12'
records = json.loads((out/'manifest.json').read_text())
ff = imageio_ffmpeg.get_ffmpeg_exe()
total = 0
for record in records:
    page = record['page']
    for phase in ('start','end'):
        source = root/f'output/video/page{page:02d}/outpainted/frame_{phase}.png'
        for small in (False,True):
            suffix = '-640' if small else ''
            target = out/f'motion{page:02d}-{phase}{suffix}.webp'
            command = [ff,'-hide_banner','-loglevel','error','-y','-i',str(source)]
            if small:
                command += ['-vf','scale=640:-2:flags=lanczos']
            command += ['-c:v','libwebp','-quality','82' if small else '84','-frames:v','1',str(target)]
            subprocess.run(command,check=True)
            total += target.stat().st_size
    print(f'Prepared page {page:02d}',flush=True)
print(json.dumps({'files':len(records)*4,'bytes':total}))
