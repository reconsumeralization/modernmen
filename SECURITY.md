# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

1. **DO NOT** open a public issue
2. Email security concerns to: security@modernmen.ca
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Fix Timeline**: Depends on severity
  - Critical: Within 72 hours
  - High: Within 1 week
  - Medium: Within 2 weeks
  - Low: Next release

## Security Best Practices

### For Users
- Keep your admin password secure
- Use strong passwords
- Regularly update dependencies
- Use HTTPS in production
- Keep your JWT_SECRET private
- Regular backups

### For Developers
- Never commit sensitive data
- Validate all inputs
- Use parameterized queries
- Keep dependencies updated
- Follow OWASP guidelines
- Regular security audits

## Known Security Features

- JWT authentication
- Bcrypt password hashing
- Input validation
- SQL injection protection (Prisma)
- XSS protection
- CSRF protection
- Rate limiting ready

## Disclosure Policy

- Security issues will be disclosed after a fix is available
- Users will be notified via GitHub releases
- Critical issues will trigger immediate notifications

Thank you for helping keep Modern Men secure!