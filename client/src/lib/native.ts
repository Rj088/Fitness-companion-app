import { App } from '@capacitor/app';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Device } from '@capacitor/device';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Motion, AccelListenerEvent } from '@capacitor/motion';
import { LocalNotifications, ScheduleOptions, Schedule, ScheduleEvery } from '@capacitor/local-notifications';

/**
 * Device capability information
 */
export interface DeviceCapabilities {
  isNative: boolean;
  platform: string;
  hasCamera: boolean;
  hasGeolocation: boolean;
  hasMotionSensors: boolean;
  hasNotifications: boolean;
  hasFitnessTracking: boolean;
  model: string;
  osVersion: string;
}

/**
 * Check if the app is running on a native platform (iOS or Android)
 */
export async function isNativePlatform(): Promise<boolean> {
  const info = await Device.getInfo();
  return info.platform !== 'web';
}

/**
 * Get device capabilities for fitness tracking
 */
export async function getDeviceCapabilities(): Promise<DeviceCapabilities> {
  try {
    const info = await Device.getInfo();
    const isNative = info.platform !== 'web';
    
    // Default capabilities 
    const capabilities: DeviceCapabilities = {
      isNative,
      platform: info.platform,
      hasCamera: isNative,
      hasGeolocation: isNative,
      hasMotionSensors: isNative,
      hasNotifications: isNative,
      hasFitnessTracking: false, // Will be determined below
      model: info.model,
      osVersion: info.operatingSystem + ' ' + info.osVersion
    };
    
    // Check if device supports fitness tracking based on device model
    // This is a simple heuristic, as there's no direct API to check for fitness capabilities
    if (isNative) {
      // iOS devices that support fitness tracking (iPhone 5s and newer, most iPads)
      if (info.platform === 'ios') {
        // Check for newer iOS devices that have motion coprocessors
        const model = info.model.toLowerCase();
        if (model.includes('iphone') || model.includes('ipad')) {
          // Get the version number from model string
          const modelNumber = parseInt(model.replace(/[^0-9]/g, '')) || 0;
          capabilities.hasFitnessTracking = modelNumber >= 5; // iPhone 5s and newer
        }
      } 
      // Most modern Android devices support basic fitness tracking
      else if (info.platform === 'android') {
        capabilities.hasFitnessTracking = true;
      }
    }
    
    return capabilities;
  } catch (error) {
    console.error('Error getting device capabilities:', error);
    return {
      isNative: false,
      platform: 'unknown',
      hasCamera: false,
      hasGeolocation: false,
      hasMotionSensors: false,
      hasNotifications: false,
      hasFitnessTracking: false,
      model: 'unknown',
      osVersion: 'unknown'
    };
  }
}

/**
 * Take a photo using the device camera
 */
export async function takePhoto(): Promise<string | null> {
  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });
    
    return photo.base64String || null;
  } catch (error) {
    console.error('Error taking photo:', error);
    return null;
  }
}

/**
 * Get the current device location
 */
export async function getCurrentLocation(): Promise<Position | null> {
  try {
    return await Geolocation.getCurrentPosition();
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
}

/**
 * Trigger haptic feedback
 */
export async function triggerHapticFeedback(): Promise<void> {
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch (error) {
    console.error('Error triggering haptic feedback:', error);
  }
}

/**
 * Get device motion data (acceleration, etc.)
 */
export async function startMotionTracking(callback: (event: AccelListenerEvent) => void): Promise<void> {
  try {
    await Motion.addListener('accel', callback);
  } catch (error) {
    console.error('Error starting motion tracking:', error);
  }
}

/**
 * Stop motion tracking
 */
export async function stopMotionTracking(): Promise<void> {
  try {
    await Motion.removeAllListeners();
  } catch (error) {
    console.error('Error stopping motion tracking:', error);
  }
}

/**
 * Schedule a local notification
 */
export async function scheduleNotification(options: {
  title: string;
  body: string;
  id?: number;
  schedule?: { at: Date } | { every: ScheduleEvery };
}): Promise<void> {
  try {
    const notificationOptions: ScheduleOptions = {
      notifications: [
        {
          title: options.title,
          body: options.body,
          id: options.id || Math.floor(Math.random() * 10000),
          schedule: options.schedule as Schedule,
          sound: 'default',
          attachments: [],
          actionTypeId: '',
          extra: null
        }
      ]
    };
    
    await LocalNotifications.schedule(notificationOptions);
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
}

/**
 * Schedule a workout reminder notification
 */
export async function scheduleWorkoutReminder(workoutName: string, scheduledTime: Date): Promise<void> {
  await scheduleNotification({
    title: "Workout Reminder",
    body: `Time for your ${workoutName} workout!`,
    schedule: { at: scheduledTime }
  });
}

/**
 * Register app lifecycle event listeners
 */
export function registerAppEventListeners(): void {
  App.addListener('appStateChange', ({ isActive }) => {
    console.log('App state changed. Is active?', isActive);
  });
  
  App.addListener('backButton', () => {
    console.log('Back button pressed');
  });
}

/**
 * Initialize all native capabilities
 */
export async function initializeNativeCapabilities(): Promise<void> {
  try {
    // Don't automatically request permissions on startup
    // Only register app event listeners
    registerAppEventListeners();
    
    console.log('Native capabilities initialized without requesting permissions');
  } catch (error) {
    console.error('Error initializing native capabilities:', error);
  }
}