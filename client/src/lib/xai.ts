import { User, Workout } from "./types";

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
  }
): Promise<string> {
  const prompt = `
    Generate a personalized workout plan for a user with the following profile:
    - Fitness level: ${user.fitnessLevel}
    - Age: ${user.age || 'Not specified'}
    - Height: ${user.height ? `${user.height} cm` : 'Not specified'}
    - Weight: ${user.weight ? `${user.weight} kg` : 'Not specified'}
    - Workout frequency: ${user.workoutFrequency} times per week

    User's fitness goals: ${preferences.goals || 'General fitness improvement'}
    Injuries or limitations: ${preferences.injuries || 'None specified'}
    Available equipment: ${preferences.equipment || 'Basic gym equipment'}

    Please create a structured workout plan with exercises, sets, reps, and a brief description.
  `;

  // If xAI API key is available, use the real API
  if (hasXaiKey) {
    try {
      return await callXaiApi(prompt);
    } catch (error) {
      console.error("Error calling xAI API:", error);
      // Fall back to simulated response
      return generateSimulatedResponse(user, preferences);
    }
  } else {
    console.log("No xAI API key available, using simulated response");
    // If no API key, use a simulated response with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return generateSimulatedResponse(user, preferences);
  }
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
import { User, Workout } from "./types";

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
    "category": "${userGoals.includes('strength') ? 'strength' : userGoals.includes('cardio') ? 'cardio' : 'full body'}",
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

    return {
      id: Math.floor(Math.random() * 10000),
      name: parsedResponse.name,
      description: parsedResponse.description,
      imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&auto=format",
      duration: parsedResponse.duration,
      caloriesBurned: parsedResponse.caloriesBurned,
      difficulty: parsedResponse.difficulty,
      category: parsedResponse.category,
      exercises: parsedResponse.exercises
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
      category: "full body",
      exercises: [
        {
          name: "Push-ups",
          duration: 5,
          sets: 3,
          reps: 10
        },
        {
          name: "Squats",
          duration: 5,
          sets: 3,
          reps: 15
        },
        {
          name: "Plank",
          duration: 5,
          sets: 3,
          reps: 1
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