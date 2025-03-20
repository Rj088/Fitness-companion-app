import { User, Workout, Exercise } from "./types";

// Check if xAI API key is available
const hasXaiKey = typeof import.meta.env.VITE_XAI_API_KEY === 'string' && 
                  import.meta.env.VITE_XAI_API_KEY.length > 0;

/**
 * Generate a workout recommendation based on user profile and preferences
 */
export async function generateWorkoutRecommendation(
  user: User,
  preferences: {
    goals?: string;
    injuries?: string;
    equipment?: string;
    category?: 'strength' | 'cardio' | 'flexibility' | 'hiit';
  }
): Promise<string> {
  // Use a direct implementation that doesn't rely on an API
  // This way the code works on all platforms including iOS
  
  // First, log what we're generating
  console.log("Generating workout for user with fitness level:", user.fitnessLevel);
  console.log("User preferences:", preferences);
  
  // Add a slight delay to simulate API processing
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Determine workout category - use specified category or infer from goals
  const workoutCategory = preferences.category || 
    (preferences.goals?.includes('strength') ? 'strength' : 
     preferences.goals?.includes('cardio') ? 'cardio' : 
     preferences.goals?.includes('flexibility') ? 'flexibility' :
     preferences.goals?.includes('hiit') ? 'hiit' : 'strength');
  
  // Create different exercise sets based on workout category
  let exercises = [];
  let workoutName = '';
  let workoutDescription = '';
  let duration = user.fitnessLevel === 'beginner' ? 30 : user.fitnessLevel === 'intermediate' ? 45 : 60;
  let caloriesBurned = user.fitnessLevel === 'beginner' ? 200 : user.fitnessLevel === 'intermediate' ? 350 : 500;
  
  switch (workoutCategory) {
    case 'cardio':
      workoutName = 'AI Personalized Cardio Workout';
      workoutDescription = `This cardio workout is designed for a ${user.fitnessLevel} with ${preferences.goals || "endurance"} goals, considering ${preferences.injuries || "no"} injuries, using ${preferences.equipment || "basic"} equipment.`;
      caloriesBurned += 100; // Cardio typically burns more calories
      exercises = [
        {
          name: "Jumping Jacks",
          sets: 3,
          duration: 60,
          description: "Full body cardio warm-up"
        },
        {
          name: "High Knees",
          sets: 3,
          duration: 45,
          description: "Rapid knee lifts to elevate heart rate"
        },
        {
          name: preferences.injuries?.includes('knee') ? "Seated Punches" : "Mountain Climbers",
          sets: 3,
          duration: 45,
          description: "Dynamic cardio movement"
        },
        {
          name: "Burpees",
          sets: 3,
          reps: user.fitnessLevel === 'beginner' ? 8 : user.fitnessLevel === 'intermediate' ? 12 : 15,
          description: "Full body explosive movement"
        },
        {
          name: "Jump Rope",
          sets: 2,
          duration: 60,
          description: "Continuous jumping for endurance"
        }
      ];
      break;
      
    case 'strength':
      workoutName = 'AI Personalized Strength Workout';
      workoutDescription = `This strength workout is designed for a ${user.fitnessLevel} with ${preferences.goals || "muscle building"} goals, considering ${preferences.injuries || "no"} injuries, using ${preferences.equipment || "basic"} equipment.`;
      exercises = [
        {
          name: "Push-ups",
          sets: 4,
          reps: user.fitnessLevel === 'beginner' ? 8 : user.fitnessLevel === 'intermediate' ? 12 : 15,
          description: "Upper body compound movement"
        },
        {
          name: preferences.equipment?.includes('dumbbell') ? "Dumbbell Shoulder Press" : "Pike Push-ups",
          sets: 3,
          reps: 10,
          description: "Shoulder strengthening exercise"
        },
        {
          name: preferences.injuries?.includes('knee') ? "Seated Curls" : "Squats",
          sets: 4,
          reps: 12,
          description: "Lower body compound movement"
        },
        {
          name: preferences.equipment?.includes('dumbbell') ? "Dumbbell Rows" : "Bodyweight Rows",
          sets: 3,
          reps: 12,
          description: "Back strengthening pull exercise"
        },
        {
          name: "Plank",
          sets: 3,
          duration: 45,
          description: "Core stability exercise"
        }
      ];
      break;
      
    case 'flexibility':
      workoutName = 'AI Personalized Flexibility Workout';
      workoutDescription = `This flexibility workout is designed for a ${user.fitnessLevel} with ${preferences.goals || "mobility"} goals, considering ${preferences.injuries || "no"} injuries, using ${preferences.equipment || "minimal"} equipment.`;
      caloriesBurned -= 50; // Flexibility workouts typically burn fewer calories
      exercises = [
        {
          name: "Dynamic Stretching Warm-up",
          sets: 1,
          duration: 180,
          description: "Gentle movement to prepare the body"
        },
        {
          name: "Downward Dog to Upward Dog Flow",
          sets: 3,
          reps: 10,
          description: "Yoga flow for spine mobility"
        },
        {
          name: preferences.injuries?.includes('back') ? "Modified Forward Fold" : "Standing Forward Fold",
          sets: 3,
          duration: 30,
          description: "Hamstring and lower back stretch"
        },
        {
          name: "Pigeon Pose",
          sets: 2,
          duration: 60,
          description: "Hip opener (each side)"
        },
        {
          name: "Child's Pose to Cobra Flow",
          sets: 3,
          reps: 8,
          description: "Spine mobility and flexibility"
        },
        {
          name: "Full Body Relaxation",
          sets: 1,
          duration: 180,
          description: "Final relaxation and breathing"
        }
      ];
      break;
      
    case 'hiit':
      workoutName = 'AI Personalized HIIT Workout';
      workoutDescription = `This high-intensity interval training workout is designed for a ${user.fitnessLevel} with ${preferences.goals || "fat burning"} goals, considering ${preferences.injuries || "no"} injuries, using ${preferences.equipment || "minimal"} equipment.`;
      caloriesBurned += 150; // HIIT typically burns more calories
      exercises = [
        {
          name: "Warm-up Jog in Place",
          sets: 1,
          duration: 120,
          description: "Light cardio to raise heart rate"
        },
        {
          name: "Burpees",
          sets: 4,
          duration: 30,
          description: "High intensity with 30 sec rest between sets"
        },
        {
          name: preferences.injuries?.includes('knee') ? "Modified Jumping Jacks" : "Jumping Lunges",
          sets: 4,
          duration: 30,
          description: "Explosive leg movement with 30 sec rest"
        },
        {
          name: "Mountain Climbers",
          sets: 4,
          duration: 30,
          description: "Core and cardio with 30 sec rest"
        },
        {
          name: preferences.equipment?.includes('dumbbell') ? "Dumbbell Thrusters" : "Squat Jumps",
          sets: 4,
          duration: 30,
          description: "Full body power with 30 sec rest"
        },
        {
          name: "Plank to Push-up",
          sets: 4,
          duration: 30,
          description: "Upper body strength with 30 sec rest"
        },
        {
          name: "Cool Down",
          sets: 1,
          duration: 180,
          description: "Gradual heart rate reduction and stretching"
        }
      ];
      break;
      
    default:
      // Default to a general workout if no specific category
      workoutName = `AI Personalized ${(preferences.goals ? preferences.goals.charAt(0).toUpperCase() + preferences.goals.slice(1) : "Fitness")} Workout`;
      workoutDescription = `This workout is designed for a ${user.fitnessLevel} with ${preferences.goals || "general fitness"} goals, considering ${preferences.injuries || "no"} injuries, using ${preferences.equipment || "basic"} equipment.`;
      exercises = [
        {
          name: preferences.goals?.includes('strength') ? 'Dumbbell Curls' : 'Jumping Jacks',
          sets: 3,
          reps: 12,
          description: "Maintain proper form throughout the exercise"
        },
        {
          name: preferences.equipment?.includes('dumbbell') ? 'Dumbbell Press' : 'Push-ups',
          sets: 3,
          reps: 10,
          description: "Focus on full range of motion"
        },
        {
          name: preferences.injuries?.includes('knee') ? 'Seated Shoulder Press' : 'Squats',
          sets: 3,
          reps: 15,
          description: "Keep your back straight and go at your own pace"
        },
        {
          name: "Plank",
          sets: 3,
          duration: 30,
          description: "Hold position with core engaged"
        }
      ];
  }
  
  // Generate complete workout JSON
  const workoutJson = {
    name: workoutName,
    description: workoutDescription,
    duration,
    difficulty: user.fitnessLevel,
    caloriesBurned,
    category: workoutCategory,
    exercises
  };
  
  // Return as JSON string
  return JSON.stringify(workoutJson, null, 2);
}

