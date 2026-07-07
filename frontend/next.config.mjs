/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
   reactStrictMode: false,
     images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
    ],
  },
};

export default nextConfig;
