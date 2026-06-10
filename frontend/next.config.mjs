/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This allows your frontend to pull data from your FastAPI port cleanly
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
