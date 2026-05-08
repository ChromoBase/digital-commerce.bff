<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Digital Commerce BFF

A **reusable single-store e-commerce backend template** built with NestJS, Prisma, and PostgreSQL (Supabase).

## Overview

This BFF (Backend for Frontend) is designed as a configurable template for e-commerce projects. The backend remains generic through environment-based configuration, allowing it to be reused across different stores without code changes.

**Current Implementation:** Digicams - a curated camera store

**Architecture:** Single-store template (not multi-tenant SaaS)

## Tech Stack

- **Framework:** NestJS 10.x
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma 6.x
- **Language:** TypeScript
- **Validation:** class-validator, class-transformer
- **Security:** Helmet, CORS, Argon2, JWT
- **Authentication:** Passport, JWT Strategy
- **Rate Limiting:** @nestjs/throttler

## Features

- 🏪 Configurable store identity via environment variables
- 📦 Product catalog with categories and variants
- 🎨 Storefront settings (hero, theme colors, branding)
- 🔒 Professional authentication with Argon2 + JWT
- 🔐 HttpOnly cookies for secure token storage
- 🔄 Automatic refresh token rotation
- 🛡️ Role-based access control (CUSTOMER, ADMIN)
- ⚡ Rate limiting on authentication endpoints
- 🔍 SEO-friendly slugs for products and categories
- 📸 Multi-image support for products
- 📊 Product variants with stock management
- 🛡️ Type-safe database queries with Prisma

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended)

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file based on `.env.example`:

```bash
# Server
PORT=4000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# Database (Supabase)
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# Store Configuration
DEFAULT_STORE_SLUG="digicams"

# JWT Authentication
JWT_ACCESS_SECRET="your-random-32-byte-hex-string"
JWT_REFRESH_SECRET="your-random-32-byte-hex-string"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

**Generate JWT Secrets:**
```bash
# On Windows (PowerShell)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# On macOS/Linux
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Seed database with Digicams demo data
npx prisma db seed

# Open Prisma Studio (optional)
npx prisma studio
```

## Project setup

```bash
$ npm install
```

## Running the Application

```bash
# development
$ npm run start

# watch mode (recommended for development)
$ npm run start:dev

# production mode
$ npm run start:prod
```

The API will be available at `http://localhost:4000/api`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout and revoke refresh token

### Public Storefront

- `GET /api/health` - Service health check
- `GET /api/storefront/home` - Home page data (hero, featured categories, featured products)
- `GET /api/categories` - List all categories
- `GET /api/categories/:slug/products` - Products by category
- `GET /api/products` - List products (supports `?category=slug` and `?featured=true`)
- `GET /api/products/:slug` - Product details

See [docs/API_ENDPOINTS.md](docs/API_ENDPOINTS.md) for detailed documentation.Roadmap

### ✅ Phase 1 - Template Foundation (Complete)
- [x] Configurable single-store architecture
- [x] Public storefront endpoints
- [x] Product catalog with categories
- [x] Simplified role system (CUSTOMER, ADMIN)
- [x] Digicams seed data

### ✅ Phase 2 - Authentication (Complete)
- [x] Email/password authentication with Argon2
- [x] JWT access tokens (15 min) + refresh tokens (7 days)
- [x] HttpOnly cookie storage (secure, sameSite)
- [x] Automatic refresh token rotation
- [x] HMAC-SHA256 for refresh token hashing
- [x] Rate limiting (3-10 req/min by endpoint)
- [x] Generic error messages (prevent user enumeration)
- [x] `@CurrentUser()` decorator
- [x] JwtAuthGuard + RolesGuard
- [x] Password policy (10-72 chars, professional standards)
- [x] Demo users (admin@digicams.dev, customer@digicams.dev)

### 📋 Phase 3 - Admin API
- [ ] Admin product CRUD
- [ ] Admin category CRUD
- [ ] Storefront settings management
- [ ] Stock management
- [ ] Image uploads

### 🛒 Phase 4 - Shopping Cart
- [ ] Guest cart
- [ ] User cart
- [ ] Cart merge on login

### ❤️ Phase 5 - Wishlists
- [ ] Simple favorites
- [ ] Named wishlists

### 💳 Phase 6 - Orders & Checkout
- [ ] Order creation
- [ ] Stripe integration
- [ ] Order status tracking
- [ ] Webhooks

### 👤 Phase 7 - Account Management
- [ ] User profile
- [ ] Addresses
- [ ] Order history

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)

## License

MIT
- `DEFAULT_STORE_SLUG` - Which store to load (e.g., "digicams")
- `DATABASE_URL` - PostgreSQL connection (via PgBouncer)
- `DIRECT_URL` - Direct PostgreSQL connection (for migrations)
- `PORT` - API server port (default: 4000)

This makes the BFF reusable across projects. To create a new store:

1. Change `DEFAULT_STORE_SLUG` in `.env`
2. Update seed data in `prisma/seed.ts`
3. Run `npx prisma db seed`

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).


🚀 Demo Credentials:
Admin: admin@digicams.dev / AdminPass123!
Customer: customer@digicams.dev / CustomerPass123!