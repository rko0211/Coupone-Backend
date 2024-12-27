# Express + Prisma + TypeScript Project

## Introduction

This project demonstrates how to set up a scalable and modern backend using **Express**, **Prisma**, and **TypeScript**. It also includes configuration for environment variables and instructions for further development.

---

## Features

- **Express**: Fast and minimalist web framework for Node.js.
- **Prisma**: Modern database ORM for easy database access.
- **TypeScript**: Type-safe JavaScript for better development experience.
- **dotenv**: Environment variable management.
- **Modular Structure**: Controllers and routes are separated for scalability.

---

## Prerequisites

Make sure you have the following installed:

- **Node.js** (>= 14.x)
- **npm** (>= 6.x) or **yarn**

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd express-typescript-prisma
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add:

```
DATABASE_URL="file:./dev.db"
PORT=3000
```

### 4. Initialize Prisma Database

```bash
npx prisma migrate dev --name init
```

### 5. Start the Server

For development mode:

```bash
npm run dev
```

For production mode:

```bash
npm run build
npm start
```

---

## Folder Structure

```
/src
  ├── controllers/
  │   ├── user.controller.ts
  ├── routes/
  │   ├── user.routes.ts
  ├── server.ts
/public
  ├── index.html
/prisma
  ├── schema.prisma
.env
```

---

## API Endpoints

### 1. Get All Users

**Endpoint:**

```
GET /users
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2023-12-27T10:00:00.000Z"
  }
]
```

### 2. Create a User

**Endpoint:**

```
POST /users
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

**Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "createdAt": "2023-12-27T10:00:00.000Z"
}
```

---

## Notes

1. **Environment Variables:** Ensure `.env` is added to `.gitignore` to prevent accidental exposure.
2. **Database Configuration:** You can replace SQLite with any other database by updating `prisma/schema.prisma`.
3. **Static Documentation Page:**
   - Visit `http://localhost:3000` to see the HTML documentation.
   - Located in `/public/index.html`.

---

## Useful Commands

- **Generate Prisma Client:**

```bash
npx prisma generate
```

- **Apply Database Migrations:**

```bash
npx prisma migrate dev --name migration_name
```
