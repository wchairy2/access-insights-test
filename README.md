# Access Insights

**Living Labs & Inclusive Innovation Research**  
Website for Access Insights — a distributed network of Living Labs co-creating with people with disabilities and older adults.

---

## Project Structure

```
access-insights/
├── index.html              # Main page
├── assets/
│   ├── css/styles.css      # All styles (WCAG 2.1 AAA verified)
│   ├── js/main.js          # Navigation, scroll animations, form handling
│   └── images/logo.svg     # Standalone logo
├── .gitignore
└── README.md
```

---

## Deploying to Netlify

### First-time setup

1. Push this repo to GitHub
2. In Netlify, select **Add new project → Import an existing project**
3. Choose the `access-insights/access-insights` repository
4. Use these settings:
   - Build command: *(leave empty)*
   - Publish directory: `.`
5. Deploy site

Because this is a plain HTML/CSS/JS site, no build step is required.

After linking the repo, Netlify will auto-deploy on every push to `main`.

### Custom domain (optional)

1. In Netlify, open **Domain management**
2. Add your custom domain (e.g. `accessinsights.co`)
3. Update DNS records as instructed by Netlify
4. Enable HTTPS (Netlify-managed certificate) once DNS propagates

---

## Running Locally

No build step required — it's plain HTML/CSS/JS.

```bash
# Option 1: Python (built-in)
python3 -m http.server 8080

# Option 2: Node (npx)
npx serve .

# Option 3: VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

Then open `http://localhost:8080`.

---

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| `--accent` | `#f0c96a` | Gold — headings, highlights, CTAs |
| `--accent2` | `#7ecfb3` | Teal — secondary emphasis, success |
| `--text-light` | `#f0eefc` | Primary body text |
| `--text-muted` | `#b8b4d4` | Secondary / descriptive text |
| Background | `#0a0612` | Deep dark base |

All color pairs meet **WCAG 2.1 AAA** (7:1+ contrast ratio) for normal text.

---

## Accessibility

- WCAG 2.1 AAA verified across all text/background combinations
- Semantic HTML5 with full ARIA landmark and label coverage
- Skip-to-main-content link
- Keyboard navigable with visible focus rings
- Respects `prefers-reduced-motion`
- `forced-colors` (Windows High Contrast) support on interactive elements
- All touch targets ≥ 44×44px (WCAG 2.5.5)
- No reliance on color alone to convey meaning

---

## Fonts

Loaded via Google Fonts (no local files needed):
- **Cormorant Garamond** — display/headings
- **DM Sans** — body/UI

---

## Contact

hello@accessinsights.co  
Portland, OR
