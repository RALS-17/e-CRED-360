# e-CRED 100 — Electronic Credentialing Compliance Program

**“No Expired Credential. No Unverified Provider. 100% Ready.”**

Presentation-ready React + TypeScript UI demonstrating the system flow of a centralized electronic credentialing system for Philippine healthcare providers (PRC, PhilHealth, privileging, recredentialing).

## Features (UI only — no backend)

- **Dashboard** — KPIs, compliance scores, providers needing attention
- **Provider Master List** — searchable electronic database of doctors/professionals
- **Provider Detail** — credentials (PRC, specialty, PhilHealth, BLS/ACLS…), privileges, audit trail
- **CRED-IT Cycle** — Capture → Review → Electronically verify → Determine privileges → Identify issues → Track until corrected
- **Alerts & Tracking** — expired / expiring / missing credentials board

All data is mocked for presentation. Buttons such as “Verify” / “Upload” are interactive for demo flow only.

## Quick start

```bash
cd e-cred-360
npm install
npm run dev
```

Open the URL shown by Vite (usually http://localhost:5173).

## Tech

- React 19 + TypeScript
- Vite
- Plain CSS (no extra UI library required)

Built for presentation of the e-CRED 100 quality strategy and closed-loop credentialing flow.
