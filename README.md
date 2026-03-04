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
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages auto-deploy
├── .gitignore
└── README.md
```

---

## Deploying to GitHub Pages

### First-time setup

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Under *Source*, select **GitHub Actions**
4. Push any commit — the site deploys automatically

The included workflow (`.github/workflows/deploy.yml`) handles deployment on every push to `main`.

Live URL will be: `https://<your-username>.github.io/<repo-name>/`

### Custom domain (optional)

1. Add a `CNAME` file to the root containing your domain, e.g. `accessinsights.co`
2. Configure DNS: add a CNAME record pointing to `<your-username>.github.io`
3. Enable HTTPS in **Settings → Pages** once DNS propagates

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
