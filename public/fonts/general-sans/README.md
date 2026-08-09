# General Sans — self-hosted files (action needed)

Constitution §6.2 makes General Sans the operational face. The CSS is fully
wired (`app/globals.css` @font-face → `--font-read` in `styles/tokens.css`);
only the font binaries are missing, because Fontshare's CDN cannot be reached
from the build sandbox and the license (ITF Free Font License) should be
accepted by the author anyway.

To finish:

1. Download General Sans (free) from https://www.fontshare.com/fonts/general-sans
2. From the web-font package, copy the woff2 files for Regular, Medium and
   Semibold into this folder named exactly:
   - `general-sans-400.woff2`
   - `general-sans-500.woff2`
   - `general-sans-600.woff2`

Until then, operational text falls back to the system sans — never to
Fraunces, so the §6.2 register split is already visible.
