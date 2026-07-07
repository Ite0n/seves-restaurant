/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    qualities: [65, 72, 75, 78, 80, 85, 88],
  },
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "gsap",
      "lenis",
      "@react-three/drei",
    ],
  },
};

export default nextConfig;
