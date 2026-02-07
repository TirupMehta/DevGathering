# Dev Gathering

A minimal, production-grade community platform for developer events. Built with Next.js 14, TypeScript, and security-first principles.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Generate admin password hash
node -e "require('bcryptjs').hash('your-password', 12).then(console.log)"
# Copy the hash to ADMIN_PASSWORD_HASH in .env.local

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_PASSWORD_HASH` | Yes | bcrypt hash of admin password |
| `ADMIN_EMAIL` | Yes | Email to receive form submissions |
| `RESEND_API_KEY` | Yes | API key from [Resend](https://resend.com) |
| `FROM_EMAIL` | No | Sender email (default: noreply@devgathering.in) |
| `SUPABASE_URL` | For events | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | For events | Supabase service role key |
| `IP_HASH_SALT` | Yes | Random string for IP hashing in logs |
| `QR_SECRET` | Yes | Secret for QR token generation |

## Pages

- `/` — Home with email capture
- `/about` — About page
- `/events` — Event listings
- `/request` — Request city form
- `/admin` — Admin login
- `/admin/dashboard` — Event management

## Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm run start     # Production server
npm run lint      # ESLint
npm run test      # Run tests
npm run typecheck # TypeScript check
```

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

Or use CLI:
```bash
npm i -g vercel
vercel
```

## Security Features

- Security headers (CSP, HSTS, X-Frame-Options)
- Rate limiting (10 req/min per IP)
- bcrypt password hashing
- Secure session cookies (httpOnly, SameSite=Strict)
- Input validation with Zod
- PII redaction in logs
- No secrets in client code

## Architecture

```
src/
├── app/              # Next.js App Router pages
│   ├── api/          # API routes
│   └── admin/        # Admin pages
├── components/       # React components
└── lib/              # Utilities
    ├── auth.ts       # Authentication
    ├── email.ts      # Resend integration
    ├── logger.ts     # Append-only logging
    ├── qr.ts         # QR token generation
    ├── supabase.ts   # Lazy Supabase client
    └── validation.ts # Zod schemas
```

## License

MIT
