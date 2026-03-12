/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  swcMinify: true,
  eslint: {
    // Next would run eslint during build; skip to speed up CI (lint in a separate step)
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  httpAgentOptions: {
    keepAlive: true,
  },
  experimental: {
    // Turbopack for faster builds; falls back to webpack if unsupported in env
    turbo: {
      resolveAlias: {
        "@/*": "./*",
      },
      rules: {
        // Use swc minifier for JS/TS
        "*.js": ["swc"],
        "*.ts": ["swc"],
        "*.tsx": ["swc"],
      },
    },
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "react-icons",
      "date-fns",
      "firebase",
    ],
  },
  webpack: (config, { dev, isServer }) => {
    // Disable source maps in production to shrink build size and speed up emit
    if (!dev) {
      config.devtool = false
    }
    // Keep output lean by tree-shaking momentjs locales if ever bundled indirectly
    config.ignoreWarnings = [{ module: /node_modules\/moment\/locale/ }]
    return config
  },
  async headers() {
    const securityHeaders = [
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "accelerometer=(), camera=(), geolocation=(), microphone=(), payment=(), usb=()",
      },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self';",
          "img-src 'self' https: data: blob:;",
          "media-src 'self' https: data:;",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://*.clerk.accounts.dev https://*.clerk.com https://clerk.drayko.xyz;",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
          "font-src 'self' https://fonts.gstatic.com data:;",
          "connect-src 'self' https: wss:;",
          "frame-src 'self' https://challenges.cloudflare.com https://*.clerk.com https://*.clerk.accounts.dev https://clerk.drayko.xyz;",
        ].join(" "),
      },
    ]

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ]
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'www.svgrepo.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'help.ovhcloud.com',
      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
}

export default nextConfig
