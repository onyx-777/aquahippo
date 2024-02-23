// next.config.js
const nextConfig = {
    images: {
      remotePatterns: [
        {
          hostname: ["localhost", "digitalhippo-production-58ed.up.railway.app"],
          pathname: '**',
          port: '3000', // Corrected to a string
          protocol: 'http'
        },
      ],
    },
  };
  
  module.exports = nextConfig;
  