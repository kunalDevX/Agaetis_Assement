# Employee Management System

A full-stack Employee Management CRUD application built using React, TypeScript, Express, Prisma ORM, and PostgreSQL.

## Tech Stack

**Frontend**
- React + Vite
- TypeScript
- Tailwind CSS
- Axios
- Lucide React

**Backend**
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL

## Project Structure

```text
employee_directory/
└── Agaetis_Assessment/
    │
    ├── Backend/
    │   ├── .agents/
    │   ├── .claude/
    │   ├── .cursor/
    │   ├── .devin/
    │   ├── controller/
    │   │   └── employee.controller.ts
    │   ├── generated/
    │   ├── lib/
    │   ├── node_modules/
    │   ├── Prisma/
    │   ├── routes/
    │   │   └── employee.routes.ts
    │   ├── service/
    │   │   └── employee.service.ts
    │   ├── .env
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── pnpm-lock.yaml
    │   ├── prisma.config.ts
    │   ├── server.ts
    │   └── tsconfig.json
    │
    └── Frontend/
        ├── src/
        │   ├── api/
        │   │   └── employees.ts
        │   ├── assets/
        │   ├── components/
        │   │   ├── Avatar.tsx
        │   │   ├── ConfirmDialog.tsx
        │   │   ├── EmployeeModal.tsx
        │   │   ├── EmployeeTable.tsx
        │   │   ├── EmptyState.tsx
        │   │   ├── Header.tsx
        │   │   ├── StatsCards.tsx
        │   │   ├── Toast.tsx
        │   │   └── Toolbar.tsx
        │   ├── hooks/
        │   │   └── useEmployees.ts
        │   ├── types/
        │   │   └── employee.ts
        │   ├── App.css
        │   ├── App.tsx
        │   ├── index.css
        │   └── main.tsx
        ├── .env
        ├── .gitignore
        ├── eslint.config.js
        ├── index.html
        ├── package-lock.json
        └── package.json
```

## Features

- Create employees
- View all employees
- View employee details
- Update employee information
- Delete employees
- Search employees
- Duplicate email validation
- REST API integration

## Installation

### Backend

```bash
cd Backend
pnpm install
```

Configure your `.env` file:

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE"
```

Run migrations and generate Prisma Client:

```bash
pnpm exec prisma migrate dev
pnpm exec prisma generate
```

Start the backend:

```bash
pnpm dev
```

### Frontend

```bash
cd Frontend
pnpm install
```

Configure `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
pnpm dev
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees` | Get employees |
| GET | `/api/employees/:id` | Get employee |
| POST | `/api/employees` | Create employee |
| PATCH/PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
