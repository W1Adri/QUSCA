# ApexFit

A personal **training, nutrition, hydration and sleep** tracker that runs
entirely in the browser — hosted free on GitHub Pages, no server or database
required.

**Live site:** https://w1adri.github.io

## Features

- **Accounts** — sign up / log in with PBKDF2-hashed passwords (Web Crypto).
  Password recovery via a security question (no backend needed).
- **Smart onboarding** — captures weight, height, age, sex, activity and goal.
- **Science-based targets** — BMR (Mifflin-St Jeor), TDEE, goal-adjusted
  calories and macros (ISSN protein guidelines), BMI, body-fat estimate.
- **Training** — built-in hypertrophy programs (Full Body / Upper-Lower / PPL),
  workout logging with sets, reps & weight, estimated 1RM (Epley) and
  strength-progress charts.
- **Nutrition** — daily macro targets, a meal-plan suggestion, a built-in food
  database and a meal logger with live macro totals.
- **Water** — personalised hydration goal (35 ml/kg + training) and quick logging.
- **Sleep & Dreams** — sleep duration/quality tracking, a dream journal and a
  **lucid-dreaming toolkit** (reality checks, MILD, WBTB, WILD…).
- **Progress** — weight trend, BMI, training volume and history.
- **Dark / light themes**, fully responsive, JSON backup export/import.

## Tech

Vanilla JS (ES modules), self-drawn SVG charts, `localStorage` persistence.
No build step, no dependencies, no tracking.

## Notes & limitations

GitHub Pages serves static files only, so all data lives in **this browser**.
Use **Profile → Export backup** to move data between devices. True email-based
recovery or cross-device sync would require a backend (e.g. EmailJS or a small
API) — the auth layer is structured to make that easy to add later.

> Health calculations are estimates for general guidance, not medical advice.
