# Balm Therapeutic Services website

The website for balmtherapeutics.com.ng. It's built with Eleventy, hosted free on Cloudflare Pages, and edited at `/admin`, the same setup as psychphidims.com.

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
| `functions/api/` | GitHub sign-in for the editor, run by Cloudflare. |

## Going live: one-time setup

Do these in order. Steps 1 to 4 take about 30 minutes; the domain move in step 6 can take up to a day to settle.

**1. Put the code on GitHub**
Create a private repository, for example `balm-site`, and upload this folder. (Done: the code is in PhiDims/Balm-Therapeutics and `src/admin/config.yml` points to it.)

**2. Create the Cloudflare Pages project**
Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → choose the repository.
- Build command: `npm run build`
- Build output directory: `_site`
- Environment variable: `NODE_VERSION` = `22`

Cloudflare gives you a preview address ending in `.pages.dev`. Check everything there first.

**3. Turn on the /admin editor**
On GitHub: Settings → Developer settings → OAuth Apps → New OAuth App.
- Homepage URL: `https://balmtherapeutics.com.ng`
- Authorization callback URL: `https://balmtherapeutics.com.ng/api/callback`

Copy the Client ID and create a Client Secret. In Cloudflare Pages → Settings → Environment variables, add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`, then redeploy.

Anyone who should edit the site needs a free GitHub account and must be added as a collaborator on the repository.

**4. Make the forms send email**
Get a free access key at web3forms.com using `hello@balmtherapeutics.com.ng` (or balmtherapeutics@gmail.com). Put it in `src/_data/site.json` as `web3formsKey`, or in /admin → Site settings → Contact details.

**5. Rebuild every morning (for events)**
Cloudflare Pages → Settings → Builds → Deploy hooks → add one and copy the URL. On GitHub, add it as a repository secret named `CF_DEPLOY_HOOK`. The included workflow then rebuilds the site at 5am daily, so yesterday's events move to the archive.

**6. Move the domain**
Add `balmtherapeutics.com.ng` to Cloudflare and change the nameservers at your .ng registrar to the two Cloudflare gives you. Then in the Pages project → Custom domains, add `balmtherapeutics.com.ng` and `www.balmtherapeutics.com.ng`. Keep the Google Site unpublished, not deleted, for a month as a backup.

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
