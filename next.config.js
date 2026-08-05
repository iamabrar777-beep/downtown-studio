/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' } // allow any https image host (Supabase Storage, product URLs, etc.)
    ]
  }
};

module.exports = nextConfig;
