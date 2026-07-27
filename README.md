# Allcare Design/Build — Website

Marketing website for **Allcare Design/Build, Inc.**, a licensed design-build
remodeling contractor serving San Diego County (CA License B #564360).

**Live site:** https://allcaredesignbuild.com

---

## What this is

A fast, fully static website — plain HTML, one CSS file, and one JavaScript
file. There is **no build step, framework, or server code**. Any browser can
open the files directly, and any static host can serve them as-is.

## Structure

```
.
├── index.html            Home
├── services.html         Services (ADU, kitchen, bath, whole-home, additions, new construction)
├── portfolio.html        Project gallery (filterable)
├── about.html            About / company story
├── contact.html          Contact + free-consultation form
├── privacy-policy.html   Privacy Policy
├── terms.html            Terms of Service
├── 404.html              Not-found page
├── css/styles.css        All site styles
├── js/main.js            All site behavior (nav, counters, FAQ, lightbox, etc.)
├── images/               All photography, logos, and icons
├── robots.txt            Search-crawler directives
├── sitemap.xml           XML sitemap (all indexable pages)
├── _redirects            Netlify redirect rules
└── netlify.toml          Netlify build/headers/caching config
```

## Local preview

No tools needed — just open `index.html` in a browser. For a more accurate
preview (so root-relative links and pretty URLs behave), run a tiny local server:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Deployment

The site is hosted on **Netlify** and publishes the repository root directly
(`publish = "."` in `netlify.toml`). Pushing to the connected branch triggers a
deploy. Caching, security headers, and pretty URLs are configured in
`netlify.toml`; legacy URL redirects live in `_redirects`.

## SEO

- Each page has a unique `<title>`, meta description, canonical URL, and
  Open Graph / Twitter Card tags.
- Structured data (JSON-LD) is embedded per page: `GeneralContractor` /
  `LocalBusiness` on the home page (with `sameAs` links to the company's
  social and review profiles), plus `BreadcrumbList`, `FAQPage`, `Service`,
  `AboutPage`, `ContactPage`, and `CollectionPage` where appropriate.
- `sitemap.xml` lists every indexable page and is referenced from `robots.txt`.

### Before going live — two quick items

1. **Google Analytics 4** — each page has a placeholder comment
   (`PASTE YOUR GA4 GTAG SNIPPET HERE`) in the `<head>`. Drop the GA4 tag there
   to enable analytics.
2. **Google Business Profile** — the footer social row and the home-page
   `sameAs` array can include a Google Business Profile link once the exact URL
   is available.

## Editing content

- **Text & links:** edit the relevant `*.html` file directly.
- **Styling:** `css/styles.css` (colors and fonts are CSS variables at the top).
- **Behavior:** `js/main.js`.
- **Photos:** add files to `images/` and reference them from the HTML. Portfolio
  cards use a `data-category` attribute (`adu`, `kitchen`, `bathroom`,
  `exterior`) that drives the on-page filter.

---

© Allcare Design/Build, Inc. All rights reserved.
