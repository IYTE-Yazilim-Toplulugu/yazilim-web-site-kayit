import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true
    },
    webpack(config) {
        config.ignoreWarnings = [
            {
                module: /node_modules\/@supabase\/realtime-js\/.*/,
                message: /Critical dependency: the request of a dependency is an expression/,
            },
        ];

        return config
    },
};

export default nextConfig;
