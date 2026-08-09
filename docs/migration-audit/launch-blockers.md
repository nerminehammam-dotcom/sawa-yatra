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
