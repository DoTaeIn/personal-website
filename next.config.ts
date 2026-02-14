/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'your-project.supabase.co',
            },
        ],
    },
};

module.exports = nextConfig;