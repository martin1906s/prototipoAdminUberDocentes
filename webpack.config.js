const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Deshabilitar static rendering
  config.experiments = {
    ...config.experiments,
    topLevelAwait: false,
  };
  
  // Configuración para resolver la advertencia de iframe
  if (config.mode === 'development') {
    config.devServer = {
      ...config.devServer,
      headers: {
        'Content-Security-Policy': "frame-ancestors 'self'",
      },
    };
  }
  
  return config;
};
