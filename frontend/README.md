# Student Management — React Frontend

A polished, production-quality **React + TypeScript + Tailwind CSS** frontend for the Student Management REST API built with Spring Boot.

---

## Tech Stack

| Layer         | Technology                 |
|---------------|----------------------------|
| UI Library    | React 18                   |
| Language      | TypeScript 5               |
| Styling       | Tailwind CSS 3             |
| HTTP Client   | Axios                      |
| Icons         | Lucide React               |
| Build Tool    | Vite 5                     |
| Fonts         | Syne + DM Sans + JetBrains Mono |

---

## Project Structure

```
src/
├── main.tsx                   ← React entry point
├── App.tsx                    ← Root component (layout, state wiring)
├── index.css                  ← Tailwind directives + global styles
├── types/
│   └── student.ts             ← Student, StudentPayload, ApiResponse, Toast types
├── services/
│   └── studentService.ts      ← Axios CRUD helpers
├── hooks/
│   └── useStudents.ts         ← State management hook (fetch/create/update/delete)
└── components/
    ├── StudentTable.tsx        ← Sortable data table with avatars + badges
    ├── StudentModal.tsx        ← Create / Edit modal with validation
    ├── ConfirmModal.tsx        ← Delete confirmation modal
    └── Toast.tsx               ← Toast notification system
```

---

## Prerequisites

- Node.js 18+ and npm
- The **Spring Boot backend** running on `http://localhost:8080`

---

## Getting Started

### 1 — Install dependencies

```bash
cd student-management-frontend
npm install
```

### 2 — Start the development server

```bash
npm run dev
```

The app runs at **http://localhost:3000**.

Vite's dev server automatically proxies all `/students` requests to `http://localhost:8080`, so no CORS configuration is needed.

### 3 — Build for production

```bash
npm run build
```

Output is placed in `dist/`. Serve with any static host or `npm run preview`.

---

## Features

| Feature | Description |
|---|---|
| **List all students** | Responsive table with sortable columns |
| **Live search** | Filter by name, email, or course instantly |
| **Create student** | Modal form with client-side validation |
| **Edit student** | Pre-filled modal, PUT to API |
| **Delete student** | Confirmation modal before deletion |
| **Toast notifications** | Success / error feedback for every action |
| **Loading states** | Spinner on initial load + button states |
| **Keyboard support** | Escape closes all modals |
| **Error handling** | API errors displayed in form / toast |

---

## Design

**Obsidian Dashboard** aesthetic:
- Near-black background (`#06060b`) with layered surface depth
- Amber/gold (`#f59e0b`) accent color for CTAs and highlights
- `Syne` display font for headings, `DM Sans` for body, `JetBrains Mono` for data
- Noise texture overlay for depth
- Smooth `cubic-bezier` animations on modals, toast slide-in/out
- Color-coded course badges, deterministic avatar colors from student name

---

## API Integration

All API calls go through `src/services/studentService.ts`:

```ts
GET    /students        → getStudents()
POST   /students        → createStudent(payload)
PUT    /students/:id    → updateStudent(id, payload)
DELETE /students/:id    → deleteStudent(id)
```

The Vite proxy (`vite.config.ts`) forwards `/students` → `http://localhost:8080` in development.

For production, set `VITE_API_BASE` or update the proxy target accordingly.
