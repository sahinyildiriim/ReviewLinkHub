# ReviewLinkHub

A management platform for businesses to send review-request emails to their customers, track delivery status, and monitor outcomes — with Excel/PDF reporting and a dashboard summary.

## Architecture

A classic two-tier web app: a React SPA talking to a REST API over HTTP, backed by PostgreSQL.

```
┌─────────────────┐        REST/JSON        ┌──────────────────────┐        EF Core        ┌────────────┐
│  React frontend  │  ─────────────────────▶ │  ASP.NET Core Web API │ ────────────────────▶ │ PostgreSQL │
│  (Vite, TS)       │ ◀───────────────────── │       (.NET 8)         │ ◀──────────────────── │            │
└─────────────────┘                          └──────────┬───────────┘                        └────────────┘
                                                          │
                                              ┌───────────┴───────────┐
                                              │  MailKit (SMTP email)  │
                                              │  Google Places API     │
                                              │  QuestPDF / ClosedXML  │
                                              │  QRCoder               │
                                              └─────────────────────────┘
```

Core domain flow:
1. A business is looked up/matched via the **Google Places API** (`GooglePlacesService`).
2. A **review request** is created for a customer (`ReviewRequestsController` → `ReviewLinkService`), generating a unique review link and QR code (`QrCodeService`).
3. An email is sent to the customer via **MailKit** (`EmailService`), and each delivery attempt is logged (`EmailDelivery`).
4. Failed sends can be **resent**; all requests can be exported as **Excel/PDF** reports (`ReportService`) and summarized on a **dashboard** (daily trend, totals).

## Repository Layout

```
ReviewLinkHub/
├── backend/ReviewLinkHub.Api/     ASP.NET Core 8 Web API
│   ├── Controllers/               HTTP endpoints
│   │   ├── BusinessesController.cs      GET  /api/businesses/search
│   │   ├── ReviewRequestsController.cs  POST /api/review-requests
│   │   │                                POST /api/review-requests/{id}/resend
│   │   │                                GET  /api/review-requests/{id}
│   │   │                                GET  /api/review-requests
│   │   │                                GET  /api/review-requests/{id}/qr-code
│   │   └── ReportsController.cs         GET  /api/reports/review-requests/excel
│   │                                    GET  /api/reports/review-requests/pdf
│   │                                    GET  /api/reports/review-requests/summary
│   ├── Services/                  Business logic, isolated behind interfaces
│   │   ├── ReviewLinkService.cs   Review request creation, resend logic
│   │   ├── EmailService.cs        SMTP sending via MailKit
│   │   ├── GooglePlacesService.cs Business lookup via Google Places API
│   │   ├── QrCodeService.cs       QR code generation (QRCoder)
│   │   └── ReportService.cs       Excel (ClosedXML) / PDF (QuestPDF) report generation
│   ├── Models/                    EF Core entities — Business, ReviewRequest, EmailDelivery
│   ├── DTOs/                      Request/response contracts exposed by the API
│   ├── Data/AppDbContext.cs       EF Core DbContext
│   ├── Options/                   Strongly-typed config (EmailOptions, GooglePlacesOptions)
│   ├── Migrations/                EF Core database migrations
│   └── docker-compose.yml         Local PostgreSQL container
│
└── frontend/                      React + TypeScript SPA (Vite)
    └── src/
        ├── pages/                 Route-level views
        │   ├── HomePage.tsx           Business search / entry point
        │   ├── RequestsPage.tsx       List of review requests
        │   ├── RequestDetailPage.tsx  Single request detail (status, resend, QR)
        │   └── NotFoundPage.tsx
        ├── components/            Reusable UI (business/, layout/, ui/ — shadcn primitives)
        ├── queries/                TanStack Query hooks (useBusinessSearch, useReviewRequests, useReportsSummary)
        ├── hooks/                  Shared React hooks
        ├── lib/                    Utilities (API client, helpers)
        └── types/                  Shared TypeScript types
```

## Tech Stack

### Backend — `backend/ReviewLinkHub.Api`
| Concern | Technology |
|---|---|
| Framework | ASP.NET Core Web API, .NET 8 |
| Database | PostgreSQL via Entity Framework Core + Npgsql |
| Email | MailKit (SMTP) |
| PDF reports | QuestPDF |
| Excel reports | ClosedXML |
| QR codes | QRCoder |
| External data | Google Places API |
| API docs | Swashbuckle (Swagger/OpenAPI) |

### Frontend — `frontend`
| Concern | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4, shadcn/ui, Radix UI primitives |
| Data fetching | TanStack Query + Axios |
| Routing | React Router v7 |
| Charts | Recharts |
| Animation | Framer Motion |
| Icons | Tabler Icons, Lucide |
| Linting | oxlint |

## Local Development

### Prerequisites
- .NET 8 SDK
- Node.js
- Docker (for PostgreSQL)

### Backend

```bash
cd backend/ReviewLinkHub.Api
docker compose up -d        # starts PostgreSQL
dotnet ef database update   # applies migrations
dotnet run                  # starts the API (Swagger UI available in Development)
```

### Frontend

```bash
cd frontend
npm install
npm run dev                 # starts the Vite dev server
```

Other frontend scripts: `npm run build` (type-check + production build), `npm run lint` (oxlint), `npm run preview` (preview the production build).
