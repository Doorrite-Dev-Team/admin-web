import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    // ADDED 'unsafe-inline' to script-src to allow inline scripts (fixing the reported CSP violation)
    value:
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://doorrite-api.onrender.com; connect-src 'self' https://doorrite-api.onrender.com;",
  },
  // You can optionally add other security headers here
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
