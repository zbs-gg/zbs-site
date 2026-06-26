/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // R3F + StrictMode double-mounts WebGL contexts; off for perf
  async rewrites() {
    // /lab serves the standalone Memory & Context Lab landing (public/lab.html)
    return [{ source: "/lab", destination: "/lab.html" }];
  },
};

export default nextConfig;
