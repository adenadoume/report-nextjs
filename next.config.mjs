/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.csv$/,
      loader: 'raw-loader',
    })
    return config
  },
}

export default nextConfig
