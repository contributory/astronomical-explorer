/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  // cgroup is 2GB — keep build light
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
};
export default nextConfig;
