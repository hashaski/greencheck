/** @type {import('next').NextConfig} */
const nextConfig = {
        images : {
            localPatterns: [
                {
                    pathname: '/public/**',
                    search: '',
                }
            ]
        }
};

export default nextConfig;
