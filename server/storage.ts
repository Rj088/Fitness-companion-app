import {
  users, User, InsertUser,
  workouts, Workout, InsertWorkout,
  userWorkouts, UserWorkout, InsertUserWorkout,
  foods, Food, InsertFood,
  userMeals, UserMeal, InsertUserMeal,
  activities, Activity, InsertActivity,
  weightLogs, WeightLog, InsertWeightLog,
  Exercise
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Workout operations
  getWorkout(id: number): Promise<Workout | undefined>;
  getWorkouts(): Promise<Workout[]>;
  getWorkoutsByCategory(category: string): Promise<Workout[]>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;

  // User workout operations
  getUserWorkouts(userId: number): Promise<UserWorkout[]>;
  getUserWorkoutsByDate(userId: number, date: Date): Promise<UserWorkout[]>;
  createUserWorkout(userWorkout: InsertUserWorkout): Promise<UserWorkout>;
  completeUserWorkout(id: number): Promise<UserWorkout | undefined>;

  // Food operations
  getFood(id: number): Promise<Food | undefined>;
  getFoods(): Promise<Food[]>;
  searchFoods(query: string): Promise<Food[]>;
  createFood(food: InsertFood): Promise<Food>;

  // User meal operations
  getUserMeals(userId: number): Promise<UserMeal[]>;
  getUserMealsByDate(userId: number, date: Date): Promise<UserMeal[]>;
  createUserMeal(userMeal: InsertUserMeal): Promise<UserMeal>;
  deleteUserMeal(id: number): Promise<boolean>;

  // Activity operations
  getUserActivities(userId: number): Promise<Activity[]>;
  getUserActivitiesByDate(userId: number, date: Date): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: number, activity: Partial<Activity>): Promise<Activity | undefined>;

  // Weight log operations
  getUserWeightLogs(userId: number): Promise<WeightLog[]>;
  createWeightLog(weightLog: InsertWeightLog): Promise<WeightLog>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workouts: Map<number, Workout>;
  private userWorkouts: Map<number, UserWorkout>;
  private foods: Map<number, Food>;
  private userMeals: Map<number, UserMeal>;
  private activities: Map<number, Activity>;
  private weightLogs: Map<number, WeightLog>;
  
  userCurrentId: number;
  workoutCurrentId: number;
  userWorkoutCurrentId: number;
  foodCurrentId: number;
  userMealCurrentId: number;
  activityCurrentId: number;
  weightLogCurrentId: number;

  constructor() {
    this.users = new Map();
    this.workouts = new Map();
    this.userWorkouts = new Map();
    this.foods = new Map();
    this.userMeals = new Map();
    this.activities = new Map();
    this.weightLogs = new Map();

    this.userCurrentId = 1;
    this.workoutCurrentId = 1;
    this.userWorkoutCurrentId = 1;
    this.foodCurrentId = 1;
    this.userMealCurrentId = 1;
    this.activityCurrentId = 1;
    this.weightLogCurrentId = 1;

    this.initializeWithSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) {
      return undefined;
    }
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Workout operations
  async getWorkout(id: number): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async getWorkouts(): Promise<Workout[]> {
    return Array.from(this.workouts.values());
  }

  async getWorkoutsByCategory(category: string): Promise<Workout[]> {
    return Array.from(this.workouts.values()).filter(
      (workout) => workout.category === category
    );
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const id = this.workoutCurrentId++;
    const workout: Workout = { ...insertWorkout, id };
    this.workouts.set(id, workout);
    return workout;
  }

  // User workout operations
  async getUserWorkouts(userId: number): Promise<UserWorkout[]> {
    return Array.from(this.userWorkouts.values()).filter(
      (userWorkout) => userWorkout.userId === userId
    );
  }

  async getUserWorkoutsByDate(userId: number, date: Date): Promise<UserWorkout[]> {
    return Array.from(this.userWorkouts.values()).filter(
      (userWorkout) => 
        userWorkout.userId === userId && 
        this.isSameDay(userWorkout.date, date)
    );
  }

  async createUserWorkout(insertUserWorkout: InsertUserWorkout): Promise<UserWorkout> {
    const id = this.userWorkoutCurrentId++;
    const userWorkout: UserWorkout = { ...insertUserWorkout, id };
    this.userWorkouts.set(id, userWorkout);
    return userWorkout;
  }

  async completeUserWorkout(id: number): Promise<UserWorkout | undefined> {
    const userWorkout = this.userWorkouts.get(id);
    
    if (!userWorkout) {
      return undefined;
    }
    
    const updatedUserWorkout: UserWorkout = {
      ...userWorkout,
      completed: true
    };
    
    this.userWorkouts.set(id, updatedUserWorkout);
    return updatedUserWorkout;
  }

  // Food operations
  async getFood(id: number): Promise<Food | undefined> {
    return this.foods.get(id);
  }

  async getFoods(): Promise<Food[]> {
    return Array.from(this.foods.values());
  }

  async searchFoods(query: string): Promise<Food[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.foods.values()).filter(
      (food) => food.name.toLowerCase().includes(lowerQuery)
    );
  }

  async createFood(insertFood: InsertFood): Promise<Food> {
    const id = this.foodCurrentId++;
    const food: Food = { ...insertFood, id };
    this.foods.set(id, food);
    return food;
  }

  // User meal operations
  async getUserMeals(userId: number): Promise<UserMeal[]> {
    return Array.from(this.userMeals.values()).filter(
      (userMeal) => userMeal.userId === userId
    );
  }

  async getUserMealsByDate(userId: number, date: Date): Promise<UserMeal[]> {
    return Array.from(this.userMeals.values()).filter(
      (userMeal) => 
        userMeal.userId === userId && 
        this.isSameDay(userMeal.date, date)
    );
  }

  async createUserMeal(insertUserMeal: InsertUserMeal): Promise<UserMeal> {
    const id = this.userMealCurrentId++;
    const userMeal: UserMeal = { ...insertUserMeal, id };
    this.userMeals.set(id, userMeal);
    return userMeal;
  }

  async deleteUserMeal(id: number): Promise<boolean> {
    return this.userMeals.delete(id);
  }

  // Activity operations
  async getUserActivities(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      (activity) => activity.userId === userId
    );
  }

  async getUserActivitiesByDate(userId: number, date: Date): Promise<Activity | undefined> {
    return Array.from(this.activities.values()).find(
      (activity) => 
        activity.userId === userId && 
        this.isSameDay(activity.date, date)
    );
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityCurrentId++;
    const activity: Activity = { ...insertActivity, id };
    this.activities.set(id, activity);
    return activity;
  }

  async updateActivity(id: number, activityData: Partial<Activity>): Promise<Activity | undefined> {
    const activity = this.activities.get(id);
    
    if (!activity) {
      return undefined;
    }
    
    const updatedActivity: Activity = {
      ...activity,
      ...activityData
    };
    
    this.activities.set(id, updatedActivity);
    return updatedActivity;
  }

  // Weight log operations
  async getUserWeightLogs(userId: number): Promise<WeightLog[]> {
    return Array.from(this.weightLogs.values())
      .filter((weightLog) => weightLog.userId === userId)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async createWeightLog(insertWeightLog: InsertWeightLog): Promise<WeightLog> {
    const id = this.weightLogCurrentId++;
    const weightLog: WeightLog = { ...insertWeightLog, id };
    this.weightLogs.set(id, weightLog);
    return weightLog;
  }

  // Helper methods
  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private initializeWithSampleData() {
    // Create sample user
    this.createUser({
      username: "sarah",
      password: "password123",
      firstName: "Sarah",
      lastName: "Johnson",
      height: 167.6, // 5'6" in cm
      weight: 67.13, // 148 lbs in kg
      goalWeight: 63.5, // 140 lbs in kg
      age: 25,
      fitnessLevel: "beginner",
      dailyCalorieGoal: 2000,
      dailyStepsGoal: 8000,
      workoutFrequency: 4
    });

    // Create sample workouts
    const upperBodyWorkout = this.createWorkout({
      name: "Upper Body Strength",
      description: "Build upper body strength with focused exercises",
      imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format",
      duration: 30,
      caloriesBurned: 245,
      difficulty: "beginner",
      category: "strength",
      exercises: [
        { id: 1, name: "Push-ups", sets: 3, reps: 10, description: "Standard push-ups" },
        { id: 2, name: "Dumbbell Rows", sets: 3, reps: 12, description: "Bent over rows with dumbbells" },
        { id: 3, name: "Shoulder Press", sets: 3, reps: 10, description: "Overhead press with dumbbells" }
      ]
    });

    const lowerBodyWorkout = this.createWorkout({
      name: "Lower Body Strength",
      description: "Focus on building lower body strength with squats, lunges, and deadlifts.",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format",
      duration: 35,
      caloriesBurned: 340,
      difficulty: "intermediate",
      category: "strength",
      exercises: [
        { id: 1, name: "Squats", sets: 3, reps: 15, description: "Standard squats" },
        { id: 2, name: "Lunges", sets: 3, reps: 10, description: "Forward lunges with each leg" },
        { id: 3, name: "Deadlifts", sets: 3, reps: 12, description: "Conventional deadlifts" }
      ]
    });

    const hiitWorkout = this.createWorkout({
      name: "HIIT Cardio Blast",
      description: "High-intensity interval training to maximize calorie burn and improve endurance.",
      imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format",
      duration: 25,
      caloriesBurned: 450,
      difficulty: "advanced",
      category: "hiit",
      exercises: [
        { id: 1, name: "Jumping Jacks", duration: 45, description: "High intensity jumping jacks" },
        { id: 2, name: "Burpees", duration: 45, description: "Full body burpees" },
        { id: 3, name: "Mountain Climbers", duration: 45, description: "Fast-paced mountain climbers" },
        { id: 4, name: "High Knees", duration: 45, description: "Running in place with high knees" }
      ]
    });

    const morningRun = this.createWorkout({
      name: "Morning Run",
      description: "Easy morning jog to kickstart your day",
      imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&auto=format",
      duration: 28,
      caloriesBurned: 230,
      difficulty: "beginner",
      category: "cardio",
      exercises: [
        { id: 1, name: "Jogging", duration: 1680, description: "Steady state jogging at moderate pace" }
      ]
    });

    // Create sample foods
    const oatmeal = this.createFood({
      name: "Oatmeal",
      calories: 150,
      protein: 5,
      carbs: 27,
      fat: 2.5,
      servingSize: "1 cup"
    });

    const banana = this.createFood({
      name: "Banana",
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      servingSize: "1 medium"
    });

    const coffee = this.createFood({
      name: "Black Coffee",
      calories: 5,
      protein: 0.3,
      carbs: 0,
      fat: 0,
      servingSize: "1 cup"
    });

    const chicken = this.createFood({
      name: "Grilled Chicken",
      calories: 180,
      protein: 35,
      carbs: 0,
      fat: 3.6,
      servingSize: "4 oz"
    });

    const salad = this.createFood({
      name: "Mixed Salad",
      calories: 50,
      protein: 2,
      carbs: 10,
      fat: 0,
      servingSize: "2 cups"
    });

    const oliveoil = this.createFood({
      name: "Olive Oil Dressing",
      calories: 120,
      protein: 0,
      carbs: 0,
      fat: 14,
      servingSize: "1 tbsp"
    });

    const bread = this.createFood({
      name: "Whole Grain Bread",
      calories: 80,
      protein: 4,
      carbs: 15,
      fat: 1,
      servingSize: "1 slice"
    });

    const yogurt = this.createFood({
      name: "Greek Yogurt",
      calories: 100,
      protein: 17,
      carbs: 6,
      fat: 0.4,
      servingSize: "6 oz"
    });

    const almonds = this.createFood({
      name: "Almonds",
      calories: 110,
      protein: 4,
      carbs: 3,
      fat: 9,
      servingSize: "1 oz"
    });

    // Add sample meals for Sarah
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Today's meals
    this.createUserMeal({
      userId: 1,
      date: new Date(today.setHours(7, 30, 0, 0)),
      mealType: "breakfast",
      foodId: oatmeal.id,
      servings: 1
    });

    this.createUserMeal({
      userId: 1,
      date: new Date(today.setHours(7, 30, 0, 0)),
      mealType: "breakfast",
      foodId: banana.id,
      servings: 1
    });

    this.createUserMeal({
      userId: 1,
      date: new Date(today.setHours(7, 30, 0, 0)),
      mealType: "breakfast",
      foodId: coffee.id,
      servings: 1
    });

    this.createUserMeal({
      userId: 1,
      date: new Date(today.setHours(12, 30, 0, 0)),
      mealType: "lunch",
      foodId: chicken.id,
      servings: 1
    });

    this.createUserMeal({
      userId: 1,
      date: new Date(today.setHours(12, 30, 0, 0)),
      mealType: "lunch",
      foodId: salad.id,
      servings: 1
    });

    this.createUserMeal({
      userId: 1,
      date: new Date(today.setHours(12, 30, 0, 0)),
      mealType: "lunch",
      foodId: oliveoil.id,
      servings: 1
    });

    this.createUserMeal({
      userId: 1,
      date: new Date(today.setHours(12, 30, 0, 0)),
      mealType: "lunch",
      foodId: bread.id,
      servings: 1
    });

    this.createUserMeal({
      userId: 1,
      date: new Date(today.setHours(15, 30, 0, 0)),
      mealType: "snack",
      foodId: yogurt.id,
      servings: 1
    });

    this.createUserMeal({
      userId: 1,
      date: new Date(today.setHours(15, 30, 0, 0)),
      mealType: "snack",
      foodId: almonds.id,
      servings: 1
    });

    // Create sample activities for Sarah
    this.createActivity({
      userId: 1,
      date: today,
      steps: 6237,
      caloriesBurned: 428,
      activeMinutes: 32
    });

    // Create sample user workouts
    // Today's workout (Upper Body)
    this.createUserWorkout({
      userId: 1,
      workoutId: upperBodyWorkout.id,
      date: today,
      duration: 30,
      caloriesBurned: 245,
      completed: true
    });

    // Yesterday's workout (Morning Run)
    this.createUserWorkout({
      userId: 1,
      workoutId: morningRun.id,
      date: yesterday,
      duration: 28,
      caloriesBurned: 230,
      completed: true
    });

    // Create sample weight logs
    const twoMonthsAgo = new Date(today);
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(twoMonthsAgo);
      date.setDate(date.getDate() + (i * 15)); // Every 15 days
      
      let weight;
      switch(i) {
        case 0: weight = 70.31; break; // 155 lbs
        case 1: weight = 69.40; break; // 153 lbs
        case 2: weight = 68.04; break; // 150 lbs
        case 3: weight = 67.13; break; // 148 lbs
        case 4: weight = 67.13; break; // 148 lbs (current)
      }
      
      this.createWeightLog({
        userId: 1,
        date,
        weight
      });
    }
  }
}

export const storage = new MemStorage();
