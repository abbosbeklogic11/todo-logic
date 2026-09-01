# Project Setup Guide

## Prerequisites

This project requires PostgreSQL for the database. You have two options:

### Option 1: Local PostgreSQL (Recommended for Development)

1. **Install PostgreSQL:**
   - Download from https://www.postgresql.org/download/windows/
   - Run installer and remember your password
   - Ensure PostgreSQL service is running

2. **Create the database:**
   ```sql
   createdb todologic
   ```

3. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

### Option 2: Neon Cloud PostgreSQL (Easiest)

1. **Sign up at https://neon.tech** (free tier)
2. **Create a new project** and copy the connection string
3. **Update `.env`:**
   ```
   DATABASE_URL="your-neon-connection-string"
   ```
4. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

## Starting Development

After setting up the database:

```bash
pnpm install  # if not already installed
npm run dev   # or pnpm dev
```

The app will be available at http://localhost:3000

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
