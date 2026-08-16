# Go-live configuration

Everything the site needs that is not in the repository. Five environment
variables and one database.

**You enter every secret yourself.** I never see or handle an API key, a
password or a connection string. Where I can do work without touching one — such
as applying the database schema, which the Neon tools do from a project ID
rather than a credential — I will.

Written 16 August 2026.

---

## 1. The contact form, which is currently broken

Anyone who fills in a form on the live site right now gets a failure. Not a
silent loss — `lib/forms/adapters.ts` deliberately returns `not-configured` and
`app/api/forms/[kind]/route.ts` fails loudly rather than pretending. But it does
mean nothing reaches you, and the visitor sees an error.

Three variables, all three required. Missing any one leaves the adapter
unconfigured.

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | From the Resend dashboard. Starts `re_`. |
| `SAWAYATRA_FORM_SENDER` | The from-address. **Must be on a domain you have verified in Resend** — e.g. `hello@sawayatra.com`. A Gmail address will not work. |
| `SAWAYATRA_FORM_RECIPIENT` | Where enquiries land. `nerminehammam@gmail.com` is fine. |

### Order of work

1. Create a Resend account at resend.com.
2. Add `sawayatra.com` as a domain and add the DNS records it gives you at your
   registrar. Verification usually takes minutes but can take hours.
3. Only once the domain shows **Verified**, create an API key.
4. Set the three variables in Vercel → Project → Settings → Environment
   Variables, for Production.
5. Redeploy. Environment variables are read at build and at request time; an
   existing deployment will not pick them up.

The visitor's own address is set as `reply_to`, so replying to an enquiry goes
straight back to them.

---

## 2. The session secret

Without it, the membership and invitation layer cannot verify a token, and any
route that needs one returns 404 by design (`actions.ts` checks
`secret.length < 32` explicitly).

| Variable | Value |
|---|---|
| `SAWAYATRA_SESSION_SECRET` | At least 32 characters of randomness. |

Generate it yourself, in Terminal, so it exists nowhere but your machine and
Vercel:

```
openssl rand -base64 48
```

Paste the output into Vercel. Do not paste it into this conversation — if it
ever appears in a transcript it has to be rotated.

It is a signing key, not a password: changing it later invalidates every issued
invitation link and signs everyone out, so set it once and leave it.

---

## 3. The database, in the EU

The existing project `sawayatra-membership` (`shy-surf-58186410`) is in
**us-east-1**, not the EU region you asked for. Its connection string, password
included, was printed in tool output during the session that created it. It has
never been connected to — `active_time: 0`, `cpu_used_sec: 0`, no data — so
there is nothing to migrate and nothing to lose.

Neon's create-project tool has no region parameter, which is how it ended up in
the wrong place. So this part has to start in the Neon console.

### Order of work

1. **Create the new project.** neon.tech console → New Project. Set the region
   to **Europe (Frankfurt) — eu-central-1**. Name it `sawayatra-membership-eu`.
2. **Send me the project ID** (it looks like `shy-surf-58186410`). That is not a
   secret on its own, and it is all I need — the Neon tools take a project ID,
   so I can create the tables without ever seeing the password.
3. **I apply `lib/sawayatra/db/schema.sql`** — the `invitation` and `member`
   tables, the partial unique indexes that make allocation atomic, and the
   `member_summary` view that cannot select `date_of_birth`. Then I verify them.
4. **You copy the connection string** from the Neon console straight into Vercel
   as `DATABASE_URL`. Not through me.
5. **Then, and only then, delete the old project.** Deleting it is what
   invalidates the leaked credential. I will not do that without you saying so.

---

## The full set

| Variable | Purpose | Set? |
|---|---|---|
| `RESEND_API_KEY` | contact form delivery | ☐ |
| `SAWAYATRA_FORM_SENDER` | from-address, verified domain | ☐ |
| `SAWAYATRA_FORM_RECIPIENT` | where enquiries land | ☐ |
| `SAWAYATRA_SESSION_SECRET` | signs sessions and invitations | ☐ |
| `DATABASE_URL` | the EU Neon database | ☐ |

Two more exist and are deliberately unset:

- `NEXT_PUBLIC_SITE_URL` — no longer the indexing switch. Production resolves to
  `https://www.sawayatra.com` on its own (`lib/site-url.ts`).
- `SAWAYATRA_ALLOW_INDEXING` — set to `true` only when you want search engines
  in. Until then the site is fully browsable and fully addressable, and simply
  not indexed.

---

## How to check it worked

- **Contact form:** submit the form on the live site. It should acknowledge, and
  the mail should arrive at the recipient address with the sender's address as
  reply-to.
- **Session secret:** with it set, a signed-in member route stops 404ing.
- **Database:** I can query the new project and show you the tables, indexes and
  view, from the project ID alone.
