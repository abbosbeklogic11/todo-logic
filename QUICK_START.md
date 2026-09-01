# Quick Start Guide

## 1. Choose Your Database Option

### Fastest Option: Neon Cloud
```bash
# Go to https://neon.tech and create free account
# Create a project and copy CONNECTION STRING
```

### Local PostgreSQL
```bash
# Download & install from https://www.postgresql.org/download/windows/
# In PostgreSQL terminal:
createdb todologic
```

## 2. Update Connection String

Edit `.env` file and set:
```
DATABASE_URL="your-connection-string-here"
```

## 3. Initialize Database

```bash
npx prisma migrate deploy
```

## 4. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Verify Everything Works

```bash
# Run tests (should pass)
npm run test

# Check code quality (should pass)
npm run lint

# Type checking (should pass)  
npm run typecheck

# Build for production (should succeed)
npm run build
```

✅ All checks currently passing!
