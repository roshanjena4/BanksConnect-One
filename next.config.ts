// import type { NextConfig } from "next";
// import withPWA from 'next-pwa';
// const nextConfig: NextConfig = {
//   reactStrictMode: true,      // Enable React strict mode for improved error handling
//     compiler: {
//         removeConsole: process.env.NODE_ENV !== "development"     // Remove console.log in production
//     }
// };

// export default withPWA({
//     dest: "public",         // destination directory for the PWA files
//     disable: false,        // disable PWA in the development environment
//     register: true,         // register the PWA service worker
//     skipWaiting: true,      // skip waiting for service worker activation
// })
// export default withPWA(nextConfig)


import type { NextConfig } from 'next'
import nextPWA from 'next-pwa'

const withPWA = nextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
}

export default withPWA(nextConfig)

