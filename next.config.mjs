/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 启用静态 HTML 导出
  images: {
    unoptimized: true, // 静态站需关闭默认图片优化服务
  },
};

export default nextConfig;
