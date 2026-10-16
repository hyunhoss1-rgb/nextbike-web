/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-Robots-Tag',
            value: 'noai, noimageai',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'nextbike.kr',
          },
        ],
        destination: 'https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.nextbike.kr',
          },
        ],
        destination: 'https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr',
          },
        ],
        destination: 'https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
