import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
    optimizeCss: true,
  },
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
    },
    "date-fns": {
      transform: "date-fns/{{member}}",
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  compress: true,
};

export default nextConfig;
