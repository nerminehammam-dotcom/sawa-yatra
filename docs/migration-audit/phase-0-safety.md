# Andean Caravan migration — Phase 0 safety record

Date: 2026-08-09  
Migration branch: `migration/andean-caravan-v1-3`  
Pre-migration branch: `main`  
Pre-migration rollback SHA: `8dddebe5b25307513b9923869f726cb7b305fe2e`

## Current two-file authority

The founder supplied Website Content Migration Prompt v2.0 on 10 August 2026.
It explicitly supersedes v1.3 and every earlier website prompt, and establishes
the Route Master plus v2.0 prompt as the complete execution brief. The Route
Master hash is unchanged, so the previously completed 73-page end-to-end read,
render check, comment check and tracked-change check remain valid.

| Current source | Version | SHA-256 |
| --- | --- | --- |
| `Sawayatra-01-Andean-Caravan-Route-Master-v4_2_1-LOCKED.docx` | v4.2.1 · locked · names approved | `15d8b91c11778c18a090dcca4285121cc18d42068516e5b25a2c2277a2cca88e` |
| `Sawayatra-03-Website-Content-Migration-Prompt-v2_0.md` | v2.0 · content migration only | `a19d2d5362f0bb73c15b4fd25509246e7785cd5a361419c7e22a93afeecdaff0` |

Current authority:

- route truth comes from the Route Master;
- scope, sequencing, copy governance and acceptance come from v2.0;
- no design brief or design-decision file participates in this build; and
- the v2.0 no-design rule overrides residual design wording elsewhere inside
  the prompt itself.

## Superseded source verification history

All five supplied files were read completely. The Route Master was also rendered as 73 pages and checked for unresolved comments and tracked changes; none were present.

| Source | Version | SHA-256 |
| --- | --- | --- |
| `Sawayatra-01-Andean-Caravan-Route-Master-v4_2_1-LOCKED.docx` | v4.2.1 · locked · names approved | `15d8b91c11778c18a090dcca4285121cc18d42068516e5b25a2c2277a2cca88e` |
| `Sawayatra-02-Caravan-Experience-Design-Brief-v1_1-LOCKED.md` | v1.1 · locked | `0a7db3fa6004a96715866ea2ab1a0d4fdd375abae494a0898a6797c70f8dc21f` |
| `Sawayatra-03-Website-Build-Prompt-v1_3-EXECUTION-LOCK.md` | v1.3 · execution lock | `dd45c4fc9acfdc9d0bea5325de27883b48f1e8c89a519fcbba723cba78e577c7` |
| `Sawayatra-04-Caravan-Design-Decisions-DD01-DD05-v1_2-LOCKED.md` | v1.2 · locked | `979374f8d7fe462ea3180e84ed2277ef46292e98c6caa2d3cb1c98419ace0eb9` |
| `Sawayatra-05-Publications-Build-Prompt-v1_0.md` | v1.0 | `47852cb137071166604ca821292def53eacc63ac4571676d6aad970f99a39933` |

## Superseded authority and scope

This was the authority order before v2.0 was supplied. It is retained only as
an audit trail and no longer governs implementation.

## Rollback procedure

The pre-migration site is recoverable at `8dddebe5b25307513b9923869f726cb7b305fe2e` and on GitHub `main` at the time this branch was created.

1. Stop new deployment promotion and record the current migration SHA.
2. Revert migration commits in reverse phase order; do not rewrite published history.
3. Restore the pre-migration content model and Caravan components by reverting the relevant phase commits.
4. Restore map components and map projection from the same phase checkpoint.
5. Restore Journeys integration and enquiry handoff together so no entry points lead to missing surfaces.
6. Revert redirect configuration only after confirming cache consequences. Permanent redirects may persist in browsers and intermediaries after a code rollback.
7. Restore sitemap, canonicals, structured data and internal links with the URL rollback.
8. Redeploy commit `8dddebe5b25307513b9923869f726cb7b305fe2e` if a full application rollback is required.
9. Re-run build, lint, typecheck and the available tests before promoting the rollback.

No environment variables, infrastructure or unrelated dependencies are authorised for this migration.
