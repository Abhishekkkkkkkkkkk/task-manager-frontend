# TaskFlow — Frontend

A responsive, modern web application for the TaskFlow Task Management System. Built with **Next.js 14 + TypeScript + Tailwind CSS**.

---

## Live App

```
Production: https://taskflow-abhi.vercel.app/
```

> Replace with your actual Vercel URL after deploying.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Folder Structure](#folder-structure)
- [Pages and Components](#pages-and-components)
- [How Token Refresh Works](#how-token-refresh-works)
- [Local Setup Guide](#local-setup-guide)
- [Environment Variables](#environment-variables)
- [Deployment on Vercel](#deployment-on-vercel)
- [Scripts Reference](#scripts-reference)

---

## Features

### Authentication
- Register with name, email, and password
- Login and stay logged in automatically (token auto-refresh)
- Confirm password field on register with mismatch validation
- Clear error messages for every validation failure
- Redirect to dashboard after login — redirect to login if not authenticated

### Task Dashboard
- View all personal tasks in a clean card layout
- Tasks grouped — active tasks first, completed tasks at the bottom
- Loading skeleton cards while data is being fetched
- Empty state when no tasks exist
- Pagination — navigate between pages of tasks

### Filtering and Search
- Filter tasks by status: All / Pending / In Progress / Completed
- Search tasks by title with a clear button to reset
- Filters and search work together simultaneously

### Task Management
- Create a new task with title, description, status, and due date
- Edit any task in a modal — form pre-filled with existing values
- Delete a task with a confirmation prompt
- Toggle task completion with a single click on the circle icon
- Toast notifications for every action (create, update, delete, toggle)

### UI and UX
- Fully responsive — works on desktop, tablet, and mobile
- Dark mode support throughout
- Smooth modal open/close with backdrop click and Escape key
- Form validation with inline error messages before any API call
- Loading states on all buttons during async operations

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework with server components |
| TypeScript | Type safety throughout |
| Tailwind CSS | Utility-first styling |
| Axios | HTTP client with request/response interceptors |
| React Hook Form | Performant form state management |
| Zod | Schema-based form validation |
| @hookform/resolvers | Connects Zod schemas to React Hook Form |
| react-hot-toast | Toast notification system |
| lucide-react | Clean, consistent icon set |
| clsx + tailwind-merge | Conditional class merging utility |
| tailwindcss-animate | Smooth modal open animations |

---

## Screenshots

> Add your own screenshots by saving images in a `screenshots/` folder and updating the paths below.

### Login Page
```
![Login](./screenshots/login.png)
```

### Register Page
```
![Register](./screenshots/register.png)
```

### Task Dashboard — with tasks
```
![Dashboard](./screenshots/dashboard.png)
```

### Create Task Modal
```
![Create Task](./screenshots/create-task.png)
```

### Edit Task Modal
```
![Edit Task](./screenshots/edit-task.png)
```

### Mobile View
```
![Mobile](./screenshots/mobile.png)
```

**How to add screenshots:**
1. Run the app locally (`npm run dev`)
2. Take screenshots of each page (Windows: `Win + Shift + S`)
3. Save them in `screenshots/` folder inside this repo
4. Replace the placeholder text above with real image links
5. Push to GitHub — they appear in this README automatically

---

## Folder Structure

```
task-manager-frontend/
├── src/
│   ├── app/                           # Next.js App Router pages
│   │   ├── (auth)/                    # Route group — no shared layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx           # Renders LoginForm component
│   │   │   └── register/
│   │   │       └── page.tsx           # Renders RegisterForm component
│   │   ├── (dashboard)/               # Route group — no shared layout
│   │   │   └── dashboard/
│   │   │       └── page.tsx           # Main task management page
│   │   ├── layout.tsx                 # Root layout — font + Toaster
│   │   └── page.tsx                   # Root → redirects to /login
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx          # Email + password form with validation
│   │   │   └── RegisterForm.tsx       # Name + email + password + confirm form
│   │   ├── tasks/
│   │   │   ├── TaskCard.tsx           # Single task — title, status badge, actions
│   │   │   ├── TaskFilters.tsx        # Search bar + status filter pill tabs
│   │   │   ├── TaskForm.tsx           # Shared form for create and edit
│   │   │   ├── TaskList.tsx           # List with skeletons, empty state, grouping
│   │   │   └── TaskModal.tsx          # Modal wrapper combining Modal + TaskForm
│   │   └── ui/
│   │       ├── Button.tsx             # Variants: primary, secondary, danger, ghost
│   │       ├── Input.tsx              # Label + input + error message
│   │       └── Modal.tsx              # Backdrop, Escape key, scroll lock
│   │
│   ├── lib/
│   │   ├── api.ts                     # Axios instance + token interceptors
│   │   ├── auth.ts                    # get/set/clear tokens in localStorage
│   │   ├── utils.ts                   # cn() utility for class merging
│   │   └── hooks/
│   │       ├── useAuth.ts             # register(), login(), logout() + loading state
│   │       └── useTasks.ts            # tasks state + all CRUD operations
│   │
│   └── types/
│       └── index.ts                   # Task, User, TaskMeta, ApiResponse types
│
├── screenshots/                       # Add your app screenshots here
├── public/                            # Static assets
├── .env.local                         # Local environment variables (never commit)
├── .env.example                       # Template for required variables
├── .gitignore
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Pages and Components

### Pages

#### `/login` — Login page
- Rendered by `LoginForm` component
- Validates email format and password presence before sending request
- On success: stores access + refresh token, redirects to `/dashboard`
- On failure: shows server error message as toast

#### `/register` — Register page
- Rendered by `RegisterForm` component
- Validates name length, email format, password length, and confirm password match
- The `.refine()` check runs after field validation to compare passwords
- On success: stores tokens, redirects to `/dashboard`

#### `/dashboard` — Task dashboard
- Protected page — if no token, user should be redirected to `/login`
- Shows task count, filter bar, task list, and pagination
- Manages `modalOpen` and `editingTask` state
- Opens `TaskModal` in create mode (no task) or edit mode (with task)

---

### Components

#### `LoginForm.tsx`
Zod schema used:
```typescript
z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
```

#### `RegisterForm.tsx`
Zod schema used:
```typescript
z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})
```

#### `TaskCard.tsx`
Displays one task with:
- Circle toggle button (click to mark complete/incomplete)
- Title (strikethrough when completed)
- Description preview (2 lines max)
- Status badge with colour coding
- Due date if set
- Edit and delete action buttons

Status badge colours:
| Status | Colour |
|---|---|
| PENDING | Gray |
| IN_PROGRESS | Blue |
| COMPLETED | Green |

#### `TaskList.tsx`
- Shows 4 skeleton cards while `loading` is true
- Shows empty state illustration when `tasks.length === 0`
- Groups tasks: active (PENDING + IN_PROGRESS) first, COMPLETED section below

#### `TaskFilters.tsx`
- Search input — submits on Enter key press, has a clear (×) button
- Status filter tabs: All / Pending / In progress / Completed
- Changing any filter resets page back to 1

#### `TaskForm.tsx`
Shared form used for both create and edit:
- Pre-fills all fields when a `task` prop is provided (edit mode)
- Empty defaults when no `task` prop (create mode)
- Due date field converts between ISO string and HTML date input format

#### `TaskModal.tsx`
- Combines `Modal` + `TaskForm`
- Handles the `loading` state during form submission
- Closes automatically on successful submit
- Title changes: "New task" (create) or "Edit task" (edit)

#### `Modal.tsx`
Base modal component:
- Closes on Escape key press
- Closes on backdrop click (outside the modal box)
- Locks body scroll while open
- Smooth open animation via `tailwindcss-animate`
- Size variants: sm / md / lg

#### `Button.tsx`
Variants available:
| Variant | Use case |
|---|---|
| primary | Main actions (submit, create) |
| secondary | Secondary actions (cancel, previous) |
| danger | Destructive actions (delete) |
| ghost | Subtle actions (sign out, icon buttons) |

Sizes: `sm` / `md` / `lg`

Shows a spinner icon automatically when `loading={true}`.

#### `Input.tsx`
- Accepts `label` prop — renders a `<label>` above the input
- Accepts `error` prop — renders a red error message below
- Highlights border red when `error` is set
- Forwards all standard HTML input props via `forwardRef`

---

## How Token Refresh Works

The axios instance in `src/lib/api.ts` has two interceptors:

### Request interceptor
Runs before every outgoing request. Reads the access token from localStorage and attaches it:
```
Authorization: Bearer eyJhbGci...
```

### Response interceptor
Runs after every response comes back. If the response is a `401 Unauthorized`:

```
1. Is _retry already true on this request?
   YES → reject (prevents infinite loop)
   NO  → continue

2. Is another refresh already in flight?
   YES → queue this request, wait for new token
   NO  → start the refresh

3. Is there a refresh token in localStorage?
   NO  → clear tokens, redirect to /login
   YES → call POST /auth/refresh

4. Did the refresh succeed?
   YES → store new tokens, flush the queue, retry original request
   NO  → clear tokens, redirect to /login
```

### Why this matters for users

Without this, users would get logged out every 15 minutes. With this, they stay logged in for 7 days and never notice the token expiring — the interceptor handles everything silently in the background.

---

## Local Setup Guide

### Step 1 — Prerequisites

```bash
node --version    # v18 or higher
npm --version     # v9 or higher
```

The backend must be running before the frontend can make API calls. Set up and start the backend first — see the [backend README](https://github.com/YOUR-USERNAME/task-manager-backend).

### Step 2 — Clone and install

```bash
git clone https://github.com/YOUR-USERNAME/task-manager-frontend.git
cd task-manager-frontend
npm install
```

### Step 3 — Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and set the backend URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Step 4 — Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Step 5 — Test the full flow

1. Go to `http://localhost:3000` — redirects to `/login`
2. Click "Create one free" to go to register
3. Fill in your details and register
4. You land on the dashboard
5. Click **New task** and create a few tasks
6. Try filtering by status, searching by title
7. Click the circle on a task to toggle it complete
8. Click the pencil icon to edit
9. Click the trash icon to delete
10. Sign out and sign back in — your tasks persist

### Testing on mobile (same WiFi)

```bash
# Start with your PC's local IP
npm run dev -- -H 0.0.0.0
```

Then open `http://192.168.1.X:3000` on your phone (replace with your actual PC IP from `ipconfig`).

Also update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://192.168.1.X:4000
```

---

## Environment Variables

### `.env.local` (for local development)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### For production (set in Vercel dashboard)

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### `.env.example` (commit this — no real values)

```env
NEXT_PUBLIC_API_URL=
```

> Variables prefixed with `NEXT_PUBLIC_` are included in the browser bundle and are visible to users. Never put secrets here. The API URL is safe to expose.

---

## Deployment on Vercel

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "ready for deployment"
git push
```

### Step 2 — Import on Vercel

1. Go to [vercel.com](https://vercel.com) → sign up with GitHub
2. Click **Add New Project**
3. Find and select `task-manager-frontend`
4. Click **Import**

### Step 3 — Add environment variable

Before clicking Deploy, scroll to **Environment Variables**:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.onrender.com` |

### Step 4 — Deploy

Click **Deploy**. Takes about 2 minutes. You get a URL like:
```
https://task-manager-frontend.vercel.app
```

### Step 5 — Update backend CORS

Go to your Render backend → **Environment** → update `CLIENT_URL`:
```
CLIENT_URL=https://task-manager-frontend.vercel.app
```

Render will auto-redeploy the backend.

### Auto-redeploy

Every `git push` to `main` triggers an automatic redeploy on Vercel:

```bash
git add .
git commit -m "fix: update task card styling"
git push
# Vercel redeploys automatically in ~1 minute
```

---

## Scripts Reference

```bash
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Build for production (checks for TypeScript errors)
npm start          # Start production server (after build)
npm run lint       # Run ESLint to check for code issues
```

---

## Common Issues

| Issue | Fix |
|---|---|
| Blank page / redirect loop | Check `NEXT_PUBLIC_API_URL` is set correctly in `.env.local` |
| `Network Error` on all requests | Make sure backend is running on port 4000 |
| CORS error in browser console | Backend `CLIENT_URL` must match the frontend URL exactly |
| Token not saved after login | Check localStorage in DevTools → Application → Local Storage |
| `flex-shrink-0` Tailwind warning | Replace with `shrink-0` — both work, `shrink-0` is the modern name |
| Modal animation not working | Run `npm install tailwindcss-animate` and add plugin to `tailwind.config.ts` |
| Mobile can't reach backend | Use PC local IP (e.g. `192.168.1.5:4000`) not `localhost:4000` |
| Build fails on Vercel | Run `npm run build` locally first to catch TypeScript errors |