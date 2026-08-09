# Andean Caravan launch blockers

Status date: 10 August 2026

## LB-01 · Enquiry delivery configuration

Status: **open · founder-approved deferral**

Production-equivalent enquiry delivery is not configured. The required
variables are present only as empty entries:

- `RESEND_API_KEY`
- `SAWAYATRA_FORM_RECIPIENT`
- `SAWAYATRA_FORM_SENDER`

The Caravan migration may continue through preview while this remains open.
No production Caravan page may instruct a visitor to submit an enquiry until a
real message passes an approved end-to-end preview test and the result is
recorded here.

Closure evidence:

- configuration available in the deployment environment;
- one approved preview submission delivered to the intended recipient;
- failure behaviour confirmed to retain no enquiry data; and
- founder approval to remove the blocker.

## LB-02 · Contract-pending sleeping altitudes

Status: **open · visible in Phase 3 specimen**

The route model now carries every sleeping altitude stated explicitly in the
locked Route Master. It does not infer values for properties that are not yet
contracted. The Section 03 eleven-night ladder therefore labels three nights as
`Altitude pending contract` rather than silently interpolating them.

No production enquiry action may appear on Section 03 until the complete
sleeping-altitude progression has been checked against contracted properties.

Closure evidence:

- all Section 03 nights have a value and qualifier;
- the values match contracted sleeping properties rather than general town
  elevations;
- the publication projection and visual ladder have been rechecked; and
- the founder has approved the completed disclosure.
