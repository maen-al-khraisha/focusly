/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: { unoptimized: true },
    // Performance optimizations
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    },
    // Enable compression
    compress: true,
    // Optimize bundle size
    swcMinify: true,
    // Reduce JavaScript bundle size
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    // Optimize webpack configuration
    webpack: (config, { dev, isServer }) => {
        // Optimize for production
        if (!dev && !isServer) {
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                },
            };
        }
        return config;
    },
    async redirects() {
        return [
            {
                source: "/dashboard",
                destination: "/dashboard/tasks",
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
