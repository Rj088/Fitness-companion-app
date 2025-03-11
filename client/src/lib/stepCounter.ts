import { Motion, AccelListenerEvent } from '@capacitor/motion';
import { isNativePlatform } from './native';

interface StepCounterOptions {
  onStep?: (count: number) => void;
  onError?: (error: any) => void;
  sensitivity?: number; // Higher value = less sensitive
  debounceTime?: number; // Time in ms to wait between steps
}

// Define the correct type for acceleration data
interface AccelerationData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export class StepCounter {
  private isRunning: boolean = false;
  private stepCount: number = 0;
  private lastAcceleration: AccelerationData = { x: 0, y: 0, z: 0, timestamp: 0 };
  private lastStepTime: number = 0;
  private sensitivity: number;
  private debounceTime: number;
  private isNative: boolean = false;
  
  // Make these public so they can be set from getStepCounter
  public onStep?: (count: number) => void;
  public onError?: (error: any) => void;

  constructor(options: StepCounterOptions = {}) {
    this.onStep = options.onStep;
    this.onError = options.onError;
    this.sensitivity = options.sensitivity || 1.2; // Default sensitivity threshold
    this.debounceTime = options.debounceTime || 500; // Default 500ms debounce
    
    // Check if running on native platform
    isNativePlatform().then(isNative => {
      this.isNative = isNative;
    }).catch(error => {
      console.error('Error checking platform:', error);
      this.isNative = false;
    });
  }

  /**
   * Start the step counter
   */
  async start(): Promise<boolean> {
    if (this.isRunning) return true;
    
    try {
      if (!this.isNative) {
        console.warn('Step counter only works on native iOS/Android platforms');
        if (this.onError) this.onError(new Error('Step counter requires a native platform'));
        return false;
      }
      
      await Motion.addListener('accel', this.handleAcceleration);
      this.isRunning = true;
      return true;
    } catch (error) {
      console.error('Error starting step counter:', error);
      if (this.onError) this.onError(error);
      return false;
    }
  }

  /**
   * Stop the step counter
   */
  async stop(): Promise<void> {
    if (!this.isRunning) return;
    
    try {
      await Motion.removeAllListeners();
      this.isRunning = false;
    } catch (error) {
      console.error('Error stopping step counter:', error);
      if (this.onError) this.onError(error);
    }
  }

  /**
   * Reset the step count to zero
   */
  reset(): void {
    this.stepCount = 0;
    if (this.onStep) this.onStep(this.stepCount);
  }

  /**
   * Get the current step count
   */
  getStepCount(): number {
    return this.stepCount;
  }

  /**
   * Handle acceleration data from the device
   */
  private handleAcceleration = (event: AccelListenerEvent): void => {
    // Extract acceleration data from event
    // The AccelListenerEvent from @capacitor/motion includes acceleration property
    const accelData = (event as any).acceleration || { x: 0, y: 0, z: 0 };
    const x = accelData.x || 0;
    const y = accelData.y || 0;
    const z = accelData.z || 0;
    const now = Date.now();
    
    // Calculate acceleration magnitude
    const acceleration = Math.sqrt(x * x + y * y + z * z);
    const delta = Math.abs(acceleration - Math.sqrt(
      this.lastAcceleration.x * this.lastAcceleration.x +
      this.lastAcceleration.y * this.lastAcceleration.y +
      this.lastAcceleration.z * this.lastAcceleration.z
    ));
    
    // Update last acceleration
    this.lastAcceleration = { x, y, z, timestamp: now };
    
    // Check if this is a step (significant change in acceleration)
    if (delta > this.sensitivity && now - this.lastStepTime > this.debounceTime) {
      this.stepCount++;
      this.lastStepTime = now;
      
      if (this.onStep) {
        this.onStep(this.stepCount);
      }
    }
  };
}

// Singleton instance for app-wide step counting
let globalStepCounter: StepCounter | null = null;

/**
 * Get the global step counter instance
 */
export function getStepCounter(options?: StepCounterOptions): StepCounter {
  if (!globalStepCounter) {
    globalStepCounter = new StepCounter(options);
  } else if (options) {
    // Update options if provided
    if (options.onStep) globalStepCounter.onStep = options.onStep;
    if (options.onError) globalStepCounter.onError = options.onError;
  }
  
  return globalStepCounter;
}