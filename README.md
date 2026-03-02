# PaperFlow
React Native Course Project

## Link to APK
*TBD*

## Walkthrough Tutorial

1. Open the app - Welcome screen shows features overview - Tap "Get Started"
2. Login with demo account: `demo@paperflow.com` / `Demo123` (or create your own account)
3. Navigate to **Filters** tab - Create a filter with keywords (e.g., "reinforcement learning") and select arXiv categories
4. Switch to **Feed** tab - Papers matching your filter appear automatically
5. Tap any paper - View full details (title, authors, abstract, categories, links)
6. Tap the "heart icon" to save a paper - Find it later in the **Favorites** tab
7. Use **Search** tab - Type keywords or scan a paper title with the camera (OCR)
8. Go to **Profile** tab - Settings - Toggle Dark Mode, manage data

## Installation Guide

### Prerequisites

- Node.js >= 18
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone (iOS App Store / Google Play Store)
- Android Studio (optional, for emulator)

### Steps to install and run project locally

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd PaperFlow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the backend server:**

[https://github.com/ninovvas/paperFlow-react-native-api](paperFlow-react-native-api)

Checkout the project and run the command:

   ```bash
   npm run dev
   ```

Link of the hosted backend: [https://paperflow-react-native-api.onrender.com](paperFlow-react-native-api)

4. **Configure the API URL:**
   Open `src/api/api.js` and set `BASE_URL` to your computer's local IP address:
   ```
   http://<YOUR_LOCAL_IP>:3001
   ```

5. **Start the Expo development server:**
   ```bash
   cd ..
   npm start
   ```

6. **Scan the QR code** with Expo Go on your phone

### Demo Account
- Email: `demo@paperflow.com`
- Password: `Demo123`

---

## Functional Guide

### 1. Project Overview

**Application Name:** PaperFlow

**Application Category / Topic:** Education / Research / Productivity

**Main Purpose:**
PaperFlow is a mobile application for academic paper discovery. It helps researchers, students, and science enthusiasts find, filter, and save academic papers from arXiv and Crossref. Users create custom keyword-based filters with category selection to build a personalized paper feed. A camera-based OCR feature allows scanning paper titles directly for instant search.

---

### 2. User Access & Permissions

#### Guest (Not Authenticated)

An unauthenticated user can access:
- **Welcome Screen** — overview of app features and data sources
- **Login Screen** — sign in with existing account
- **Register Screen** — create a new account

Guests cannot access the main app content (feed, search, filters, favorites, profile).

#### Authenticated User

A logged-in user has full access to:
- **Main sections / tabs:** Feed, Search, Filters, Favorites, Profile (5-tab bottom navigation)
- **Details screens:** Paper Details (title, authors, abstract, categories, PDF/DOI links, share)
- **Create / Edit / Delete actions:**
  - **Create:** New filter (keywords, categories, source, date range, max results)
  - **Edit:** Existing filters (all fields editable)
  - **Delete:** Filters (swipe or delete button), Favorites (toggle heart icon)
  - **Toggle:** Filter active/inactive state (switch on FilterCard)

---

### 3. Authentication & Session Handling

#### Authentication Flow

1. **App starts** - `AppNavigator` checks `isAuthenticated` from `AuthProvider`. While checking, a loading spinner is shown to prevent "flash" of login screen.
2. **Auth status check** - In `json-server` mode: reads encrypted token from `SecureStore` (expo-secure-store). In `firebase` mode: `onAuthStateChanged` listener detects session automatically.
3. **Successful login/registration** - Server returns `accessToken` + `user` object - stored in `SecureStore` - `api.js` sets `Authorization: Bearer <token>` header - navigation switches to `TabNavigator`.
4. **Logout** - `signOut()` clears `SecureStore` data - sets `accessToken` and `user` to `null` - navigation switches back to `AuthNavigator`.

#### Session Persistence

- **Storage method:** `expo-secure-store` (encrypted device keychain — iOS Keychain / Android Keystore). This is the `useSecureState` hook, following the instructor exam preparation pattern.
- **Automatic login:** On app restart, `useSecureState` loads the encrypted token from `SecureStore`. If a valid token exists, the user is automatically authenticated without re-entering credentials.

---

### 4. Navigation Structure

#### Root Navigation Logic

`AppNavigator` uses a conditional stack:
- **Not authenticated** - Shows `AuthNavigator` (Welcome - Login / Register)
- **Authenticated** - Shows `TabNavigator` (5 tabs with nested stacks)

This pattern is implemented with `@react-navigation/native-stack` and conditional rendering based on `useAuth().isAuthenticated`.

#### Main Navigation

The main navigation is a **Bottom Tab Navigator** with 5 tabs:

| Tab | Icon | Stack Screens |
|-----|------|---------------|
| Feed | newspaper | Feed - PaperDetails |
| Search | search | Search - PaperDetails |
| Filters | filter | FilterList - CreateFilter / EditFilter |
| Favorites | heart | Favorites - PaperDetails |
| Profile | person | Profile - Settings / About |

#### Nested Navigation

Yes — each tab contains a **Native Stack Navigator**:
- **FeedNavigator:** FeedScreen - PaperDetailsScreen
- **SearchNavigator:** SearchScreen - PaperDetailsScreen
- **FiltersNavigator:** FilterListScreen - CreateFilterScreen / EditFilterScreen
- **FavoritesNavigator:** FavoritesScreen - PaperDetailsScreen
- **ProfileNavigator:** ProfileScreen - SettingsScreen / AboutScreen

---

### 5. List - Details Flow

#### List / Overview Screen

- **Feed:** Displays academic papers as `PaperCard` components in a `FlatList`. Each card shows: title, authors (truncated), primary category, published date, source badge (arXiv/Crossref), and bookmark heart icon. Pull-to-refresh supported.
- **Favorites:** Same `PaperCard` layout showing saved papers.
- **Filters:** `FilterCard` components showing filter name, keywords as chips, categories, source, active toggle switch, and delete button.

User interaction: Tap a paper card - navigate to details. Tap heart - toggle bookmark. Pull down - refresh.

#### Details Screen

- **Navigation trigger:** `onPress` on `PaperCard` calls `navigation.navigate('PaperDetails', { paperId, source, paper })`
- **Route parameters received:** `paperId` (string, arXiv ID or DOI), `source` ('arxiv' or 'crossref'), `paper` (full paper object for instant display). If `paper` is not passed, the screen fetches it by `paperId` from the API.

---

### 6. Data Source & Backend

#### Backend Type

**Dual-mode architecture:**

1. **json-server-auth** (default) — Simulated REST backend with JWT authentication, bcrypt password hashing, and resource authorization (userId-based). Runs locally or on Render.com.
   - `server/db.json` — Database file (users, filters, favorites)
   - `server/routes.json` — Authorization rules (600 for users, 660 for filters/favorites)

2. **Firebase Authentication** (switchable) — Real backend for authentication only. Configured via `AUTH_MODE` in `src/config.js`. CRUD operations always use json-server.

**External APIs (read-only):**
- **arXiv API** (api.arxiv.org) — Academic paper metadata, Atom XML format
- **Crossref API** (api.crossref.org) — Academic paper metadata, JSON format
- **OCR.space API** — Free OCR for camera-based text extraction

---

### 7. Data Operations (CRUD)

#### Read (GET)

| Data | Source | Screen |
|------|--------|--------|
| Papers (feed) | arXiv API + Crossref API | FeedScreen |
| Papers (search) | arXiv API + Crossref API | SearchScreen |
| Paper details | arXiv API (by ID) | PaperDetailsScreen |
| User filters | json-server `/filters?userId=X` | FilterListScreen |
| User favorites | json-server `/favorites?userId=X` | FavoritesScreen |

#### Create (POST)

- **Filters:** User fills the CreateFilterScreen form (name, keywords, categories, source, date range, max results) - `POST /filters` with `userId` attached
- **Favorites:** User taps heart icon on PaperCard - `POST /favorites` with paper data + `userId`
- **Registration:** User fills RegisterScreen form - `POST /register` (json-server-auth)

#### Update / Delete (Mutation)

- **Update (PATCH):** Edit filter (EditFilterScreen - `PATCH /filters/:id`), Toggle filter active/inactive (FilterCard switch - `PATCH /filters/:id`)
- **Delete (DELETE):** Delete filter (FilterCard delete button - `DELETE /filters/:id`), Remove favorite (heart toggle - `DELETE /favorites/:id`)
- **UI update:** All mutations update React Context state immediately - UI re-renders. FeedScreen auto-refreshes when returning from filter changes (content hash comparison).

---

### 8. Forms & Validation

#### Forms Used

1. **Login Form** (LoginScreen) — Email, Password
2. **Registration Form** (RegisterScreen) — Display Name, Email, Password, Confirm Password
3. **Create Filter Form** (CreateFilterScreen) — Filter Name, Keywords, Categories, Source, Date Range, Max Results
4. **Edit Filter Form** (EditFilterScreen) — Same fields as Create Filter, pre-filled

#### Validation Rules

| Field | Rules |
|-------|-------|
| **Email** (Login/Register) | Required, must match regex `\S+@\S+\.\S+` |
| **Password** (Register) | Required, min 6 characters, must contain at least 1 uppercase letter, must contain at least 1 number |
| **Confirm Password** (Register) | Must match Password field |
| **Display Name** (Register) | Required, min 2 characters |
| **Filter Name** (Create/Edit) | Required, min 2 characters, max 50 characters |
| **Keywords** (Create/Edit) | Required, at least 1 keyword (comma-separated validation) |

---

### 9. Native Device Features

#### Used Native Feature: Camera + OCR (expo-image-picker)

**Component:** `ScanToSearch` (src/components/ScanToSearch.jsx)

**Where it is used:** Search tab — displayed as a card above search results ("Scan Paper Title")

**Functionality:**
1. User taps "Scan Paper Title" - requests camera permission via `requestCameraPermissionsAsync()`
2. Opens device camera via `launchCameraAsync()` with editing enabled and 16:4 aspect ratio
3. Captured image is converted to base64 using `expo-file-system`
4. Image is sent to OCR.space API (Engine 2, optimized for photos)
5. Extracted text is displayed in an editable TextInput — user can correct if needed
6. User taps "Search" - extracted text is used as search query across arXiv and Crossref
7. Fallback: If OCR fails, user can manually type the paper title

#### Additional Native Features

- **expo-secure-store:** Encrypted storage for authentication tokens (iOS Keychain / Android Keystore)
- **expo-local-authentication:** Biometric authentication capability (included in dependencies)
- **@react-native-community/datetimepicker:** Native date picker for filter date range selection

---

### 10. Typical User Flow

1. **Open app** - Welcome screen displays - Tap "Get Started" - Login with credentials
2. **Create filter** - Navigate to Filters tab - Tap "+" - Enter name "AI Research", keywords "transformer, attention", select category "cs.AI", source "arXiv" - Save
3. **Browse feed** - Switch to Feed tab - Papers matching the filter load automatically - Scroll through results - Tap a paper to read full abstract and details
4. **Save paper** - Tap heart icon on an interesting paper - Paper is saved to Favorites
5. **Search specific paper** - Go to Search tab - Type keywords OR tap "Scan Paper Title" - Use camera to photograph a paper title - OCR extracts text - Results appear
6. **Manage filters** - Go back to Filters tab - Toggle filter on/off, edit keywords, or delete - Feed updates automatically when switching back
7. **Customize settings** - Profile - Settings - Enable Dark Mode - Entire app switches theme

---

### 11. Error & Edge Case Handling

#### Authentication Errors
- Invalid email/password - Red error banner with message "Cannot find the user" or "Incorrect password"
- Error is cleared when navigating between Login ↔ Register screens (`clearError()`)
- Network error during login - Error banner with descriptive message

#### Network or Data Errors
- arXiv/Crossref API failure - Individual source errors are caught and logged, other sources still load
- arXiv rate limiting (429) - Automatic retry with exponential backoff (5s, 10s)
- Feed fetch failure - Error screen with "Try Again" button and cloud-offline icon
- Server unreachable - Axios interceptor logs errors, user sees appropriate error state

#### Empty or Missing Data States
- **No filters created** - EmptyState component with "Create your first filter" message and action button
- **Filters exist but none active** - "No active filters" message with "Manage Filters" and "New Filter" buttons
- **Filters active but no results** - "No papers found" with "Edit Filters" and "New Filter" buttons
- **No favorites saved** - EmptyState with bookmark icon and guidance text
- **Search with no results** - "No results found" with suggestion to try different keywords
- **OCR extraction fails** - Warning message, editable text field for manual entry

---

### 12. Additional Technical Information

#### Project Architecture

```
src/
├── api/              # API services (arXiv, Crossref, auth, filters, favorites)
├── components/       # Reusable UI components (PaperCard, FilterCard, Input, Button, etc.)
├── contexts/         # React Context providers (Auth, Filters, Favorites, Settings)
├── hooks/            # Custom hooks (useSecureState, usePersistedState)
├── navigation/       # React Navigation setup (Tab, Stack, Auth navigators)
├── screens/          # Screen components organized by feature
│   ├── auth/         # Welcome, Login, Register
│   ├── feed/         # Feed, PaperDetails
│   ├── search/       # Search (with ScanToSearch)
│   ├── filters/      # FilterList, CreateFilter, EditFilter
│   ├── favorites/    # Favorites
│   └── profile/      # Profile, Settings, About
└── utils/            # XML parser, category definitions
```

#### Key Technologies

| Technology | Purpose |
|-----------|---------|
| React Native + Expo SDK 54 | Cross-platform mobile framework |
| React Navigation 7 | Navigation (Stack + Bottom Tabs) |
| React Hook Form | Form state management and validation |
| Axios | HTTP client with interceptors |
| expo-secure-store | Encrypted auth token storage |
| expo-image-picker | Camera access for OCR scanning |
| fast-xml-parser | arXiv Atom XML parsing |
| json-server-auth | REST API with JWT + bcrypt |
| Firebase Auth | Alternative authentication provider |
| AsyncStorage | Local settings persistence |

#### Context Providers

| Provider | Purpose | Hook |
|----------|---------|------|
| AuthProvider | Authentication state, login/register/logout | `useAuth()` |
| FilterProvider | User filter CRUD operations | `useFilters()` |
| FavoritesProvider | Saved papers CRUD operations | `useFavorites()` |
| SettingsProvider | App settings (dark mode, compact cards) | `useSettings()` |

All context hooks include error checks: `if (!context) throw new Error(...)`.

#### Security Features

- **Encrypted token storage** via `expo-secure-store` (device keychain)
- **Password hashing** with bcrypt ($2b$10$...) on the server
- **Resource authorization** via json-server-auth routes (660 = user can only CRUD own data)
- **Passwords never stored** — only accessToken and user object persisted
- **Bearer token authentication** — Authorization header set automatically via Axios interceptor

#### Dark Mode Support

Dark mode is implemented at the `NavigationContainer` level using React Navigation's theme system. Toggling dark mode in Settings applies the theme globally across all screens, headers, tab bar, and screen backgrounds via `useTheme()` hook.
