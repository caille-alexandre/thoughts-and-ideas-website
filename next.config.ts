import type { NextConfig } from 'next'

const secHeaders = [
  // Interdit le chargement dans un iframe (clickjacking)
  { key: 'X-Frame-Options',           value: 'DENY' },
  // Désactive la détection MIME sniffing
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  // N'envoie que l'origine dans le Referrer
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  // Désactive les API sensibles du navigateur
  { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
  // Force HTTPS pour 1 an (activer une fois le SSL configuré)
  // { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  // Content Security Policy — ajuster si des ressources tierces sont ajoutées
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",   // Next.js nécessite unsafe-inline
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  output: 'standalone',
  headers: async () => [{ source: '/(.*)', headers: secHeaders }],
  // Désactive le header X-Powered-By: Next.js
  poweredByHeader: false,
}

export default nextConfig
