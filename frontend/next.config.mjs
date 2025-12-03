// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: { ignoreDuringBuilds: true },
//   typescript: { ignoreBuildErrors: true },
//   reactStrictMode: true,
//   webpack: (config, { dev }) => {
//     if (dev) {
//       // 🔕 Desactiva el overlay rojo (error/issue en pantalla)
//       config.infrastructureLogging = { level: 'error' };
//     }
//     return config;
//   },
//   // 🔕 Desactiva el overlay de Next.js en el navegador
//   onDemandEntries: {
//     // Evita mostrar el “1 issue” del overlay en modo dev
//     overlay: false,
//   },
//   images: {
//     domains: ["cdn-icons-png.flaticon.com"],
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
    ],
  },

  // quita todo lo que rompa el config
};

export default nextConfig;
