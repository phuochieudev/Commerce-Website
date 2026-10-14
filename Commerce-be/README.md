# Commerce API

REST API for the Commerce e-commerce app: Express + TypeScript + Sequelize + PostgreSQL, organised as a modular monolith with Hexagonal Architecture (13 modules in `src/modules`).

See the [root README](../README.md) for features, architecture, environment variables and the full local setup.

```bash
cp .env.example .env   # set DATABASE_URL and JWT_SECRET
npm install
npm run seed           # create tables + demo data (truncates existing data)
npm run dev            # http://localhost:3000, Swagger UI at /swagger
```
