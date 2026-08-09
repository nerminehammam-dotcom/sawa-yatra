# Decisions register — Membership/Identity spec v3.1

Every row here is a commercial decision **not yet made**. The build carries
each as an unfilled token in `content/spec-tokens.ts`; nothing ships until
the owner signs a value, and nothing was inferred from the spec's
"recommended" notes (guidance for the signer, not values).

## [SIGN-OFF] — commercial (post-operator where marked)

| Decision | Token(s) | Notes |
|---|---|---|
| Band prices per section | PRICE_T1–PRICE_T6 | post-operator; §15 must be resolved first |
| Agent rounding unit | PRICE_ROUNDING | §11.2 |
| Price plausibility envelope | PRICE_ENVELOPE | §11.2 sanity rail |
| Minimum viable group | MIN_GROUP | post-operator |
| Lock date offset | LOCK_DAYS | 60 recommended in spec — not encoded |
| Cancellation & replacement terms | CANCELLATION_TERMS | |
| Who bears a cancellation shortfall | SHORTFALL_HOLDER | Sawayatra absorbs, or group re-bands with REBAND_NOTICE + penalty-free withdrawal. **Must be stated on the section page before anyone books** |
| Re-band notice terms | REBAND_NOTICE | |
| Replacement deadline | REPLACEMENT_DEADLINE | post-operator (manifests, permits, rooming) |
| Roster name policy | ROSTER_NAME_POLICY | Spec author leans first-names-throughout; undecided |
| Upgrades | UPGRADE_NAME, UPGRADE_PRICE, SINGLE_SUPPLEMENT | post-operator |
| Joining fee | JOINING_FEE | credited against first booked section |
| Service charge | SERVICE_CHARGE | flat; if percentage is preferred it needs a cap |
| Household tier | HOUSEHOLD_FEE | optional recurring |
| Partner-share health metric | PARTNER_SHARE_TARGET, PARTNER_SHARE_DATE | §2.4 — write down and review as a metric |

## Nermine — product parameters

| Decision | Token | Spec note (not a value) |
|---|---|---|
| Invitations per founding member | INVITES_PER_MEMBER | 3 recommended |
| Concurrent live signals | LIVE_SIGNALS | 3 recommended |
| Standing shortlist size | STANDING_SIGNALS | 10 recommended |
| Standing signal expiry | STANDING_MONTHS | |
| Windows marked at once | CONSIDERING_MAX | 3 recommended |
| Window granularity | WINDOW_GRANULARITY | season / month / six-week block |
| Quorum-call threshold | QUORUM_TRIGGER | must sit above MIN_GROUP (enforced in code) |
| Signal cool-down | COOLDOWN_DAYS | |
| Lapse threshold | LAPSE_MONTHS | |
| Moderation queue SLA | REVIEW_SLA | unreviewed flag expires, content stands |
| Substitution notice window | SUBSTITUTION_NOTICE | |

## Open beyond tokens

- **Invitation allocation after month six** (§5.2 / §13): open.
- **§2.4 health metric review cadence**: open.

## ⛔ §15 — the blocker larger than any token

The funnel arithmetic is **unmodelled**: founding cohort size, invitation
acceptance rate, and departure dates offered per section in 2028. The
binding constraint is likely date concentration, not membership volume.
**This must be modelled before §8 is priced.** If the model says the
invitation cap or the six-month window is wrong, the answer changes §5.2
and §6.5 — no pricing design compensates. Nothing here has been invented;
no pricing token should be signed until this is resolved.
