import type { NextConfig } from "next";
const nextBuildId = require('next-build-id')

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config, {webpack, buildId}) {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.CONFIG_BUILD_ID': JSON.stringify(buildId)
      })
    );

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  generateBuildId: async () => {
    try {
      const buildId = await nextBuildId({ dir: __dirname });
      return buildId;
    } catch (e) {
      // Provide a fallback build ID when git info is not available
      console.warn("Could not generate build ID from git, using fallback.");
      return `build-${Date.now()}`;
    }
  }
};

export default nextConfig;
