const withPWA = require('next-pwa')({
  disable: false, // Habilitar PWA en todos los entornos
  dest: 'public',
});

module.exports = withPWA({
  // otras configuraciones de Next.js
});
