/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evita corrupción de caché cuando hay EMFILE o varios dev servers
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
