import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_BASE_URL: "https://localhost:7241/api/v1/"
  },
  eslint: {
    // Chỉ chạy lint khi gọi `next lint`
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
