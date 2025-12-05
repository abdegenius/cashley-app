/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["sandbox.vtpass.com", "vtpass.com", "res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sandbox.vtpass.com",
        pathname: "/resources/products/**",
      },
      {
        protocol: "https",
        hostname: "vtpass.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
