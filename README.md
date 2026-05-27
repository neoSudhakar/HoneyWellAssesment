# Inventory Movement Dashboard

End-to-end web app to **validate stock movement JSON with SHA-256**, persist verified uploads on the server, and **visualize** filtered movements with a table and charts.

- **Frontend:** React + JavaScript + Vite + Recharts (`frontend/`)
- **Backend:** Spring Boot 2.7 (Java 8 compatible) (`backend/`)

## Features

| Area | Description |
|------|-------------|
| SHA validation | Browser computes SHA-256; `POST /api/verify-file` recomputes hash on raw file bytes |
| Filters | Date range (required), movement type (All/IN/OUT), warehouse (bonus) |
| Table | Paginated (10 rows/page), reflects active filters |
| Pie chart | Share of total **quantity** IN vs OUT (filtered data) |
| Time series | Daily IN/OUT quantity lines (only dates present in filtered data) |

## Prerequisites

- **Java 8+** (backend is Spring Boot 2.7)
- **Node.js 18+** and **npm** (frontend uses Vite 5, compatible with Node 18; do not upgrade to Vite 6+ unless you upgrade Node to 20+)

## Run the backend

**Windows (no Maven install needed):**

```bat
cd backend
run-backend.cmd
```

This downloads Maven into `backend\.tools` on first run, builds the project, then starts Spring Boot.

**If Maven is already installed:**

```bash
cd backend
mvn -DskipTests clean package
mvn spring-boot:run
```

API base: `http://localhost:8080`

- `GET /api/movements?from=YYYY-MM-DD&to=YYYY-MM-DD&type=IN|OUT&warehouse=WH-NORTH`
- `POST /api/verify-file` — multipart: `file` (JSON), `sha256` (hex digest from frontend)

On first start, sample data is copied from `src/main/resources/movements.json` to `backend/data/movements.json`. Successful uploads replace that file.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` to the backend.

## Verify SHA flow manually

1. Select the same JSON file in the UI (digest is computed in the browser).
2. Click **Verify & Upload** — the server hashes the uploaded bytes and compares to your digest.
3. On success, filters/charts refresh from `GET /api/movements`.

## Tests

```bash
cd backend
build-backend.cmd
```

## Project layout

```
Honeywell/
├── README.md
├── backend/          # Spring Boot API
└── frontend/         # React dashboard
```

## Trade-offs / notes

- **Pagination** is client-side on the filtered API response (spec does not require server paging).
- **Large uploads** (10k+ records) are supported; initial bundle uses the provided 10k mock dataset.
- **Date filtering** uses UTC calendar dates from ISO timestamps.
- Warehouse filter is optional (bonus feature from the spec).

## Deliverables checklist

- [x] React frontend with upload, SHA, filters, table, pie + line charts
- [x] Spring Boot REST API with verify + filtered movements
- [x] Sample `movements.json` (10,000 records)
- [x] README with run instructions
