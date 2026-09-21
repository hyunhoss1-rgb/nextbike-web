/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
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
