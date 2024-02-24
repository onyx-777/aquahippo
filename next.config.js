const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        pathname: '**',
        port: '3000', // Corrected to a string
        protocol: 'http'
      },
      {
        hostname: "digitalhippo-production-58ed.up.railway.app",
        pathname: '**',
        protocol: 'https'
      }
    ],
  },
};

module.exports = nextConfig;
