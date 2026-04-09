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
  // Force HTTPS — 2 ans, incluant les sous-domaines
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  // Content-Security-Policy est géré dynamiquement dans middleware.ts (nonce par requête)
]

const nextConfig: NextConfig = {
  output: 'standalone',
  headers: async () => [{ source: '/(.*)', headers: secHeaders }],
  // Désactive le header X-Powered-By: Next.js
  poweredByHeader: false,
}

export default nextConfig
