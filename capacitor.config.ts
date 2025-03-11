import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.replit.fitness',
  appName: 'FitnessApp',
  webDir: 'dist/public',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'app.replit.fitness',
    cleartext: true
  },
  ios: {
    scheme: 'FitnessApp',
    contentInset: 'always',
    backgroundColor: '#ffffff',
    preferredContentMode: 'mobile',
    allowsLinkPreview: false,
    limitsNavigationsToAppBoundDomains: true,
    scrollEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      showSpinner: false,
      androidSpinnerStyle: "large",
      splashFullScreen: true,
      splashImmersive: true
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF"
    },
    Camera: {
      presentationStyle: 'fullscreen'
    },
    Geolocation: {
      // iOS config only
      permissions: {
        ios: [
          // Request precise location permission on iOS
          'location',
          'location-always'
        ]
      }
    }
  }
};

export default config;
