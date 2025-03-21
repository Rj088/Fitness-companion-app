import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.fitnesscompanion',
  appName: 'Fitness Companion',
  webDir: 'dist/public',

  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'api.yourcompany.com', // Your production API server
    cleartext: false // Set to false for production
  },
  ios: {
    scheme: 'FitnessCompanion',
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
