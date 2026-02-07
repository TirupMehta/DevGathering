# MVP Release Checklist

**Project:** Dev Gathering  
**Branch:** mvp/initial  
**Spec Checksum:** _[Paste SHA256 of mvp.txt here]_

---

## Pre-Release Verification

### Development ☐
- [ ] All pages render correctly (/, /about, /events, /request, /admin)
- [ ] Email notify form submits successfully
- [ ] Request city form submits successfully
- [ ] Admin login works with valid credentials
- [ ] Admin dashboard loads after login
- [ ] Create event flow works (with Supabase config)
- [ ] Rate limiting triggers after 10 requests
- [ ] All TypeScript compiles without errors
- [ ] ESLint passes with no errors

### Security ☐
- [ ] Security headers present (check with `curl -I`)
  - [ ] Strict-Transport-Security
  - [ ] X-Frame-Options: DENY
  - [ ] X-Content-Type-Options: nosniff
  - [ ] Content-Security-Policy
- [ ] XSS payloads rejected by forms (400 response)
- [ ] HTML tags stripped/rejected from inputs
- [ ] Admin password uses bcrypt hash
- [ ] Session cookies are httpOnly and SameSite=Strict
- [ ] No secrets in NEXT_PUBLIC_* variables
- [ ] No secrets in client-side JavaScript bundle
- [ ] Re-authentication required for event creation

### QA ☐
- [ ] Unit tests pass (`npm test`)
- [ ] Form validation error messages display correctly
- [ ] Success messages display after form submission
- [ ] Mobile responsive design verified
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] 404 page works for unknown routes
- [ ] Logs create with IP hashing (no raw IPs)

### Ops ☐
- [ ] Production build succeeds (`npm run build`)
- [ ] Preview deployment works
- [ ] Environment variables documented
- [ ] CI pipeline passes
- [ ] Performance targets met:
  - [ ] LCP < 1.2s
  - [ ] CLS < 0.05
  - [ ] Lighthouse score 90+

---

## Sign-off

| Role | Name | Initials | Date |
|------|------|----------|------|
| Developer | | | |
| Security Reviewer | | | |

---

## Notes

_Add any deployment notes or known issues here._
