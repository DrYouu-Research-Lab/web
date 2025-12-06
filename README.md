# DrYouu.uk Website

Personal website hosted on GitHub Pages with Cloudflare DNS (and optional CDN/proxy features).

## Cloudflare Configuration

For the domain redirection to work correctly, ensure the following settings in Cloudflare:

### DNS Records

| Type  | Name | Content                       | Proxy Status |
|-------|------|-------------------------------|--------------|
| A     | @    | 185.199.108.153              | DNS only     |
| A     | @    | 185.199.109.153              | DNS only     |
| A     | @    | 185.199.110.153              | DNS only     |
| A     | @    | 185.199.111.153              | DNS only     |
| CNAME | www  | DrYouu-Research-Lab.github.io | DNS only     |

> **Important:** Set Proxy Status to "DNS only" (grey cloud) initially to allow GitHub Pages to issue SSL certificates. You can verify the certificate is issued by checking repository **Settings** → **Pages** for a green checkmark next to your custom domain, or by visiting your site and confirming HTTPS works. After successful verification, you can optionally switch to "Proxied" (orange cloud) to enable Cloudflare's CDN and security features.

### SSL/TLS Settings

1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to **Full** or **Full (Strict)**

> **Warning:** Do NOT use "Flexible" mode as it causes redirect loops.

### Redirects and Security Headers

To configure redirects (www → apex) and security headers, use the Cloudflare dashboard:

1. **Redirects**: Go to **Rules** → **Redirect Rules** (or **Bulk Redirects**) to set up:
   - `www.dryouu.uk/*` → `https://dryouu.uk/$1` (301 redirect)

2. **Security Headers**: Go to **Rules** → **Transform Rules** → **Modify Response Header** to add:
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`

> **Note:** These dashboard settings only apply when Proxy Status is set to "Proxied" (orange cloud). With "DNS only" mode, Cloudflare won't process traffic, so redirects must be handled by GitHub Pages (which doesn't support www→apex redirects) and HTTPS is enforced by GitHub Pages directly.

## GitHub Pages Settings

1. Go to repository **Settings** → **Pages**
2. Set custom domain to `dryouu.uk`
3. Enable **Enforce HTTPS** (after DNS propagation and SSL certificate issuance)

## Files

- `CNAME` - Custom domain configuration for GitHub Pages
- `index.html` - Main website content
