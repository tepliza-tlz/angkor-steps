[README.md](https://github.com/user-attachments/files/34811907/README.md)
# Angkor Steps — Shoe Shop Inventory Management System

**Angkor Steps** is a stock & inventory management system for a Cambodian shoe shop selling men's, women's, and kids' footwear. It tracks 54 products across three connected parts: an AI assistant, a spreadsheet "database", and a live web dashboard.

This project was built as a final-year Computer Science project. Prices are in US dollars with riel shown alongside (≈ 4,100 ៛ = $1), and Khmer terms are used throughout.

---

## The 3 Parts

| Part | Tool | What it does |
|------|------|--------------|
| 1 | Claude AI | A Claude Project with a Knowledge Base (product list + stock rules), an AI-written **Stock SOP** and **Monthly Stock Report** (edited for Khmer context), and a **Prompt Log** of 11+ prompts. |
| 2 | Google Sheets | A spreadsheet with **54 products**, live formulas (stock value, status, totals), a **bar chart**, and **Apps Script** that emails a **low-stock alert** automatically. |
| 3 | Website | A live, mobile-responsive **admin dashboard** (5 pages) deployed on Netlify, saved in Git. |

All three parts share the same business name, logo, and product data.

---

## Website Features

- **Dashboard** — 5 animated stat cards, a "stock by category" bar chart with tooltips, an inventory distribution donut chart, a live low-stock list, and recent activity.
- **Products** — search, filter by gender/category/low-stock, sort by price or stock, riel prices, and LOW/OK status badges.
- **Inventory / Stock** — record stock in and stock out; entries are saved in the browser and update stock across the whole site.
- **Sales** — a real sales history built from recorded Stock Out entries, with units sold and revenue.
- **Settings** — change the low-stock threshold, the riel exchange rate, and the theme (all reflected live across the dashboard).
- **Futuristic neon glassmorphism** design with **light and dark mode**.
- Fully responsive on desktop, tablet, and mobile.

---

## Tech Stack

- **Frontend:** HTML, CSS (glassmorphism), vanilla JavaScript (no frameworks, no external dependencies)
- **Data:** JavaScript product dataset (mirrors the Google Sheet exactly)
- **Storage:** browser `localStorage` for stock entries and settings
- **Spreadsheet:** Google Sheets + Google Apps Script (email alerts)
- **AI:** Claude (Project + Knowledge Base)
- **Hosting:** Netlify, code versioned on GitHub

---

## Folder Structure

```
angkor-steps-website/
├── index.html      # Dashboard (home)
├── products.html   # Product list (search / filter / sort)
├── stock.html      # Stock In / Stock Out
├── sales.html      # Sales history
├── settings.html   # Settings (threshold, riel rate, theme)
├── styles.css      # All styling (light + dark themes)
├── products.js     # Product data (54 products)
├── app.js          # Application logic
└── logo.svg        # Brand logo
```

---

## Run Locally

No build step or server needed. Just open `index.html` in any modern browser.

> Tip: because the site uses `localStorage`, open it from the same folder in the same browser so your recorded entries and settings persist.

---

## Deploy

1. Push this folder to a GitHub repository.
2. On Netlify, choose **Add new site → Import an existing project → GitHub**, and select the repository.
3. No build command and no publish directory are required (static site).
4. Deploy.

**Live URL:** https://angkor-stepsbytlz.netlify.app

---

## Author

Angkor Steps — final-project-by Tepliza.
