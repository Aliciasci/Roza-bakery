import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  // Identifiant de version : après un déploiement, une navigation recharge la page
  // au lieu de mélanger ancienne et nouvelle version (Railway fournit le SHA du commit).
  deploymentId: process.env.RAILWAY_GIT_COMMIT_SHA?.slice(0, 12) || undefined,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
