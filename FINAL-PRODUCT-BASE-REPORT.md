

## Final security hardening addendum

The server now exposes an authenticated `GET /api/admin/status` readiness endpoint for OWNER sessions. It reports only whether the server environment contains `ADMIN_PRIVATE_KEY`; the key value is never returned to the browser. The secret must be supplied later as a server environment variable, never committed to source or included in the archive.

Login attempts now have a bounded in-memory rate limit of eight attempts per five-minute client window. Successful login clears the client window. This is a baseline preview safeguard; a production deployment should use a shared rate limiter at the edge or in a persistent session/security service.

New registrations may store the selected language as non-sensitive product metadata. The public registration flow still creates USER accounts only.
