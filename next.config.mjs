// next.config.mjs — VideoNova Studio
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Autoriser les images externes
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Pour FFmpeg (module natif)
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("fluent-ffmpeg");
    }
    return config;
  },
  // Limites upload (500 MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
};

export default nextConfig;
