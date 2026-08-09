# Files staged for deletion

This folder contains material that is not required by the running Sawayatra site or its production build.

- `audits/` — historical audit notes, scorecards, and audit HTML
- `documentation/` — project notes, content baselines, verification reports, and screenshots
- `tests/` — unit/end-to-end tests, test configs, lint config, and the former CI workflow
- `tooling/` — one-off audit, photography, typography, and image-optimization scripts
- `unused-source/` — application modules with no dependency path from any App Router entry
- `unused-public/` — static assets with no application reference
- `metadata/` — operating-system metadata files

The root `tsconfig.json` excludes this folder so archived TypeScript cannot affect the live application build. The archive is recoverable until it is deliberately deleted.
