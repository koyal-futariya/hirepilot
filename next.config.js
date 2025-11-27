/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['hnvsqgux6vu15kdz.public.blob.vercel-storage.com'],
  },
  webpack: (config) => {
    return config;
  },
  // This makes sure your path aliases in tsconfig.json work in Next.js
  // No need to manually configure webpack aliases as they're automatically handled by Next.js
};

module.exports = nextConfig;
