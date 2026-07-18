import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Lets the dev server accept requests from the phone's LAN address
  // (e.g. http://192.168.1.181:3000) when previewing local changes on a
  // real device — Next.js otherwise only trusts requests whose Origin is
  // localhost, silently blocking JS/HMR assets from any other host and
  // leaving the page visually loaded but fully unresponsive (no hydration).
  allowedDevOrigins: ["192.168.1.181"],
};

export default nextConfig;
