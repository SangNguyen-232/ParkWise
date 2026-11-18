# ParkWise Setup and Verification Guide

This guide describes the source code in this repository. ParkWise is a local demonstration of a university parking system, not a deployment-ready parking service. Its interface and demo data retain their existing localized language; this guide and all developer documentation are in English.

## 1. Understand what runs

You must run two Node.js processes:

| Process | Command from the repository root | Default address | Responsibility |
| --- | --- | --- | --- |
| Express mock server | `node server/index.js` | `http://localhost:3001` | Demo login and a separate set of parking/report mock endpoints |
| Next.js application | `pnpm dev --port 3000` | `http://localhost:3000` | Browser UI and API route handlers under `app/api/` |

The login page calls `http://localhost:3001/api/auth/login` directly. Other features also use Next.js route handlers, browser localStorage, and component state. Express and Next.js do not share one database or one synchronized state.

Use the browser on the same computer as both processes. A phone or another computer interprets `localhost` as itself, so remote browsing requires code/configuration changes to the login URL. No proxy or configurable API base URL is currently provided.

## 2. Install prerequisites

Use Windows with PowerShell or Command Prompt, macOS, or Linux. Open a terminal for the commands below. An editor such as Visual Studio Code is optional.

| Requirement | Setup for this guide |
| --- | --- |
| Git | Install Git and make `git` available in your terminal. |
| Node.js and npm | Use a current patch release of Node.js 22, at least 22.12.0, or a newer supported Node.js release. npm is included with the standard Node.js distribution. |
| pnpm | Use pnpm 10 for this guide and the committed version-9 lockfile format. |
| Browser | A modern browser with JavaScript and localStorage enabled. |
| Network | Required to clone the repository and download dependencies. Some demo images also use `placehold.co`. |
| Ports | Keep TCP ports 3000 and 3001 free. |

