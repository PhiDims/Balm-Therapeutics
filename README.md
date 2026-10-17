# Balm Therapeutic Services website

The website for balmtherapeutics.com.ng. It's built with Eleventy, hosted free on Cloudflare Workers, and edited at `/admin`, the same setup as psychphidims.com.

## What's in this folder

| Folder or file | What it holds |
|---|---|
| `src/services/` | The 8 service pages, one file each. Order is set by the `order` number. |
| `src/team/` | One file per team member. |
| `src/events/` | One file per event. Past events move to the archive on their own. |
| `src/blog/` | One file per article. |
| `src/_data/site.json` | Phone, WhatsApp, email, address, hours and the Web3Forms key. Change these once and every page updates. |
| `src/_data/faqs.json` | The questions on the What to expect page. |
| `src/_data/testimonials.json` | Kind words. Only with written consent. |
| `src/_data/partners.json` | Memberships and organisations you've trained. |
| `src/_includes/` | Page layouts and shared parts (header, footer, forms). |
| `src/assets/` | Styles, script, logo, images and the company profile PDF. |
| `src/admin/` | The `/admin` editor (Decap CMS). |
| `worker/index.js` | Serves the site and handles GitHub sign-in for the editor. |
| `wrangler.jsonc` | Cloudflare Worker settings. |

## Going live: one-time setup

Do these in order. Steps 1 to 4 take about 30 minutes; the domain move in step 6 can take up to a day to settle.

**1. Put the code on GitHub**
Done: the code is in PhiDims/Balm-Therapeutics, and `src/admin/config.yml` points to it.

**2. Cloudflare Worker (done)**
The site is live at https://balm-therapeutics.phidims.workers.dev. In the Worker's Settings → Build, check that:
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

Every change pushed to GitHub, including saves from /admin, rebuilds and publishes the site in about a minute.

**3. Turn on the /admin editor**
On GitHub: Settings → Developer settings → OAuth Apps → New OAuth App.
- Application name: `Balm website editor`
- Homepage URL: `https://balmtherapeutics.com.ng`
- Authorization callback URL: `https://balmtherapeutics.com.ng/api/callback`

Until the domain moves, use `https://balm-therapeutics.phidims.workers.dev/api/callback` as the callback URL and change it later.

Copy the Client ID and generate a Client Secret. In Cloudflare → Workers & Pages → balm-therapeutics → Settings → Variables and Secrets, add:
- `GITHUB_CLIENT_ID` (type Text)
- `GITHUB_CLIENT_SECRET` (type Secret)

Anyone who should edit the site needs a free GitHub account and must be added as a collaborator on the repository.

**4. Make the forms send email**
Get a free access key at web3forms.com using `hello@balmtherapeutics.com.ng` (or balmtherapeutics@gmail.com). Put it in /admin → Site settings → Contact details, or in `src/_data/site.json` as `web3formsKey`.

**5. Events**
Past events disappear from the upcoming lists on their own. They move into the "Past events" archive the next time the site rebuilds, which happens whenever anyone saves a change.

**6. Move the domain**
Add `balmtherapeutics.com.ng` to Cloudflare and change the nameservers at your .ng registrar to the two Cloudflare gives you. Then in the Worker → Settings → Domains & Routes, add `balmtherapeutics.com.ng` and `www.balmtherapeutics.com.ng` as custom domains. Then update the GitHub OAuth app's callback URL to `https://balmtherapeutics.com.ng/api/callback`, and in `src/admin/config.yml` change `base_url` to `https://balmtherapeutics.com.ng`. Keep the Google Site unpublished, not deleted, for a month as a backup.

If you buy `balmtherapeutics.com`, add it to Cloudflare too and create a redirect rule to `https://balmtherapeutics.com.ng`.

**7. Set up the email address**
Cloudflare → the domain → Email → Email Routing. Create `hello@balmtherapeutics.com.ng` forwarding to `balmtherapeutics@gmail.com`.

**8. Turn on analytics**
Cloudflare → Web Analytics → add the site. It counts visits without cookies.

## Everyday editing

Go to `balmtherapeutics.com.ng/admin`, sign in with GitHub, and choose what to change:

- **Events**: add a title, date, time, venue and registration link. Leave the link empty and people register by WhatsApp.
- **Blog**: write the article, add a summary and a photo, and publish.
- **Team**: add a photo (it shows in black and white), role, qualifications and the filters each person appears under.
- **Services**: edit the words on any service page.
- **Site settings**: phone, address, hours, FAQs, testimonials and partners.

Each save goes live in about a minute.

## Working on the code

```
npm install
npm start        # preview at http://localhost:8080
npm run build    # builds the site into _site
```

## Before launch: still to fill in

Search the site for `[` to find every placeholder. The main ones:

- Street address, landmark and the Google Maps embed (`src/contact.njk`)
- Year Balm was founded and the "Our story" paragraph (`src/about.njk`)
- Names, roles, photos and bios for team members 2 to 8
- Session lengths, fees, age ranges and online availability on each service page
- Fees, payment, cancellations and online sessions on the What to expect page
- The privacy page, which is a draft for Philip's review
- Testimonials with written consent, and partner logos with permission
- Real events and blog posts (delete the `[Sample]` ones)
- Real photos of the rooms, team and trainings, with consent from anyone shown
- A corrected company profile PDF (`src/assets/balm-company-profile.pdf`): the current one says "COMAPNY" and lists balmtherapeutic@gmail.com and +234 703 008 5494
