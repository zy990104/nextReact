import type {NextConfig} from "next";


const nextConfig: NextConfig = {
    /* config options here */
    async redirects() {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: false, // 非永久重定向
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: '/:path*', // 本地请求地址
                destination: 'https://chat.oldwei.com/api/:path*', // 目标接口地址
            },
        ];
    },
};

export default nextConfig;
