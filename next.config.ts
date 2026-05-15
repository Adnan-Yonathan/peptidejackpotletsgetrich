import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.peptidepros.io" }],
        destination: "https://peptidepros.io/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
