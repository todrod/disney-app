/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for mobile
  compress: true,
  // Enable React strict mode for better development
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['www.thegoofytrooper.com', 'thegoofytrooper.com'],
    },
  },
  // Images optimization
  images: {
    formats: ['image/webp'],
  },
};

module.exports = nextConfig;
