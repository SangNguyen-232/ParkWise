# ParkWise - BK-PARKING Smart Solution

ParkWise is a university parking management demonstration built with Next.js, React, and an Express mock server. It includes parking availability, simulated vehicle entry and exit, payments, incident reporting, gate operations, device monitoring, administration, and reporting screens.

**Start with [GUIDE.md](GUIDE.md)** for prerequisites, cloning, installation, running both servers, demo accounts, verification, and troubleshooting.

## Technology

| Component | Technology |
| --- | --- |
| Web application and route handlers | Next.js 16.2.0, React 19, TypeScript 5.7.3 |
| Styling and interface | Tailwind CSS 4, Radix UI, lucide-react |
| Separate mock API | Express 5, CORS |
| Demo state | Browser localStorage and JavaScript objects in memory |
| Dependency installation | pnpm with the committed lockfile |

## Main screens

| Route | Demonstration | Intended role |
| --- | --- | --- |
| `/` | Login through the Express mock API | All demo accounts |
| `/map` | Parking availability and simulated navigation | Students and faculty/staff; management and operations can inspect availability |
| `/xe-vao` | Vehicle entry and card-processing scenarios | Operations |
| `/xe-ra` | Vehicle exit and fee scenarios | Operations |
| `/dashboard` | Demo account balance and debt | Students/internal users |
| `/payment` | Simulated BKPay payment | Students/internal users |
| `/history` | Transaction history and printable receipts | Students/internal users |
| `/support/report` | Incident reporting and simulated emergency requests | Students and faculty/staff |
| `/support/tickets` | Incident ticket handling | Operations |
| `/gate-ops` | Exit exceptions, security alerts, and simulated barriers | Operations |
| `/admin/dashboard` | Simulated IoT health | Operations |
| `/admin/settings` | Pricing, internal user roles, and parking configuration | Management, IT, and operations, respectively |
| `/reports` | Mock occupancy and reconciliation reports | Management |

The role column describes the intended UI workflow. It is not a claim of secure server-side authorization.

## Quick start

After installing the prerequisites in [GUIDE.md](GUIDE.md):

```sh
git clone https://github.com/SangNguyen-232/ParkWise.git
cd ParkWise
pnpm install --frozen-lockfile
```

In one terminal, from the repository root:

```sh
node server/index.js
```

In a second terminal, from the same repository root:

```sh
pnpm dev --port 3000
```

Open [http://localhost:3000](http://localhost:3000). The Express server must remain available at [http://localhost:3001](http://localhost:3001) for the login request.

| Username | Password | Demo role |
| --- | --- | --- |
| `bql01` | `123` | Management |
| `it01` | `123` | IT |
| `bv01` | `123` | Operations |
| `sv01` | `123` | Student |
| `gvcb01` | `123` | Faculty/staff |

The legacy accounts `gv01` and `cb01` also use password `123` and the shared faculty/staff role.

## Repository layout

```text
app/                 Pages and Next.js API route handlers
components/          Parking screens, gate operations, and shared UI
hooks/               Shared React hooks
lib/parking-data.ts  Shared mock data and demonstration logic
public/              Static images and assets
scripts/             Optional PostgreSQL schema and seed examples
server/index.js      Independent Express mock API
GUIDE.md             Detailed setup and verification instructions
```

## Current limitations

- No database, real SSO, payment gateway, camera, card reader, barrier, or IoT hardware is connected.
- Browser storage, Next.js mock state, and Express mock state are separate. They do not form a synchronized backend.
- Demo login returns a profile stored in localStorage. It does not issue a secure session or enforce production authorization.
- The billing API uses a shared mock account rather than a separate account for each login.
- GPS navigation uses simulated positions and paths.
- The reports page uses local mock data; its PDF/Excel buttons show notifications rather than downloading reports. The receipt route separately returns printable HTML.
- Browser data can be cleared; server memory is lost on restart and can be reset by development reloads.
- There is no automated test suite. The lint script currently lacks an ESLint dependency and configuration, and the build configuration ignores TypeScript errors. See the separate verification steps in [GUIDE.md](GUIDE.md).

## Contribution language

All source-code comments, README content, guides, documentation, and contributor instructions must be written in English. Keep `GUIDE.md` synchronized with changes to setup, commands, dependencies, configuration, and verification. Existing localized UI text, API messages, and demo data retain their current language.