/**
 * Call the xAI API for a workout recommendation
 */
async function callXaiApi(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_XAI_API_KEY;

  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: "You are a certified personal trainer specializing in creating personalized workout plans."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Generate a simulated workout recommendation response
 */
function generateSimulatedResponse(
  user: User,
  preferences: {
    goals?: string;
    injuries?: string;
    equipment?: string;
  }
): string {
  return `
    # Personalized ${user.fitnessLevel.charAt(0).toUpperCase() + user.fitnessLevel.slice(1)} Workout Plan

    ## Workout Overview
    - Duration: 45 minutes
    - Frequency: ${user.workoutFrequency}x per week
    - Focus: Full body with emphasis on ${preferences.goals || 'overall strength'}

    ## Exercise Plan

    1. **Warm-up** (5 minutes)
       - Light cardio: Jumping jacks, high knees
       - Dynamic stretching

    2. **Main Workout** (35 minutes)
       - Bodyweight squats: 3 sets × 15 reps
       - Push-ups (modified if needed): 3 sets × 10 reps
       - Dumbbell rows: 3 sets × 12 reps per arm
       - Planks: 3 sets × 30 seconds
       - Walking lunges: 2 sets × 10 steps each leg
       - Glute bridges: 3 sets × 15 reps

    3. **Cool-down** (5 minutes)
       - Static stretching
       - Deep breathing

    ## Tips
    - Rest 60-90 seconds between sets
    - Focus on proper form rather than speed
    - Stay hydrated throughout your workout
    - Adjust weights/reps based on your comfort level
  `;
}

// XAI functions for workout generation

export async function generateWorkoutRecommendationAI(user: User, preferences: {
  goals: string;
  injuries: string;
  equipment: string;
}): Promise<string> {
  // This would normally be an API call to an AI service
  // For now, we'll generate a structured response
  const fitnessLevel = user.fitnessLevel || 'beginner';
  const userGoals = preferences.goals || 'general fitness';
  const userInjuries = preferences.injuries || 'none';
  const userEquipment = preferences.equipment || 'minimal';

  // Wait to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Generate a response based on user data
  const response = `
  {
    "name": "AI Personalized ${userGoals.charAt(0).toUpperCase() + userGoals.slice(1)} Workout",
    "description": "This workout is designed for a ${fitnessLevel} with ${userGoals} goals, considering ${userInjuries} injuries, using ${userEquipment} equipment.",
    "duration": ${fitnessLevel === 'beginner' ? 30 : fitnessLevel === 'intermediate' ? 45 : 60},
    "difficulty": "${fitnessLevel}",
    "caloriesBurned": ${fitnessLevel === 'beginner' ? 200 : fitnessLevel === 'intermediate' ? 350 : 500},
    "category": "${userGoals.includes('strength') ? 'strength' : userGoals.includes('cardio') ? 'cardio' : userGoals.includes('flexibility') ? 'flexibility' : 'strength'}",
    "exercises": [
      {
        "name": "${userGoals.includes('strength') ? 'Dumbbell Curls' : 'Jumping Jacks'}",
        "duration": 5,
        "sets": 3,
        "reps": 12
      },
      {
        "name": "${userEquipment.includes('minimal') ? 'Push-ups' : 'Bench Press'}",
        "duration": 5,
        "sets": 3,
        "reps": 10
      },
      {
        "name": "${userInjuries.includes('knee') ? 'Seated Shoulder Press' : 'Squats'}",
        "duration": 5,
        "sets": 3,
        "reps": 15
      },
      {
        "name": "Plank",
        "duration": 5,
        "sets": 3,
        "reps": 1
      }
    ]
  }`;

  return response;
}

export function parseWorkoutResponse(aiResponse: string): Workout {
  try {
    const parsedResponse = JSON.parse(aiResponse);
    
    // Add missing IDs to exercises if needed
    const exercises = parsedResponse.exercises.map((exercise: any, index: number) => ({
      id: exercise.id || index + 1,
      ...exercise
    }));

    return {
      id: Math.floor(Math.random() * 10000),
      name: parsedResponse.name,
      description: parsedResponse.description,
      imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&auto=format",
      duration: parsedResponse.duration,
      caloriesBurned: parsedResponse.caloriesBurned,
      difficulty: parsedResponse.difficulty,
      category: parsedResponse.category === "full body" ? "strength" : parsedResponse.category,
      exercises
    };
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return {
      id: Math.floor(Math.random() * 10000),
      name: "AI Custom Workout",
      description: "A personalized workout plan based on your profile",
      imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&auto=format",
      duration: 30,
      caloriesBurned: 300,
      difficulty: "intermediate",
      category: "strength",
      exercises: [
        {
          id: 1,
          name: "Push-ups",
          duration: 5,
          sets: 3,
          reps: 10,
          description: "Standard push-ups"
        },
        {
          id: 2,
          name: "Squats",
          duration: 5,
          sets: 3,
          reps: 15,
          description: "Bodyweight squats"
        },
        {
          id: 3,
          name: "Plank",
          duration: 30,
          sets: 3,
          reps: 1,
          description: "Core exercise"
        }
      ]
    };
  }
}

/**
 * Parse the AI-generated workout text into a structured workout object
 */
export function parseWorkoutResponseOld(responseText: string) {
  // Extract exercises from the response text
  const exerciseRegex = /[-*] ([^:]+):\s*(\d+)\s*sets\s*[×x]\s*(\d+)\s*reps/g;
  const durationRegex = /[-*] ([^:]+):\s*(\d+)\s*sets\s*[×x]\s*(\d+)\s*seconds/g;

  const extractedExercises = [];
  let match;

  // Extract standard rep-based exercises
  while ((match = exerciseRegex.exec(responseText)) !== null) {
    extractedExercises.push({
      id: extractedExercises.length + 1,
      name: match[1].trim(),
      sets: parseInt(match[2]),
      reps: parseInt(match[3]),
      description: `${match[1].trim()} - ${match[2]} sets of ${match[3]} reps`
    });
  }

  // Extract duration-based exercises
  while ((match = durationRegex.exec(responseText)) !== null) {
    extractedExercises.push({
      id: extractedExercises.length + 1,
      name: match[1].trim(),
      sets: parseInt(match[2]),
      duration: parseInt(match[3]),
      description: `${match[1].trim()} - ${match[2]} sets of ${match[3]} seconds`
    });
  }

  // If no exercises were extracted, use default ones
  const exerciseList = extractedExercises.length > 0 ? extractedExercises : [
    { id: 1, name: "Bodyweight Squats", sets: 3, reps: 15, description: "Basic squats to warm up" },
    { id: 2, name: "Push-ups", sets: 3, reps: 10, description: "Standard push-ups" },
    { id: 3, name: "Dumbbell Rows", sets: 3, reps: 12, description: "Single arm dumbbell rows" },
    { id: 4, name: "Planks", sets: 3, duration: 30, description: "Core stabilization" },
    { id: 5, name: "Walking Lunges", sets: 2, reps: 20, description: "10 steps each leg" },
    { id: 6, name: "Glute Bridges", sets: 3, reps: 15, description: "Hip raises for glute activation" },
  ];

  // Extract focus area to determine category
  let category = "strength";
  if (responseText.toLowerCase().includes("cardio") || responseText.toLowerCase().includes("endurance")) {
    category = "cardio";
  } else if (responseText.toLowerCase().includes("flexibility") || responseText.toLowerCase().includes("mobility")) {
    category = "flexibility";
  } else if (responseText.toLowerCase().includes("hiit") || responseText.toLowerCase().includes("interval")) {
    category = "hiit";
  }

  // Determine difficulty
  let difficulty = "beginner";
  if (responseText.toLowerCase().includes("advanced") || responseText.toLowerCase().includes("intense")) {
    difficulty = "advanced";
  } else if (responseText.toLowerCase().includes("intermediate") || responseText.toLowerCase().includes("moderate")) {
    difficulty = "intermediate";
  }

  // Extract duration
  const durationMatch = responseText.match(/Duration:\s*(\d+)/);
  const duration = durationMatch ? parseInt(durationMatch[1]) : 45;

  return {
    id: Math.floor(Math.random() * 10000), // Generate a random ID for the workout
    name: "AI Personalized Workout",
    description: responseText.split("\n").slice(0, 5).join("\n").substring(0, 150) + "...",
    imageUrl: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=500&auto=format",
    duration,
    caloriesBurned: Math.floor(duration * 7), // Rough estimate based on duration
    difficulty,
    category,
    exercises: exerciseList
  };
}