# Travel Self telemetry specification

Status: DRAFT. Transmission is disabled.

## Boundary

The current build provides typed local event hooks only. Development and preview builds may write structured events to the browser console. Production performs no work. No event is sent to a network, analytics provider, account, database, URL, or browser storage.

## Event vocabulary

| Event | Fields |
| --- | --- |
| `travel_self_started` | none |
| `travel_self_step_viewed` | `step`, optional stable `questionId` |
| `travel_self_answer_selected` | stable `questionId`, stable `optionId` |
| `travel_self_passions_selected` | stable `passionIds` |
| `travel_self_primary_selected` | stable `passionId` |
| `travel_self_secondary_selected` | stable `passionId` or `null` |
| `travel_self_completed` | stable `resultId`, stable matched `sectionIds` |
| `travel_self_result_viewed` | stable `resultId` |
| `travel_self_section_opened` | stable `sectionId` |
| `travel_self_answer_edited` | stable `questionId` |
| `travel_self_restarted` | none |
| `travel_self_email_cta_clicked` | none |

No event name contains raw answer text.

## Data-minimisation decision

Raw item answers are not approved for transmission. Before analytics is enabled, product research must decide whether aggregate step progression plus derived axis scores can answer the research question. Derived scores are preferable to raw answers only if their collection is necessary, proportionate, disclosed, and approved.

## Identifier strategy

No identifier is generated in this build. A future session identifier would still be personal data in context and must not be described as anonymous merely because it lacks a name or email address.

## Consent and lawful basis

No consent behaviour or lawful basis has been approved. Transmission must remain disabled until both are documented and reviewed together with the exact payloads and destination.

## Retention and deletion

No retention period or deletion process has been approved because no event is collected. Before enablement, the owner must define a short retention period, deletion procedure, backup treatment, and responsibility for responding to deletion requests.

## Environments

- Local development: structured console logging may be used for verification.
- Preview: structured console logging may be used for internal verification.
- Production: strict no-op.

## Account joining

Events must not be joined to a member, enquiry, email address, or future account unless a separate approved purpose, consent flow, retention rule, and implementation are introduced. The current `/start-here` link carries no Travel Self result or section data.

## Access and destination

No analytics destination or access group is approved. Any future proposal must name the processor, storage region, roles with access, export permissions, and deletion controls before implementation.

## Preview and internal testers

Console events from preview and internal testing are ephemeral debugging output. Testers must not paste payloads into shared systems as a substitute for an approved analytics destination.