Next.js 16 itself requires Node.js 20.9 or later. This guide uses a newer Node.js baseline because `server/index.js` contains ES module syntax while `package.json` does not declare `"type": "module"`. Node.js enables automatic syntax detection by default from 22.7.0 in the 22.x line. See the official [Next.js requirements](https://nextjs.org/docs/app/getting-started/installation) and [Node.js module detection documentation](https://nodejs.org/api/packages.html#syntax-detection).

Install Git from [git-scm.com](https://git-scm.com/downloads) and Node.js from [nodejs.org](https://nodejs.org/en/download). Reopen your terminal after installation. If PowerShell blocks npm, pnpm, or npx script wrappers, use `npm.cmd`, `pnpm.cmd`, or `npx.cmd` in the commands below; changing the execution policy is unnecessary. Then verify:

```sh
git --version
node --version
npm --version
```

Install the selected pnpm major version and verify it:

```sh
npm install --global pnpm@10
pnpm --version
```

The last command should print a `10.x.x` version. If your system does not allow global installation, prefix each pnpm command in this guide with `npx --yes pnpm@10` instead. For example, use `npx --yes pnpm@10 install --frozen-lockfile`. Refer to the official [pnpm installation instructions](https://pnpm.io/10.x/installation) for platform-specific setup.

The repository does not currently declare `engines` or `packageManager` in `package.json`; the versions above are the setup chosen by this guide, not repository-enforced constraints.

## 3. Clone the repository

In a terminal, change to the parent directory where you keep projects, then run:

```sh
git clone https://github.com/SangNguyen-232/ParkWise.git
cd ParkWise
git status --short
```

A fresh checkout normally produces no output for the last command. If you already have a checkout, enter its `ParkWise` directory and retain any existing work instead of cloning over it.

All following project commands run in the directory containing `package.json`, `pnpm-lock.yaml`, `app/`, and `server/`. Do not run dependency installation from `server/`: there is one shared package manifest at the repository root.

## 4. Install project dependencies

```sh
pnpm install --frozen-lockfile
```

Wait for installation to finish successfully before starting either process. This installs the versions recorded by `pnpm-lock.yaml` without rewriting the dependency graph. Do not switch package managers or delete the lockfile as a routine fix for an installation failure.

No `.env` file, database connection, Supabase account, payment key, Docker container, or hardware device is required for the current demo. There is no `.env.example` to copy. The SQL files in `scripts/` are optional reference material, not installation steps for the web application.

## 5. Start the Express mock server

Open terminal A at the repository root:

```sh
node server/index.js
```

Wait for:

```text
Server running on port 3001
```

Leave this terminal running. If a shell-level `PORT` variable is already set, the server uses that value instead of 3001. For the unchanged frontend, explicitly select 3001 before starting it.

PowerShell:

```powershell
$env:PORT = "3001"
node server/index.js
```

Bash or zsh:

```sh
PORT=3001 node server/index.js
```

Open [http://localhost:3001/api/zones](http://localhost:3001/api/zones) in a browser. A JSON array confirms that the mock server is responding. The root URL alone is not a health endpoint and can return `Cannot GET /`.

On some Node.js versions, a warning about the missing package module type can appear before the startup message. If execution continues and the endpoint responds, the warning is not a startup failure. An actual import-syntax error indicates that the Node.js runtime needs to match the prerequisites above.

## 6. Start the web application

Open terminal B, enter the same repository root, and run:

```sh
pnpm dev --port 3000
```

Wait for Next.js to report that it is ready. Open [http://localhost:3000](http://localhost:3000).

The explicit port keeps the browser address stable and prevents Next.js from silently selecting another port already used by the mock server. Keep terminals A and B running for the entire session. Stop each process with `Ctrl+C` in its own terminal when finished.

## 7. Log in with a demo account

Use the login form at `/`. The separate `/auth/login` page is a UI mock that only redirects to the dashboard; it does not authenticate through Express or populate the stored user profile.

| Username | Password | Role | Suggested pages |
| --- | --- | --- | --- |
| `sv01` | `123` | Student | `/map`, `/dashboard`, `/payment`, `/history`, `/support/report` |
| `gvcb01` | `123` | Faculty/staff | `/map`, `/support/report` |
| `bv01` | `123` | Operations | `/xe-vao`, `/xe-ra`, `/support/tickets`, `/gate-ops`, `/admin/dashboard`, `/admin/settings` |
| `bql01` | `123` | Management | `/reports`, pricing in `/admin/settings`, parking overview |
| `it01` | `123` | IT | Internal user management in `/admin/settings` |

The legacy accounts `gv01` and `cb01` share the faculty/staff role and password `123`. The source of these credentials is the `users` array in `server/index.js`.

Successful login saves a profile under the browser's `user` localStorage key and navigates to `/map`. Log out before switching roles. Role-dependent menus and client checks are demo behavior; they do not provide secure authentication or server-side authorization.

## 8. Verify the local demo

### Basic server checks

With both processes running, open these URLs:

| URL | Expected response |
| --- | --- |
| `http://localhost:3001/api/zones` | Express JSON for six zones with 100 slots per zone |
| `http://localhost:3000/api/zones` | Next.js JSON for six zones with 12 slots per zone |
| `http://localhost:3000/api/user/balance` | JSON containing `success: true` and the shared mock user account |
| `http://localhost:3000/api/admin/iot-health` | JSON describing simulated IoT health |

The different slot counts are intentional properties of two separate mock implementations. They are not evidence that the frontend failed to connect to a database.

### Manual workflow checks

1. Log in at `/` as `sv01`. Confirm that the map opens and the account is represented in the header.
2. Open an available zone and select an empty slot. Exercise both navigation choices. The displayed position and route are simulated; no real GPS fix is required.
3. Open `/payment`, select an affordable unpaid session, and use a nonempty confirmation value such as `123456`. The API deliberately rejects `000000`; it does not verify a real OTP. The shared mock account initially has a 20,000 VND balance, so selecting all debt can fail for insufficient funds.
4. Check `/history` after the simulated payment. Select paid sessions and open the receipt. The receipt is HTML with a browser print/save-to-PDF action.
5. Submit a test incident from `/support/report`. Log out and log in as `bv01` in the same browser profile and origin, then inspect `/support/tickets`. The incident data is stored locally in that browser.
6. As `bv01`, open the entry, exit, gate operations, and IoT pages. Use the supplied demo controls; cameras, card scans, barriers, and devices are simulated.
7. As `bql01`, inspect `/reports` and the pricing tab in `/admin/settings`. The report export buttons currently display notifications rather than generate downloadable PDF/Excel files.
8. As `it01`, inspect the internal-user tab in `/admin/settings`. Changes there are browser-local demo records and do not replace the Express login account array.

Record failures with the page URL, account, action, and terminal/browser error. Do not treat a successful demo click as validation of a real payment or hardware integration.

### Source checks

From a third terminal at the repository root:

```sh
node --check server/index.js
pnpm exec tsc --noEmit --incremental false
```

The first command checks JavaScript syntax without starting the server. The second checks TypeScript independently and avoids generating a TypeScript build-info file. If errors occur, inspect them rather than assuming that a successful Next.js build proves type correctness.

There is no `test` script or automated test suite in the current repository. The `lint` script runs `eslint .`, but ESLint and its configuration are not provided, so `pnpm lint` is not a working validation step on a clean checkout. No test or lint success is implied by this guide.

For this documentation update, the commands and workflows were checked against the source, and `node --check server/index.js` passed with Node.js v26.13.1. Dependency installation, server startup, browser workflows, the TypeScript check, and the production build were not executed in the editing environment because pnpm and the project dependencies were not installed. Run those steps in your own configured checkout before treating it as verified.

## 9. Build and run production mode locally

Stop the development frontend in terminal B with `Ctrl+C`. Leave the Express server running in terminal A. In terminal B:

```sh
pnpm build
pnpm start --port 3000
```

Run the start command only after the build succeeds. Reopen [http://localhost:3000](http://localhost:3000) and repeat the basic checks.

The build creates `.next/`; `pnpm start` requires that output. The configuration sets `typescript.ignoreBuildErrors: true`, so run the independent TypeScript check from section 8. Next.js 16 also does not run linting during `next build`, as documented in the [Next.js installation guide](https://nextjs.org/docs/app/getting-started/installation).

This verifies a local production-mode build, not readiness for public hosting. The hard-coded localhost login URL, mock credentials, browser-only roles, permissive mock CORS, and nonpersistent state still need a real architecture before deployment.

## 10. Understand and reset demo state

| State | Location | Reset behavior |
| --- | --- | --- |
| Logged-in profile | localStorage key `user` | Logout or remove this key |
| Parking configuration | `bk_parking_zones_v1` | Remove the key and reload |
| Internal user records | `bk_internal_users_v1` | Remove the key and reload |
| Incident tickets | `bk_parking_incident_tickets_v1` | Remove the key and reload |
| Simulated emergency request | `bk_parking_emergency_call_v1` | Remove the key and reload |
| Billing, balances, IoT, and other Next.js mock state | JavaScript objects in the Next.js process/modules | Restart Next.js; development reloads can also reset state |
| Express zones and mock report state | JavaScript objects in the Express process | Restart Express |
| Component-only changes | React state or client module state | Reload the page or restart the browser session as appropriate |

For a clean browser demonstration, open DevTools, find Application/Storage, and remove the listed keys for `http://localhost:3000`. This discards that origin's demo changes. Reload and log in again. A private browsing window provides separate localStorage, but still reaches the same shared server-side mock account.

Use the same hostname and port throughout testing: `localhost`, `127.0.0.1`, and different ports have separate browser storage. Restarting a server does not clear localStorage, and clearing localStorage does not reset server memory.

## 11. Optional SQL reference files

`scripts/001_create_parking_schema.sql` defines PostgreSQL tables, indexes, and permissive demonstration row-level-security policies. `scripts/002_seed_parking_data.sql` creates sample zones, slots, vehicles, and sessions.

The application has no database driver or connection configuration for these files. Running the SQL does not connect the UI or either API to PostgreSQL. PostgreSQL is therefore not a prerequisite for the demo.

For a separate database exercise, use a disposable PostgreSQL database with `gen_random_uuid()` available. Review the schema first, execute `001_create_parking_schema.sql` before `002_seed_parking_data.sql`, and inspect the resulting tables with a PostgreSQL client. The policy creation statements are not safe to rerun unchanged, and rerunning the seed can change occupancy or add sessions. These scripts are not a versioned migration system.

## 12. Troubleshooting

| Symptom | Check and action |
| --- | --- |
| `git`, `node`, `npm`, or `pnpm` is not recognized | Install the prerequisite, reopen the terminal, and check PATH. On PowerShell systems blocking npm/pnpm scripts, try the corresponding `npm.cmd` or `pnpm.cmd` command. |
| `package.json` cannot be found | Enter the repository root, not its parent directory or `server/`. |
| Frozen lockfile installation fails | Confirm pnpm 10 and that `package.json` and `pnpm-lock.yaml` belong to the same checkout. Preserve local edits and inspect the error before changing the lockfile. |
| Package downloads fail | Check registry connectivity and your organization's proxy settings, then rerun the same install command. |
| `Cannot use import statement outside a module` | Check `node --version` and use the Node.js baseline in section 2. |
| Login reports a connection failure | Keep Express running on port 3001 and open its `/api/zones` endpoint. Check that the browser is on the same computer. |
| Login rejects the account | Use the exact case-sensitive credentials from section 7 and the form at `/`. |
| `EADDRINUSE` or port-in-use error | Stop the process that you started on the required port, then restart. Do not move Express without also changing the frontend login URL. |
| Wrong account, stale tickets, or stale parking configuration | Log out, clear the relevant localStorage keys, reload, and log in again. |
| Data differs between API calls and the map | The Express API, Next.js API, and browser map use distinct mock state. See sections 1 and 8. |
| A payment fails for insufficient balance | Select fewer sessions or use the demo balance controls. The balance belongs to the shared mock account. |
| Receipt contains no sessions | Pay the selected sessions first. A restart may have reset the process-memory payment state. |
| Report export produces no download | This is the current mock implementation. Use the separate receipt workflow only for printable payment receipts. |
| `pnpm start` cannot find a production build | Run `pnpm build` successfully in the same checkout first. |
| Type checking fails despite a successful build | Type errors are ignored during the configured build. Use the independent TypeScript check and review its diagnostics. |
| `pnpm lint` fails | The repository currently lacks ESLint and its configuration; see section 8. |

## 13. Maintain this guide

Write all code comments, documentation, README text, guides, and contributor instructions in English. Preserve the existing UI language unless a separate localization change is requested. Whenever commands, dependencies, environment requirements, routes, storage, or verification behavior change, update this guide and the README to match the implemented behavior.
