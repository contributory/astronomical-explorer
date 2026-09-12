/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  allowedDevOrigins: process.env.BASE44_PUBLIC_HOST_SUFFIX
    ? ["3000-" + process.env.BASE44_PUBLIC_HOST_SUFFIX]
    : [],
};
export default nextConfig;
