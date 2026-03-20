# PVS Narayana Murthy — Portfolio

A minimal, dark-first personal portfolio website built with vanilla HTML, CSS, and JavaScript. Showcases projects, skills, certifications, and education with a smooth, interactive design.

**Live Demo:** [https://murthyportfolio.netlify.app/](https://murthyportfolio.netlify.app/)

**Live pages:**
- `index.html` — Home (Hero, Skills, Projects, Certificates, Education)
- `htmlfiles/skills.html` — Detailed Skills page
- `htmlfiles/project-stylehub.html` — StyleHub project detail
- `htmlfiles/project-todo.html` — ToDo App project detail
- `htmlfiles/contact.html` — Contact page

---

## 📁 Folder Structure

```
Port/
├── htmlfiles/           # Sub-pages
│   ├── skills.html
│   ├── project-stylehub.html
│   ├── project-todo.html
│   └── contact.html
├── images/              # Image assets
│   ├── profile.jpg
│   └── logo.png
├── pdf/                 # Certificates and resume
│   ├── resume.pdf
│   ├── SummerTrainingCertificate.pdf
│   ├── Cloud Computing.pdf
│   ├── 1.pdf
│   ├── 2.pdf
│   └── 3.pdf
├── index.html           # Main entry point
├── style.css            # Global styles
├── script.js            # Global interactivity
└── config.js            # EmailJS API keys
```

---

## ✨ Features

- **Dark / Light mode** — persisted via `localStorage`
- **Magnetic UI Interactions** — buttons and cards pull towards the custom cursor (powered by GSAP)
- **Gravity Mode** — interactive physics-based falling elements globally across pages (powered by Matter.js)
- **Working Contact Form** — sends emails seamlessly directly from the browser via EmailJS
- **Active Navigation** — visually underlines the current page link automatically
- **Custom cursor** — animated dot + follower with context-aware text
- **Spotlight mode** — togglable radial spotlight overlay
- **Page transitions** — smooth slide animations between pages
- **Education timeline** — animated vertical timeline with score bars
- **Skills page** — animated progress bars and radial SVG skill circles
- **Certifications** — click any row to open the PDF directly
- **Resume download** — available in the footer with custom hover effects
- **Responsive** — mobile-friendly layout via CSS media queries

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | Vanilla CSS (custom properties, animations, media queries) |
| Logic | Vanilla JavaScript, GSAP (animations), Matter.js (physics), IntersectionObserver, EmailJS |
| Icons | Font Awesome 6 |
| Fonts | Google Fonts — Poppins |

---

## 🚀 Running Locally

No build step required — just open `index.html` in any modern browser.

```bash
# Option 1: open directly
start index.html

# Option 2: serve with Python (avoids any file:// quirks)
python -m http.server 8000
# then visit http://localhost:8000/index.html
```

---

## 📬 Contact

| | |
|---|---|
| **Email** | shaty768@gmail.com |
| **LinkedIn** | [pvsn-murthy-dev](https://www.linkedin.com/in/pvsn-murthy-dev) |
| **GitHub** | [Balaji-dev-png](https://github.com/Balaji-dev-png) |

---

© 2026 PVS Narayana Murthy
