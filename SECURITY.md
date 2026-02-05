# Security Checklist

## ✅ Already Implemented

- **SQL Injection Protection**: Using PostgreSQL tagged templates (parameterized queries)
- **IP Privacy**: IP addresses are hashed, not stored raw
- **Cookie Consent**: GDPR-compliant consent banner
- **No PII Storage**: Only email addresses (opt-in for newsletter)
- **Environment Variables**: Credentials stored in `.env` (not committed)

## 🔒 Production Security Checklist

### Database Security

- [ ] **Change default password** in production `.env`:
  ```bash
  # Generate strong password
  openssl rand -base64 32
  ```
- [ ] **Restrict PostgreSQL access** to specific IPs in `pg_hba.conf`:
  ```
  # Replace 0.0.0.0/0 with your server's IP
  host    fluxwebsite    fluxuser    YOUR_SERVER_IP/32    md5
  ```
- [ ] **Use SSL for database connections**:
  ```bash
  DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
  ```

### API Security

- [ ] **Add rate limiting** to prevent abuse:
  ```bash
  npm install express-rate-limit
  ```
- [ ] **Enable CORS restrictions** (only allow your domain)
- [ ] **Add request validation** with schema validation
- [ ] **Implement API authentication** for admin endpoints

### Server Security

- [ ] **Enable firewall** on VPS:
  ```bash
  sudo ufw enable
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw allow 22/tcp
  sudo ufw allow from YOUR_IP to any port 5432
  ```
- [ ] **Use HTTPS only** (Let's Encrypt):
  ```bash
  sudo certbot --nginx -d your-domain.com
  ```
- [ ] **Keep PostgreSQL port 5432 closed** to public (only allow from app server)
- [ ] **Regular security updates**:
  ```bash
  sudo apt update && sudo apt upgrade
  ```

### Application Security

- [ ] **Set secure headers** in production
- [ ] **Enable CSP (Content Security Policy)**
- [ ] **Use environment-specific configs**
- [ ] **Disable debug mode** in production
- [ ] **Implement logging** for security events

### Deployment Security

- [ ] **Never commit `.env` files** (already in `.gitignore`)
- [ ] **Use deployment secrets** in CI/CD (GitHub Actions, Vercel, etc.)
- [ ] **Rotate database passwords** quarterly
- [ ] **Enable 2FA** on all admin accounts
- [ ] **Monitor failed login attempts**

## Environment Variable Setup

### Development (`.env`)
```env
DATABASE_URL=postgresql://fluxuser:dev_password@localhost:5432/fluxwebsite
```

### Production (VPS `.env`)
```env
DATABASE_URL=postgresql://fluxuser:STRONG_RANDOM_PASSWORD@localhost:5432/fluxwebsite
NODE_ENV=production
```

**IMPORTANT**: Never upload `.env` to Git. Only commit `.env.example` with placeholder values!

## Quick Security Audit Commands

### Check open ports
```bash
sudo ss -tulpn
```

### Check PostgreSQL connections
```bash
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
```

### Review database permissions
```bash
sudo -u postgres psql -d fluxwebsite -c "\dp"
```

### Check for suspicious queries
```bash
sudo tail -f /var/log/postgresql/postgresql-*.log
```

## Emergency Response

If database is compromised:
1. Immediately change database password
2. Rotate API keys
3. Review access logs
4. Backup and restore to clean snapshot
5. Notify users if PII was exposed
