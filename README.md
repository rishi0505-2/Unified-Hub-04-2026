# Unified Data Hub

A modern, full-featured React dashboard that aggregates live data from four public APIs into a single authenticated interface. Built with React 19, TypeScript, TanStack Query, Zustand, Tailwind CSS, and Framer Motion.

---

## Live Features

| Module | Data Source | What It Does |
|---|---|---|
| **Dashboard** | All APIs combined | Overview cards, top crypto list, live Delhi weather widget, user summary |
| **Users** | JSONPlaceholder | Browse 10 users, view profile + posts, expand posts to load comments on demand |
| **Crypto** | CoinGecko (free) | Live prices for 100 coins — search, sort by any column, paginate |
| **Weather** | Open-Meteo (free) | Current weather for any city with animated backgrounds matching conditions |
| **Auth** | DummyJSON | JWT login with protected routes, session persisted across refresh |

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | React | 19 |
| Language | TypeScript | 6 |
| Build Tool | Vite | 8 |
| Routing | React Router DOM | 7 |
| Server State / Caching | TanStack React Query | 5 |
| Client State | Zustand (with persist) | 5 |
| HTTP Client | Axios | 1.15 |
| Animations | Framer Motion | 12 |
| Styling | Tailwind CSS | 3.4 |
| Toast Notifications | react-hot-toast | 2.6 |
| Icons | Lucide React | 1.8 |

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# 1. Clone the repo
git clone <repo-url>
cd "Unified Data Hub"

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env

# 4. Start the dev server (opens at http://localhost:3000)
npm run dev
```

### Demo Login Credentials

```
Username: emilys
Password: emilyspass
```

> These credentials come from the free [DummyJSON](https://dummyjson.com) API — no registration needed.

---

## Environment Variables

Copy `.env.example` to `.env`. All variables are pre-filled and work out of the box — no API keys required.

```bash
VITE_DUMMY_JSON_BASE_URL=https://dummyjson.com
VITE_JSON_PLACEHOLDER_BASE_URL=https://jsonplaceholder.typicode.com
VITE_COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
VITE_OPEN_METEO_BASE_URL=https://api.open-meteo.com/v1
VITE_APP_NAME=Unified Data Hub
VITE_API_TIMEOUT=10000
```

> All variables must be prefixed with `VITE_` to be exposed to the browser bundle by Vite.

---

## Available Scripts

```bash
npm run dev       # Start development server with HMR (port 3000)
npm run build     # Type-check + production build → dist/
npm run preview   # Serve the production build locally
npm run lint      # Run ESLint
```

---

## Project Structure

```
src/
├── main.tsx                    # React DOM entry point
│
├── app/
│   ├── App.tsx                 # Root: BrowserRouter > Providers > ErrorBoundary > Routes
│   ├── Providers.tsx           # QueryClientProvider + ThemeApplier + Toaster
│   └── queryClient.ts          # TanStack Query global config (staleTime, retry, gcTime)
│
├── store/
│   ├── authStore.ts            # Zustand: user, token, isAuthenticated (persisted)
│   └── uiStore.ts              # Zustand: sidebarOpen (persisted)
│
├── routes/
│   ├── index.tsx               # Route tree with React.lazy() code splitting
│   └── ProtectedRoute.tsx      # Redirects to /login if not authenticated
│
├── layouts/
│   ├── AuthLayout.tsx          # Purple gradient wrapper for the login page
│   ├── DashboardLayout.tsx     # App shell: sidebar + topbar + <Outlet />
│   ├── Sidebar.tsx             # Collapsible nav (Dashboard, Users, Crypto, Weather)
│   └── Topbar.tsx              # Welcome message, notifications, logout
│
├── features/
│   ├── auth/
│   │   ├── components/LoginForm.tsx
│   │   ├── hooks/useLoginMutation.ts
│   │   ├── pages/LoginPage.tsx
│   │   └── services/authService.ts
│   │
│   ├── users/
│   │   ├── components/         # UserCard, UserList, PostList (PostItem)
│   │   ├── hooks/              # useUsers, useUser, usePosts, useComments
│   │   ├── pages/              # UsersPage, UserDetailPage
│   │   └── services/usersService.ts
│   │
│   ├── crypto/
│   │   ├── components/CryptoTable.tsx
│   │   ├── hooks/useCrypto.ts
│   │   ├── pages/CryptoPage.tsx
│   │   └── services/cryptoService.ts
│   │
│   ├── weather/
│   │   ├── components/WeatherCard.tsx
│   │   ├── hooks/              # useWeather, useGeocodingSearch
│   │   ├── pages/WeatherPage.tsx
│   │   └── services/weatherService.ts
│   │
│   └── dashboard/
│       ├── components/AnalyticsCard.tsx
│       └── pages/DashboardPage.tsx
│
├── services/api/
│   ├── axiosInstances.ts       # 5 Axios clients + request/response interceptors
│   └── endpoints.ts            # All API URL constants
│
└── shared/
    ├── components/             # Button, Card, Skeleton, ErrorBoundary, ErrorState,
    │                           # EmptyState, PageLoader, PageTransition,
    │                           # GlobalLoadingIndicator
    ├── hooks/
    │   ├── useAuth.ts          # Selector wrapper over authStore
    │   └── useDebounce.ts      # Delays a value update by N ms
    ├── utils/
    │   ├── cn.ts               # Merges Tailwind class strings
    │   └── formatters.ts       # formatCurrency, formatPercent, formatCompactNumber
    ├── constants/index.ts      # QUERY_KEYS, ROUTES, APP_CONFIG
    └── types/index.ts          # All shared TypeScript interfaces
