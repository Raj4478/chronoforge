/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static-first: emit a fully static site into ./out (no server runtime needed).
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    // next/image optimization requires a server; static export uses unoptimized images.
    unoptimized: true,
  },
};

export default nextConfig;
