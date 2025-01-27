/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    transpilePackages: ['@reservoir0x/reservoir-kit-ui'],
  },
  api: {
    bodyParser: false,
  },
  async rewrites() {
    return [
      {
        source: '/discover',
        destination: `/collections/${process.env.NEXT_PUBLIC_COLLECTION}`,
      },
      {
        source: '/discover/:tokenId',
        destination: `/${process.env.NEXT_PUBLIC_COLLECTION}/:tokenId`
      }
    ]
  },
  async redirects() {
    return [
      {
        source: `/collections/${process.env.NEXT_PUBLIC_COLLECTION}`,
        destination: '/discover',
        permanent: true,
      },
      {
        source: `/${process.env.NEXT_PUBLIC_COLLECTION}/:tokenId`,
        destination: '/discover/:tokenId',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
