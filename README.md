# PVS Narayana Murthy — Portfolio

A minimal, dark-first personal portfolio website built with vanilla HTML, CSS, and JavaScript. Showcases projects, skills, certifications, and education with a smooth, interactive design.

**Live pages:**
- `index/index.html` — Home (Hero, Skills, Projects, Certificates, Education)
- `index/skills.html` — Detailed Skills page
- `index/project-stylehub.html` — StyleHub project detail
- `index/project-todo.html` — ToDo App project detail

---

## 📁 Folder Structure

```
Port/
├── index/               # All HTML, CSS, and JS files
│   ├── index.html
│   ├── skills.html
│   ├── project-stylehub.html
│   ├── project-todo.html
│   ├── style.css
│   └── script.js
├── images/              # Image assets
│   ├── profile.jpg
│   └── logo.png
└── pdf/                 # Certificates and resume
    ├── resume.pdf
    ├── SummerTrainingCertificate.pdf
    ├── Cloud Computing.pdf
    ├── 1.pdf
    ├── 2.pdf
    └── 3.pdf
```

---

## ✨ Features

- **Dark / Light mode** — persisted via `localStorage`
- **Custom cursor** — animated dot + follower with context-aware text
- **Spotlight mode** — togglable radial spotlight overlay
- **Page transitions** — smooth slide animations between pages
- **Education timeline** — animated vertical timeline with score bars
- **Skills page** — animated progress bars and radial SVG skill circles
- **Certifications** — click any row to open the PDF directly
- **Resume download** — available in the footer of every page
- **Responsive** — mobile-friendly layout via CSS media queries

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | Vanilla CSS (custom properties, animations) |
| Logic | Vanilla JavaScript (IntersectionObserver, localStorage) |
| Icons | Font Awesome 6 |
| Fonts | Google Fonts — Poppins |

---

## 🚀 Running Locally

No build step required — just open `index/index.html` in any modern browser.

```bash
# Option 1: open directly
start index/index.html

# Option 2: serve with Python (avoids any file:// quirks)
python -m http.server 8000
# then visit http://localhost:8000/index/index.html
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
