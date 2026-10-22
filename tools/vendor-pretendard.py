#!/usr/bin/env python3
"""Vendor the complete, pinned Pretendard Variable dynamic subsets.

Run from any directory with Python 3. Assets use HTTPS certificate verification.
An existing manifest pins upstream bytes so refreshing cannot silently replace them.
No font subsetting or glyph removal is performed here.
"""

from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path
import re
import urllib.parse
import urllib.request


ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "public/fonts/pretendard"
BASE = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/"
CSS_PATH = "dist/web/variable/pretendardvariable-dynamic-subset.css"
START = "/* BEGIN vendored Pretendard v1.3.9 dynamic subsets */"
END = "/* END vendored Pretendard v1.3.9 dynamic subsets */"


def download(url):
    with urllib.request.urlopen(url, timeout=30) as response:
        return response.read()


def digest(content):
    return hashlib.sha256(content).hexdigest()


def main():
    css_bytes = download(BASE + CSS_PATH)
    license_bytes = download(BASE + "LICENSE")
    css = css_bytes.decode("utf-8")
    sources = re.findall(r"url\(([^)]+)\)", css)
    if len(sources) != 92 or len(set(sources)) != 92:
        raise RuntimeError("Unexpected upstream subset list; review before updating.")

    def fetch_font(relative):
        url = urllib.parse.urljoin(BASE + CSS_PATH, relative)
        name = Path(urllib.parse.urlparse(url).path).name
        content = download(url)
        if not content.startswith(b"wOF2"):
            raise RuntimeError(f"Expected a WOFF2 font: {name}")
        return name, content

    with ThreadPoolExecutor(max_workers=6) as pool:
        fonts = dict(pool.map(fetch_font, sources))
    hashes = {name: digest(content) for name, content in sorted(fonts.items())}
    hashes["upstream-css"] = digest(css_bytes)
    hashes["LICENSE"] = digest(license_bytes)
    manifest = {"version": "1.3.9", "source": BASE, "sha256": hashes}
    manifest_path = TARGET / "manifest.json"
    if manifest_path.exists() and json.loads(manifest_path.read_text()) != manifest:
        raise RuntimeError("Upstream bytes differ from the checked-in manifest; review the change.")

    local_css = re.sub(
        r"url\(([^)]+)\)",
        lambda match: "url('/fonts/pretendard/" + Path(match.group(1)).name + "')",
        css,
    )
    # Avoid late font swaps on slow connections; use the system stack until cached.
    local_css = local_css.replace("font-display: swap;", "font-display: optional;")
    block = START + "\n" + local_css.rstrip() + "\n" + END
    globals_path = ROOT / "src/app/globals.css"
    current = globals_path.read_text()
    if START in current:
        current = re.sub(re.escape(START) + r".*?" + re.escape(END), lambda _: block, current, flags=re.S)
    else:
        current = block + "\n\n" + current.lstrip("\n")

    TARGET.mkdir(parents=True, exist_ok=True)
    for name, content in fonts.items():
        (TARGET / name).write_bytes(content)
    (TARGET / "LICENSE").write_bytes(license_bytes)
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    globals_path.write_text(current)
    print(f"Vendored {len(fonts)} unchanged WOFF2 subsets ({sum(map(len, fonts.values())):,} bytes).")


if __name__ == "__main__":
    main()
