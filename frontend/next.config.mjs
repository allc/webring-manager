/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  trailingSlash: true,
};

export default nextConfig;
