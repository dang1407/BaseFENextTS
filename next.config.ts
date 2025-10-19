import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // NEXT_PUBLIC_API_BASE_URL: "http://192.168.0.83:7242/api/v1/",
    NEXT_PUBLIC_ACCESS_TOKEN_KEY: "access_token",
    NEXT_PUBLIC_REDIRECT_LOGIN_DELAY: "1"
  },
  eslint: {
    // Chỉ chạy lint khi gọi `next lint`
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
