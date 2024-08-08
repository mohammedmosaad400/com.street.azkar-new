import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.street.azkar',
  appName_ar: 'روبوت متكلم',
  appName_en: 'Imaginary Friend',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: '#ffffffff',
      launchAutoHide: true,
      androidSplashResourceName: 'launch_splash',
      SplashScreenDelay: false
    },
  },
  cordova: {
    preferences: {
      "LottieFullScreen": "true",
      "LottieHideAfterAnimationEnd": "true",
      "LottieAnimationLocation": "public/assets/splash.json",
    }
  }
};

export default config;