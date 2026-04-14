const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

module.exports = mergeConfig(getSentryExpoConfig(__dirname), {});
