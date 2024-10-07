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
  // Add this line to explicitly allow serving files from public directory
  publicRuntimeConfig: {
    staticFolder: '/public',
  },
}

export default nextConfig
