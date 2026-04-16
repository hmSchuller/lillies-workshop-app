// DX/helper wiring.
// Tells the React Native CLI autolinking system that this package exposes
// native implementations on both iOS and Android.
module.exports = {
  dependency: {
    platforms: {
      ios: {},
      android: {},
    },
  },
};
