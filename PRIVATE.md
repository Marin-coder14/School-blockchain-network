# Private Application Notice

This is a **private application**. Unauthorized copying, distribution, or modification is prohibited.

## Sensitive Files

This repository contains or generates the following sensitive files (which are git-ignored):

- `certs/cert.pfx` — Self-signed certificate
- `certs/cert.pem` — Certificate in PEM format
- `certs/key.pem` — Private key

**Do not commit these files.** They are automatically generated and ignored by `.gitignore`.

## Repository Privacy

- Keep this repository **private** on your Git hosting service.
- Do not share access tokens, credentials, or URLs publicly.
- Review `.gitignore` regularly to ensure sensitive files remain excluded.

## Security Best Practices

1. **Never** commit certificates, keys, or passwords.
2. **Regenerate** certificates if they are ever exposed.
3. **Keep** the repository access restricted to trusted users only.
4. **Use** environment variables or secret management systems for production secrets.

---

**Owner:** Private  
**Last Updated:** November 17, 2025