```

---

## Architecture Overview

### State Management

Two tools handle state, each for a different concern:

**Zustand** — client/persistent state  
Stores authentication data and UI preferences. Both stores use the `persist` middleware, which automatically syncs to `localStorage`. On page refresh, Zustand rehydrates from storage before the first render — so a logged-in user stays logged in.

```
authStore  →  localStorage key: "udh-auth"
  - user (id, name, email, image)
  - token (JWT string)
  - isAuthenticated (boolean)

uiStore    →  localStorage key: "udh-ui"
  - sidebarOpen (boolean)
```

**TanStack React Query** — server/async state  
Handles all API data. Provides automatic caching, background refresh, loading/error states, and request deduplication. If two components on the same page both call `useUsers()`, only one HTTP request is made.

```
Cache settings (queryClient.ts):
  staleTime: 5 minutes    → data won't re-fetch if still fresh
  gcTime: 10 minutes      → unused cache evicted after 10 min
  retry: 2                → auto-retry failed requests twice
  refetchOnWindowFocus: false
```

---

### API Layer

Five dedicated Axios instances, one per external service:

| Instance | Base URL | Token? |
|---|---|---|
| `authApiClient` | dummyjson.com | ✅ Bearer JWT attached |
| `jsonPlaceholderClient` | jsonplaceholder.typicode.com | ❌ |
| `cryptoApiClient` | api.coingecko.com/api/v3 | ❌ |
| `weatherApiClient` | api.open-meteo.com/v1 | ❌ |
| `geocodingApiClient` | geocoding-api.open-meteo.com/v1 | ❌ |

A **request interceptor** on `authApiClient` reads the JWT from Zustand's store (outside React, using `getState()`) and attaches it as an `Authorization: Bearer` header on every request.

A **response interceptor** on all clients handles errors globally:
- `401` → logout user, redirect to `/login`
- `403` → show "no permission" toast
- `500+` → show "server error" toast

---

### Routing & Code Splitting

All pages use `React.lazy()` for dynamic imports. Each page's JavaScript is downloaded only when the user first navigates to it — reducing the initial bundle size significantly.

```
/login       → AuthLayout     → LoginPage         (public)
/            → ProtectedRoute → DashboardLayout → DashboardPage
/users       → ProtectedRoute → DashboardLayout → UsersPage
/users/:id   → ProtectedRoute → DashboardLayout → UserDetailPage
/crypto      → ProtectedRoute → DashboardLayout → CryptoPage
/weather     → ProtectedRoute → DashboardLayout → WeatherPage
```

`ProtectedRoute` reads `isAuthenticated` from Zustand. If false, it redirects to `/login` and passes the intended URL as `state.from`. After successful login, the user is sent back to the page they tried to visit.

---

## Feature Details

### Auth

- POST credentials to DummyJSON `/auth/login`
- On success: stores `{ user, token, isAuthenticated: true }` in Zustand + `localStorage`
- On `401` from any API: auto-logout and redirect to `/login`
- Pre-filled demo credentials shown on the login page

### Users

- Lists 10 users from JSONPlaceholder with name, email, company
- Click any user → detail page with their posts
- Each post has a **"Show comments"** toggle — comments are only fetched when expanded (`enabled` flag in React Query), saving ~100 API calls on load
- Search with debounce (400ms)

### Crypto

- Fetches top 100 coins from CoinGecko public API
- **Search** by name or symbol (debounced, client-side)
- **Sort** by price, market cap, or 24h change (click column header)
- **Paginate** — 20 coins per page
- 24h change shown in green (positive) or red (negative) with trend icon
- Data stays fresh for 60 seconds before background re-fetch

### Weather

- **Default location:** New Delhi, India
- **Search any city** — autocomplete powered by Open-Meteo's free Geocoding API
  - Suggestions appear after 2+ characters (debounced 400ms)
  - Select a suggestion → weather updates immediately
- **Dynamic animated backgrounds** based on current conditions:

  | Condition | Background | Animation |
  |---|---|---|
  | Clear / Sunny | Amber → Orange gradient | Rotating sun with glowing rays |
  | Partly Cloudy | Sky blue gradient | Drifting cloud shapes |
  | Cloudy / Overcast | Slate gradient | Slow cloud drift |
  | Fog | Gray gradient | Blurred drifting fog layers |
  | Drizzle | Slate-blue gradient | Light rain drops |
  | Rain | Dark blue gradient | Heavy rain drops |
  | Thunderstorm | Near-black gradient | Rain + lightning flashes |
  | Snow / Extreme Cold | Light blue gradient | Falling snowflakes |
  | Windy | Teal gradient | Wind lines + clouds |

- Displays temperature, humidity, wind speed, wind direction
- **Auto-refreshes every 30 seconds** via React Query `refetchInterval`
- Manual refresh button available

### Dashboard

- Analytics cards: total users, Bitcoin price, total crypto market cap, weather city count
- Top 5 cryptocurrency list with live prices and 24h change
- Live weather widget for New Delhi
- User overview grid (first 5 users, click to navigate)

---

## Key Technical Patterns

### `useDebounce` hook

Used in both crypto search and weather city search. Delays propagation of a value until the user stops typing for 400ms — prevents an API call on every single keystroke.

```
User types "M" → "Mu" → "Mum" → "Mumb" → "Mumba" → "Mumbai"
                                                        ↑
                                                  400ms later → 1 API call
