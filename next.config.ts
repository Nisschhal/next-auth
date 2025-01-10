import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "utfs.io" },
      {
        protocol: "http",
        hostname: "localhost:3000",
        port: "",
        pathname: "",
      },
    ],
  },
}

export default nextConfig
