import { pgTable, text, serial, integer, boolean, timestamp, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  height: real("height"), // Height in cm
  weight: real("weight"), // Current weight in kg
  goalWeight: real("goal_weight"), // Target weight in kg
  age: integer("age"),
  fitnessLevel: text("fitness_level").default("beginner"), // beginner, intermediate, advanced
  dailyCalorieGoal: integer("daily_calorie_goal"),
  dailyStepsGoal: integer("daily_steps_goal").default(8000),
  workoutFrequency: integer("workout_frequency").default(3), // Workouts per week
  createdAt: timestamp("created_at").defaultNow(),
});

// Workout table
export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  duration: integer("duration").notNull(), // in minutes
  caloriesBurned: integer("calories_burned"),
  difficulty: text("difficulty").default("beginner"), // beginner, intermediate, advanced
  category: text("category").notNull(), // strength, cardio, flexibility, hiit
  exercises: json("exercises").$type<Exercise[]>().notNull(),
});

// User workouts - tracks completed workouts
export const userWorkouts = pgTable("user_workouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  workoutId: integer("workout_id").notNull().references(() => workouts.id),
  date: timestamp("date").defaultNow(),
  duration: integer("duration"), // in minutes
  caloriesBurned: integer("calories_burned"),
  completed: boolean("completed").default(false),
});

// Food items
export const foods = pgTable("foods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  calories: integer("calories").notNull(),
  protein: real("protein").default(0), // in grams
  carbs: real("carbs").default(0), // in grams
  fat: real("fat").default(0), // in grams
  servingSize: text("serving_size"),
});

// User meals
export const userMeals = pgTable("user_meals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").defaultNow(),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  foodId: integer("food_id").notNull().references(() => foods.id),
  servings: real("servings").default(1),
});

// Activity tracking
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").defaultNow(),
  steps: integer("steps").default(0),
  caloriesBurned: integer("calories_burned").default(0),
  activeMinutes: integer("active_minutes").default(0),
});

// Weight tracking
export const weightLogs = pgTable("weight_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").defaultNow(),
  weight: real("weight").notNull(), // in kg
});

// Type definitions
export type Exercise = {
  id: number;
  name: string;
  sets?: number;
  reps?: number;
  duration?: number; // in seconds
  description?: string;
};

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
});

export const insertUserWorkoutSchema = createInsertSchema(userWorkouts).omit({
  id: true,
});

export const insertFoodSchema = createInsertSchema(foods).omit({
  id: true,
});

export const insertUserMealSchema = createInsertSchema(userMeals).omit({
  id: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

export const insertWeightLogSchema = createInsertSchema(weightLogs).omit({
  id: true,
});

// Types for database operations
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Workout = typeof workouts.$inferSelect;

export type InsertUserWorkout = z.infer<typeof insertUserWorkoutSchema>;
export type UserWorkout = typeof userWorkouts.$inferSelect;

export type InsertFood = z.infer<typeof insertFoodSchema>;
export type Food = typeof foods.$inferSelect;

export type InsertUserMeal = z.infer<typeof insertUserMealSchema>;
export type UserMeal = typeof userMeals.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export type InsertWeightLog = z.infer<typeof insertWeightLogSchema>;
export type WeightLog = typeof weightLogs.$inferSelect;
