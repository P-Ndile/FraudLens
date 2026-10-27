# FraudLens — HackSecure 2026 frontend demo

A React + Vite frontend inspired by the approved 12-panel FraudLens UI mockup.

## Start in VS Code

1. Unzip the project and open the `fraudlens` folder in VS Code.
2. Open **Terminal → New Terminal**.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL Vite prints (usually `http://localhost:5173`).

## What's included

- Landing page with product introduction, steps, features, pricing and about section
- Login and registration UI (**demo only; no authentication yet**)
- Responsive sidebar dashboard, risk chart and activity table
- Invoice upload UI with three **simulated** risk scenarios
- Risk result view with supplier banking detail comparison
- Supplier management with editable demo data
- Scan history, verification checklist, learning hub and settings UI

## Important safety / functionality notes

This is a **frontend prototype**, not a real invoice fraud detection system. Uploaded files stay in the browser and are **not parsed, stored on a server, or scanned**. Analysis results are simulated from the selected scenario. There is no real login, database, banking integration or payment processing. No personal or real supplier banking information should be used in this demo.

All supplier and scan changes are kept in temporary React state and reset on refresh. Settings are placeholders. Proposed paid plans are not active.

## Next development steps

1. Separate pages/components into modules and add React Router.
2. Add backend with Node.js/Express and secure authentication.
3. Implement PDF/image extraction and compare extracted bank details against independently verified supplier records.
4. Add secure data storage, upload limits, access controls, logging, tests and POPIA-oriented privacy design.
5. Replace all simulated analysis labels only after actual functionality is implemented and tested.
