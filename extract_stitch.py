import zipfile
import os
import sys

src = os.path.join(os.path.dirname(__file__), 'kissan saathi.zip')
dst = os.path.join(os.path.dirname(__file__), 'stitch_export')

print(f"Extracting {src} to {dst}")
with zipfile.ZipFile(src, 'r') as z:
    z.extractall(dst)
print("Done!")
for root, dirs, files in os.walk(dst):
    level = root.replace(dst, '').count(os.sep)
    indent = ' ' * 2 * level
    print(f'{indent}{os.path.basename(root)}/')
    subindent = ' ' * 2 * (level + 1)
    for file in files:
        print(f'{subindent}{file}')
