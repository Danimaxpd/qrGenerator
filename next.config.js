/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = './src';
    return config;
  }
}

module.exports = nextConfig 