const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Deshabilitar static rendering para evitar problemas con expo-router
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
