/** @type {import('next').NextConfig} */
const nextConfig = {
  // 設置圖片來源白名單
  images: {
    domains: ['localhost'],
  },
  // 允許上傳檔案
  async headers() {
    return [
      {
        source: '/api/upload',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
      },
    ]
  },
  // 配置 webpack 以支援 better-sqlite3
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }
    config.externals = [...config.externals, 'better-sqlite3']
    return config
  },
}

module.exports = nextConfig
