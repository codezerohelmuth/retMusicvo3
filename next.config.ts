import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'inv.riverside.rocks',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'invidious.snopyta.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'yewtu.be',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'invidious.kavin.rocks',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vid.puffyan.us',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'invidious.osi.kr',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'inv.bp.projectsegfau.lt',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
