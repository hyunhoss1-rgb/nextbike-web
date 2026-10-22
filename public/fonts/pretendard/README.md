# Pretendard Variable 1.3.9

These are unchanged official WOFF2 dynamic subsets from
<https://github.com/orioncactus/pretendard/tree/v1.3.9>.

Copyright (c) 2021, Kil Hyung-jin. Reserved Font Name: Pretendard.
Distributed under the SIL Open Font License 1.1; see `LICENSE`.

All 92 upstream subsets and their original Unicode ranges are retained. The
`@font-face` rules in `src/app/globals.css` use local URLs and `font-display: optional`.
Browsers request only subsets needed for the page's text. No external stylesheet
or font server is required at runtime. The system font stack remains available
while fonts load or when a glyph is outside Pretendard's original coverage.

Run `python tools/vendor-pretendard.py` from the repository to refresh the pinned
assets and CSS. The checked-in `manifest.json` verifies upstream bytes with
SHA-256 and rejects a silent upstream change. Font assets are not regenerated
during normal application installation or builds.

The optional display policy allows a system font on slow first visits instead of
waiting for the web font or swapping it late. Cached fonts keep the chosen face
on subsequent visits. Unicode coverage and upstream font bytes are unchanged.
