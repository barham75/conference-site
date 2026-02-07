import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/vote",
        destination: "/poster-vote",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
