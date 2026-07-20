/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wxjnrjakjwjhvsiwhelt.supabase.co',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
  compiler: {
    // Supprime tous les console.* (sauf error) des bundles de production
    removeConsole: { exclude: ['error'] },
  },
  experimental: {
    // Import à la carte des gros packages (icônes, charts, dates)
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
  },
};

module.exports = nextConfig;
