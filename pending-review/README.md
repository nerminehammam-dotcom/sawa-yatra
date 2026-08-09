# pending-review/

The **only** sink for pricing-agent output (spec v3.1 §11.2).

> These are round figures for shape and review only. They are not prices, not
> quotes, and not commitments. No output of this agent may reach a
> member-facing surface.

Rules, enforced by `scripts/guard-spec-tokens.mjs`:

- Nothing under `app/`, `components/`, `content/`, or `lib/` may import from
  this directory. The build reads tokens (`content/spec-tokens.ts`), never
  agent output.
- Files here are proposals awaiting [SIGN-OFF]. A human commits a signed-off
  value into `content/spec-tokens.ts`; the file here is the audit trail of the
  derivation, not a data source.
- A price is a contractual representation — a hallucinated band someone books
  against is a commitment that must be honoured. That is why this wall exists.