```

### Lazy comment loading

```
PostItem renders
  ↓
commentsOpen = false → useComments(postId, enabled: false) → no fetch
  ↓
User clicks "Show comments"
  ↓
commentsOpen = true → useComments(postId, enabled: true) → 1 fetch
  ↓
Result cached → re-opening same post = no second request
```

### Global loading indicator

A thin purple bar at the top of the screen appears any time **any** React Query fetch is active across the entire app — including background auto-refreshes. Uses `useIsFetching()` and `useIsMutating()` from TanStack Query.

### Error Boundary

A React class component wraps the entire route tree. Any unhandled JavaScript error during rendering is caught and shows a "Something went wrong — Try again" screen instead of a blank white page.

---

## Build & Type Checking

```bash
# Type-check without building
npx tsc --noEmit

# Full production build (type-check + bundle)
npm run build
```

The build produces a `dist/` folder with:
- Code-split chunks per page (lazy loaded)
- Hashed filenames for cache busting
- Minified CSS (39 KB) and JS (~530 KB total, gzipped ~160 KB)

TypeScript is configured in strict mode with:
- `noUnusedLocals` and `noUnusedParameters` — no dead code
- `noFallthroughCasesInSwitch` — safer switch statements
- Path alias `@/` → `src/` for clean imports

---

## External APIs Used

All APIs are **free with no API key required**.

| API | Docs | Rate Limit |
|---|---|---|
| DummyJSON | https://dummyjson.com/docs | Generous free tier |
| JSONPlaceholder | https://jsonplaceholder.typicode.com | No limit (static data) |
| CoinGecko Public | https://docs.coingecko.com/reference/introduction | 30 calls/min |
| Open-Meteo | https://open-meteo.com/en/docs | 10,000 calls/day |
| Open-Meteo Geocoding | https://open-meteo.com/en/docs/geocoding-api | 10,000 calls/day |


