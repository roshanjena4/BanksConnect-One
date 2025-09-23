declare module 'next-pwa' {
  import { Plugin } from 'next/dist/server/config-shared';
  type NextPwaOptions = Record<string, any>;
  function nextPWA(options?: NextPwaOptions): (nextConfig?: any) => any;
  export default nextPWA;
}
