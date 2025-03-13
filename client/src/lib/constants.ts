// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/login',
    REGISTER: '/api/register'
  },
  USERS: {
    GET: (id: number) => `/api/users/${id}`,
    UPDATE: (id: number) => `/api/users/${id}`
  },
  WORKOUTS: {
    LIST: '/api/workouts',
    GET: (id: number) => `/api/workouts/${id}`,
    USER: (userId: number) => `/api/users/${userId}/workouts`,
    COMPLETE: (id: number) => `/api/users/workouts/${id}/complete`
  },
  FOODS: {
    LIST: '/api/foods',
    GET: (id: number) => `/api/foods/${id}`,
    SEARCH: (query: string) => `/api/foods?search=${query}`
  },
  MEALS: {
    LIST: (userId: number) => `/api/users/${userId}/meals`,
    CREATE: (userId: number) => `/api/users/${userId}/meals`,
    DELETE: (id: number) => `/api/users/meals/${id}`
  },
  ACTIVITIES: {
    LIST: (userId: number) => `/api/users/${userId}/activities`,
    GET: (userId: number, date: string) => 
      `/api/users/${userId}/activities?date=${date}`,
    CREATE: (userId: number) => `/api/users/${userId}/activities`,
    UPDATE: (id: number) => `/api/users/activities/${id}`
  },
  WEIGHT: {
    LIST: (userId: number) => `/api/users/${userId}/weight-logs`,
    CREATE: (userId: number) => `/api/users/${userId}/weight-logs`
  }
};

// Local storage keys
export const STORAGE_KEYS = {
  USER_ID: 'fittrack_user_id',
  AUTH_TOKEN: 'fittrack_auth_token'
};

// Default values
export const DEFAULTS = {
  DAILY_STEPS_GOAL: 8000,
  DAILY_CALORIE_GOAL: 2000,
  WORKOUT_FREQUENCY: 3,
  MACRO_GOALS: {
    PROTEIN: 120, // grams
    CARBS: 200, // grams
    FAT: 65 // grams
  }
};

// Common food icons mapping
export const FOOD_ICONS = {
  // Breakfast items
  oatmeal: { icon: 'fas fa-bread-slice', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  cereal: { icon: 'fas fa-bread-slice', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  toast: { icon: 'fas fa-bread-slice', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  eggs: { icon: 'fas fa-egg', color: 'text-yellow-400', bg: 'bg-yellow-100' },
  coffee: { icon: 'fas fa-mug-hot', color: 'text-yellow-900', bg: 'bg-yellow-100' },
  
  // Fruits and vegetables
  fruit: { icon: 'fas fa-apple-alt', color: 'text-red-500', bg: 'bg-red-100' },
  apple: { icon: 'fas fa-apple-alt', color: 'text-red-500', bg: 'bg-red-100' },
  banana: { icon: 'fas fa-apple-alt', color: 'text-yellow-400', bg: 'bg-yellow-100' },
  salad: { icon: 'fas fa-leaf', color: 'text-green-500', bg: 'bg-green-100' },
  vegetables: { icon: 'fas fa-leaf', color: 'text-green-500', bg: 'bg-green-100' },
  
  // Proteins
  chicken: { icon: 'fas fa-drumstick-bite', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  meat: { icon: 'fas fa-drumstick-bite', color: 'text-red-700', bg: 'bg-red-100' },
  fish: { icon: 'fas fa-fish', color: 'text-blue-400', bg: 'bg-blue-100' },
  
  // Dairy
  yogurt: { icon: 'fas fa-cheese', color: 'text-yellow-400', bg: 'bg-yellow-100' },
  cheese: { icon: 'fas fa-cheese', color: 'text-yellow-400', bg: 'bg-yellow-100' },
  milk: { icon: 'fas fa-glass-whiskey', color: 'text-white', bg: 'bg-gray-100' },
  
  // Others
  nuts: { icon: 'fas fa-seedling', color: 'text-green-800', bg: 'bg-green-100' },
  oil: { icon: 'fas fa-wine-bottle', color: 'text-green-700', bg: 'bg-green-100' },
  bread: { icon: 'fas fa-bread-slice', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  
  // Default
  default: { icon: 'fas fa-utensils', color: 'text-gray-600', bg: 'bg-gray-100' }
};

// Workout categories with colors and icons
export const WORKOUT_CATEGORIES = {
  strength: { 
    icon: 'fas fa-dumbbell', 
    color: 'text-primary', 
    bg: 'bg-primary/10',
    label: 'Strength'
  },
  cardio: { 
    icon: 'fas fa-running', 
    color: 'text-secondary', 
    bg: 'bg-secondary/10',
    label: 'Cardio'
  },
  flexibility: { 
    icon: 'fas fa-child', 
    color: 'text-green-500', 
    bg: 'bg-green-100',
    label: 'Flexibility'
  },
  hiit: { 
    icon: 'fas fa-heartbeat', 
    color: 'text-accent', 
    bg: 'bg-accent/10',
    label: 'HIIT'
  },
  // New specialized categories
  chest: { 
    icon: 'fas fa-dumbbell', 
    color: 'text-blue-600', 
    bg: 'bg-blue-100',
    label: 'Chest'
  },
  back: { 
    icon: 'fas fa-dumbbell', 
    color: 'text-indigo-600', 
    bg: 'bg-indigo-100',
    label: 'Back'
  },
  biceps: { 
    icon: 'fas fa-dumbbell', 
    color: 'text-purple-600', 
    bg: 'bg-purple-100',
    label: 'Biceps'
  },
  crossfit: { 
    icon: 'fas fa-fire-alt', 
    color: 'text-red-600', 
    bg: 'bg-red-100',
    label: 'CrossFit'
  },
  ai: { 
    icon: 'fas fa-robot', 
    color: 'text-blue-500', 
    bg: 'bg-blue-100',
    label: 'AI Generated'
  }
};

// Meal types with icons and colors
export const MEAL_TYPES = {
  breakfast: { 
    icon: 'fas fa-coffee', 
    color: 'text-yellow-500', 
    bg: 'bg-yellow-100',
    label: 'Breakfast'
  },
  lunch: { 
    icon: 'fas fa-utensils', 
    color: 'text-green-500', 
    bg: 'bg-green-100',
    label: 'Lunch'
  },
  dinner: { 
    icon: 'fas fa-drumstick-bite', 
    color: 'text-red-500', 
    bg: 'bg-red-100',
    label: 'Dinner'
  },
  snack: { 
    icon: 'fas fa-apple-alt', 
    color: 'text-orange-500', 
    bg: 'bg-orange-100',
    label: 'Snack'
  }
};
