import { Workout } from './types';

/**
 * Specialized workout templates for various categories
 */

// Chest workout template
export const chestWorkout: Workout = {
  id: 5001,
  name: "Ultimate Chest Builder",
  description: "Build strength and definition in your chest with this focused workout routine",
  imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&auto=format",
  duration: 45,
  caloriesBurned: 350,
  difficulty: "intermediate",
  category: "chest",
  exercises: [
    {
      id: 1,
      name: "Barbell Bench Press",
      sets: 4,
      reps: 10,
      description: "Lie on bench with feet on floor, grip barbell slightly wider than shoulders, lower to chest and press up",
      imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format"
    },
    {
      id: 2,
      name: "Incline Dumbbell Press",
      sets: 3,
      reps: 12,
      description: "On inclined bench, press dumbbells from shoulder level to extended position",
      imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format"
    },
    {
      id: 3,
      name: "Push-ups",
      sets: 3,
      reps: 15,
      description: "Standard push-ups with hands slightly wider than shoulders",
      imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500&auto=format"
    },
    {
      id: 4,
      name: "Chest Flyes",
      sets: 3,
      reps: 12,
      description: "Lie on bench with dumbbells extended above chest, lower weights in arc motion",
      imageUrl: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=500&auto=format"
    },
    {
      id: 5,
      name: "Cable Crossovers",
      sets: 3,
      reps: 15,
      description: "Standing between cable machines, pull handles together in front of chest",
      imageUrl: "https://images.unsplash.com/photo-1596357395217-80de13130e92?w=500&auto=format"
    }
  ]
};

// Back workout template
export const backWorkout: Workout = {
  id: 5002,
  name: "Strong Back Builder",
  description: "Develop a strong, well-defined back with this comprehensive workout",
  imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500&auto=format",
  duration: 50,
  caloriesBurned: 380,
  difficulty: "intermediate",
  category: "back",
  exercises: [
    {
      id: 1,
      name: "Pull-ups",
      sets: 4,
      reps: 8,
      description: "Hang from bar with hands wider than shoulders, pull up until chin clears bar",
      imageUrl: "https://images.unsplash.com/photo-1598266663439-2056e6900339?w=500&auto=format"
    },
    {
      id: 2,
      name: "Bent-Over Barbell Rows",
      sets: 3,
      reps: 12,
      description: "Bend at hips with slight knee bend, pull barbell to lower chest",
      imageUrl: "https://images.unsplash.com/photo-1603930949705-4b78a3b12892?w=500&auto=format"
    },
    {
      id: 3,
      name: "Seated Cable Rows",
      sets: 3,
      reps: 12,
      description: "Sit at cable machine, pull handle to abdomen while maintaining upright posture",
      imageUrl: "https://images.unsplash.com/photo-1598575306932-8d2faef20f3f?w=500&auto=format"
    },
    {
      id: 4,
      name: "Lat Pulldowns",
      sets: 3,
      reps: 12,
      description: "Sit at machine, grip bar wide, pull down to upper chest",
      imageUrl: "https://images.unsplash.com/photo-1627483297886-49230313b592?w=500&auto=format"
    },
    {
      id: 5,
      name: "Deadlifts",
      sets: 3,
      reps: 10,
      description: "Stand with feet hip-width apart, bend at hips and knees to grip barbell, stand up straight",
      imageUrl: "https://images.unsplash.com/photo-1598268030500-8c0fab881972?w=500&auto=format"
    }
  ]
};

// Biceps workout template
export const bicepsWorkout: Workout = {
  id: 5003,
  name: "Biceps Blast",
  description: "Sculpt and strengthen your biceps with this focused arm workout",
  imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format",
  duration: 40,
  caloriesBurned: 300,
  difficulty: "intermediate",
  category: "biceps",
  exercises: [
    {
      id: 1,
      name: "Standing Barbell Curls",
      sets: 4,
      reps: 10,
      description: "Stand with feet shoulder-width apart, curl barbell up to shoulders",
      imageUrl: "https://images.unsplash.com/photo-1584952811565-c4c4036204e0?w=500&auto=format"
    },
    {
      id: 2,
      name: "Alternating Dumbbell Curls",
      sets: 3,
      reps: 12,
      description: "Standing with dumbbells at sides, curl one arm at a time",
      imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&auto=format"
    },
    {
      id: 3,
      name: "Hammer Curls",
      sets: 3,
      reps: 12,
      description: "Curl dumbbells with palms facing each other throughout movement",
      imageUrl: "https://images.unsplash.com/photo-1613932068838-9970242930b4?w=500&auto=format"
    },
    {
      id: 4,
      name: "Concentration Curls",
      sets: 3,
      reps: 12,
      description: "Sit on bench, elbow on inner thigh, curl dumbbell to shoulder",
      imageUrl: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=500&auto=format"
    },
    {
      id: 5,
      name: "Cable Curls",
      sets: 3,
      reps: 15,
      description: "Stand facing cable machine, curl handle up to shoulders",
      imageUrl: "https://images.unsplash.com/photo-1584952811565-c4c4036204e0?w=500&auto=format"
    }
  ]
};

// CrossFit workout template
export const crossfitWorkout: Workout = {
  id: 5004,
  name: "CrossFit Challenge",
  description: "High-intensity functional training to build strength, endurance and conditioning",
  imageUrl: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=500&auto=format",
  duration: 35,
  caloriesBurned: 450,
  difficulty: "advanced",
  category: "crossfit",
  exercises: [
    {
      id: 1,
      name: "Box Jumps",
      sets: 3,
      reps: 15,
      description: "Jump onto sturdy box or platform, step or jump back down",
      imageUrl: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=500&auto=format"
    },
    {
      id: 2,
      name: "Kettlebell Swings",
      sets: 3,
      reps: 20,
      description: "With feet shoulder-width apart, swing kettlebell from between legs to chest height",
      imageUrl: "https://images.unsplash.com/photo-1604247584233-99c60363b869?w=500&auto=format"
    },
    {
      id: 3,
      name: "Burpees",
      sets: 3,
      reps: 15,
      description: "From standing, drop to push-up position, perform push-up, jump back to standing, jump up",
      imageUrl: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&auto=format"
    },
    {
      id: 4,
      name: "Wall Balls",
      sets: 3,
      reps: 15,
      description: "Hold medicine ball at chest, squat down, stand and throw ball to target on wall",
      imageUrl: "https://images.unsplash.com/photo-1615804509922-b8f7eb460982?w=500&auto=format"
    },
    {
      id: 5,
      name: "Overhead Squats",
      sets: 3,
      reps: 12,
      description: "With barbell overhead, perform full squat while keeping arms extended",
      imageUrl: "https://images.unsplash.com/photo-1544213155-2aa9fa11e366?w=500&auto=format"
    }
  ]
};

// Collection of all specialized workouts
export const specializedWorkouts: Record<string, Workout> = {
  chest: chestWorkout,
  back: backWorkout,
  biceps: bicepsWorkout,
  crossfit: crossfitWorkout
};

// Function to get a workout by category
export function getSpecializedWorkout(category: string): Workout | undefined {
  return specializedWorkouts[category.toLowerCase()];
}

// Function to get all specialized workouts
export function getAllSpecializedWorkouts(): Workout[] {
  return Object.values(specializedWorkouts);
}