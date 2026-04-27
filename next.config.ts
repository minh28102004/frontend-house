import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // eslint: { ignoreDuringBuilds: true }, // Temporarily disabled — re-enable once lint issues are resolved
  // typescript: { ignoreBuildErrors: true }, // Temporarily disabled — re-enable once TS issues are resolved
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.4',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.19',
      },
      {
        protocol: 'https',
        hostname: 'anotherhouse.vn',
      },
      {
        protocol: 'https',
        hostname: 'cdn.anotherhouse.vn',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },

    ],
    // Giữ domains cho tương thích ngược
    domains: ['localhost', '127.0.0.1', 'anotherhouse.vn', 'cdn.anotherhouse.vn'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
const serverUrl = process.env.NEXT_PUBLIC_API_URL;

if (!serverUrl?.startsWith("http")) {
  throw new Error("NEXT_PUBLIC_API_URL must start with http:// or https://");
}

// Add rewrites dynamically
nextConfig.rewrites = async () => {
  return [
    {
      source: "/api/:path*",
      destination: `${serverUrl}/api/:path*`,
    },
    {
      source: "/uploads/:path*",
      destination: `${serverUrl}/uploads/:path*`,
    },
    {
      source: "/imageapi/:path*",
      destination: `${serverUrl}/imageapi/:path*`,
    },
  ];
};
export default nextConfig;
