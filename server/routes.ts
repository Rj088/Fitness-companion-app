import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertUserWorkoutSchema, 
  insertFoodSchema, 
  insertUserMealSchema, 
  insertActivitySchema, 
  insertWeightLogSchema 
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();

  // Error handler middleware for zod validation errors
  const validateRequest = (schema: any, body: any) => {
    try {
      return schema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        throw new Error(validationError.message);
      }
      throw error;
    }
  };

  // User routes
  router.get("/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  router.post("/users", async (req, res) => {
    try {
      const userData = validateRequest(insertUserSchema, req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  router.patch("/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUser(userId, req.body);
      
      // Don't return the password
      const { password, ...userWithoutPassword } = updatedUser!;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Workout routes
  router.get("/workouts", async (req, res) => {
    const category = req.query.category as string | undefined;
    let workouts;
    
    if (category) {
      workouts = await storage.getWorkoutsByCategory(category);
    } else {
      workouts = await storage.getWorkouts();
    }
    
    res.json(workouts);
  });

  router.get("/workouts/:id", async (req, res) => {
    const workoutId = parseInt(req.params.id);
    const workout = await storage.getWorkout(workoutId);
    
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    
    res.json(workout);
  });

  // User workout routes
  router.get("/users/:userId/workouts", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const dateParam = req.query.date as string | undefined;
    
    let userWorkouts;
    if (dateParam) {
      const date = new Date(dateParam);
      userWorkouts = await storage.getUserWorkoutsByDate(userId, date);
    } else {
      userWorkouts = await storage.getUserWorkouts(userId);
    }
    
    // Expand workout details
    const expandedWorkouts = await Promise.all(
      userWorkouts.map(async (userWorkout) => {
        const workout = await storage.getWorkout(userWorkout.workoutId);
        return {
          ...userWorkout,
          workout
        };
      })
    );
    
    res.json(expandedWorkouts);
  });

  router.post("/users/:userId/workouts", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const data = { ...req.body, userId };
      
      const userWorkoutData = validateRequest(insertUserWorkoutSchema, data);
      const userWorkout = await storage.createUserWorkout(userWorkoutData);
      
      // Include the workout details in the response
      const workout = await storage.getWorkout(userWorkout.workoutId);
      res.status(201).json({
        ...userWorkout,
        workout
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  router.patch("/users/workouts/:id/complete", async (req, res) => {
    const userWorkoutId = parseInt(req.params.id);
    const updatedUserWorkout = await storage.completeUserWorkout(userWorkoutId);
    
    if (!updatedUserWorkout) {
      return res.status(404).json({ message: "User workout not found" });
    }
    
    // Include the workout details in the response
    const workout = await storage.getWorkout(updatedUserWorkout.workoutId);
    res.json({
      ...updatedUserWorkout,
      workout
    });
  });

  // Food routes
  router.get("/foods", async (req, res) => {
    const search = req.query.search as string | undefined;
    
    let foods;
    if (search) {
      foods = await storage.searchFoods(search);
    } else {
      foods = await storage.getFoods();
    }
    
    res.json(foods);
  });

  router.get("/foods/:id", async (req, res) => {
    const foodId = parseInt(req.params.id);
    const food = await storage.getFood(foodId);
    
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    
    res.json(food);
  });

  router.post("/foods", async (req, res) => {
    try {
      const foodData = validateRequest(insertFoodSchema, req.body);
      const food = await storage.createFood(foodData);
      res.status(201).json(food);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User meal routes
  router.get("/users/:userId/meals", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const dateParam = req.query.date as string | undefined;
    
    let userMeals;
    if (dateParam) {
      const date = new Date(dateParam);
      userMeals = await storage.getUserMealsByDate(userId, date);
    } else {
      userMeals = await storage.getUserMeals(userId);
    }
    
    // Expand food details
    const expandedMeals = await Promise.all(
      userMeals.map(async (userMeal) => {
        const food = await storage.getFood(userMeal.foodId);
        return {
          ...userMeal,
          food
        };
      })
    );
    
    res.json(expandedMeals);
  });

  router.post("/users/:userId/meals", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const data = { ...req.body, userId };
      
      const userMealData = validateRequest(insertUserMealSchema, data);
      const userMeal = await storage.createUserMeal(userMealData);
      
      // Include the food details in the response
      const food = await storage.getFood(userMeal.foodId);
      res.status(201).json({
        ...userMeal,
        food
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  router.delete("/users/meals/:id", async (req, res) => {
    const userMealId = parseInt(req.params.id);
    const success = await storage.deleteUserMeal(userMealId);
    
    if (!success) {
      return res.status(404).json({ message: "User meal not found" });
    }
    
    res.status(204).send();
  });

  // Activity routes
  router.get("/users/:userId/activities", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const dateParam = req.query.date as string | undefined;
    
    if (dateParam) {
      const date = new Date(dateParam);
      const activity = await storage.getUserActivitiesByDate(userId, date);
      
      if (!activity) {
        // Return default empty activity if none exists for the date
        return res.json({
          userId,
          date,
          steps: 0,
          caloriesBurned: 0,
          activeMinutes: 0
        });
      }
      
      return res.json(activity);
    }
    
    const activities = await storage.getUserActivities(userId);
    res.json(activities);
  });

  router.post("/users/:userId/activities", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const data = { ...req.body, userId };
      
      const activityData = validateRequest(insertActivitySchema, data);
      
      // Check if an activity already exists for this date
      const date = new Date(activityData.date);
      const existingActivity = await storage.getUserActivitiesByDate(userId, date);
      
      let activity;
      if (existingActivity) {
        // Update existing activity
        activity = await storage.updateActivity(existingActivity.id, activityData);
      } else {
        // Create new activity
        activity = await storage.createActivity(activityData);
      }
      
      res.status(201).json(activity);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  router.patch("/users/activities/:id", async (req, res) => {
    try {
      const activityId = parseInt(req.params.id);
      const updatedActivity = await storage.updateActivity(activityId, req.body);
      
      if (!updatedActivity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      
      res.json(updatedActivity);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Weight log routes
  router.get("/users/:userId/weight-logs", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const weightLogs = await storage.getUserWeightLogs(userId);
    res.json(weightLogs);
  });

  router.post("/users/:userId/weight-logs", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const data = { ...req.body, userId };
      
      const weightLogData = validateRequest(insertWeightLogSchema, data);
      const weightLog = await storage.createWeightLog(weightLogData);
      
      // Update the user's current weight
      await storage.updateUser(userId, { weight: weightLogData.weight });
      
      res.status(201).json(weightLog);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Auth routes (simplified version for MVP)
  router.post("/auth/login", async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    const user = await storage.getUserByUsername(username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    // Don't return the password
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Mount the router to /api
  app.use("/api", router);

  const httpServer = createServer(app);
  return httpServer;
}
